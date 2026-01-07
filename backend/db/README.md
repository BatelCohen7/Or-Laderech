# Database Layer Documentation

## Overview

This directory contains the database operations layer for Or LaDerech, separate from Prisma schema and migrations. It includes Row Level Security (RLS) policies, seed data, and operational scripts.

## Directory Structure

```
backend/db/
├── README.md           # This file - team-facing documentation
├── migrations/         # Custom SQL migrations (if needed, separate from Prisma)
├── rls/                # Row Level Security policies
│   ├── 001_helpers.sql      # Helper functions (current_user_id, role checks)
│   ├── 002_enable_rls.sql   # Enable RLS on all tables
│   └── 003_policies.sql     # All RLS policies per table
└── seeds/              # Seed data SQL scripts
    └── 001_seed_rbac.sql    # Roles, permissions, and role_permissions mapping
```

## Source of Truth

**Schema Definition**: `backend/prisma/schema.prisma`
- This is the single source of truth for database schema
- All table definitions, relationships, and constraints are defined here
- Use Prisma migrations to evolve the schema

**Prisma Migrations**: `backend/prisma/migrations/`
- Generated automatically by Prisma when running `prisma migrate dev`
- Contains migration history and SQL files
- Do not edit these files manually

**DB Operations Layer**: `backend/db/` (this directory)
- RLS policies that enforce security at the database level
- Seed data for initial setup (roles, permissions)
- Custom SQL scripts for operations not handled by Prisma

## Prisma Workflow

### Development

1. **Modify schema**: Edit `backend/prisma/schema.prisma`
2. **Create migration**: Run `npm run db:prisma:migrate:dev`
   - This creates a new migration in `backend/prisma/migrations/`
   - Applies the migration to your local database
   - Regenerates Prisma Client
3. **Generate client**: Run `npm run db:prisma:generate` (usually automatic after migrate)

### Production Deployment

1. **Apply migrations**: Run `npm run db:prisma:migrate:deploy`
   - Applies pending migrations without creating new ones
   - Safe for production environments

## Database Setup

### Local Development (Docker)

**Prerequisites**: Docker and Docker Compose installed

1. **Start PostgreSQL container**:
   ```bash
   docker run --name or-laderech-db \
     -e POSTGRES_USER=postgres \
     -e POSTGRES_PASSWORD=postgres \
     -e POSTGRES_DB=or_laderech \
     -p 5432:5432 \
     -d postgres:15
   ```

2. **Set DATABASE_URL**:
   ```bash
   # Linux/Mac
   export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/or_laderech?schema=public"
   
   # Windows PowerShell
   $env:DATABASE_URL="postgresql://postgres:postgres@localhost:5432/or_laderech?schema=public"
   
   # Windows CMD
   set DATABASE_URL=postgresql://postgres:postgres@localhost:5432/or_laderech?schema=public
   ```

3. **Apply Prisma migrations**:
   ```bash
   npm run db:prisma:migrate:deploy
   ```

4. **Apply RLS policies**:
   ```bash
   npm run db:rls
   ```

5. **Seed initial data**:
   ```bash
   npm run db:seed:sql
   ```

### Production (AWS RDS)

**High-level deployment notes** (detailed AWS setup not included here):

1. **Create RDS PostgreSQL instance** (PostgreSQL 15+ recommended)
2. **Set DATABASE_URL** environment variable in your deployment environment
3. **Run migrations**: `npm run db:prisma:migrate:deploy`
4. **Apply RLS**: `npm run db:rls`
5. **Seed data**: `npm run db:seed:sql` (idempotent, safe to run multiple times)

**Security considerations**:
- Use RDS security groups to restrict access
- Enable encryption at rest
- Use IAM database authentication if possible
- Store DATABASE_URL in secure environment variables (AWS Secrets Manager)

## Applying RLS Policies

RLS policies are applied using `psql` in order:

```bash
# Linux/Mac (bash)
for file in backend/db/rls/*.sql; do
  psql "$DATABASE_URL" -f "$file"
done

# Or use the npm script
npm run db:rls
```

**Windows PowerShell alternative**:
```powershell
Get-ChildItem backend/db/rls/*.sql | Sort-Object Name | ForEach-Object {
  psql $env:DATABASE_URL -f $_.FullName
}
```

**Windows CMD alternative**:
```cmd
for %f in (backend\db\rls\*.sql) do psql "%DATABASE_URL%" -f "%f"
```

**Order matters**: Files are numbered (001_, 002_, 003_, etc.) to ensure correct execution order:
1. `001_helpers.sql` - Creates helper functions used by policies
2. `002_enable_rls.sql` - Enables RLS on all tables
3. `003_policies.sql` - Creates all RLS policies
4. `002_apartment_users_max2_trigger.sql` - Enforces max 2 users per apartment
5. `003_apartment_composite_fk.sql` - Composite FK constraint for apartment_users
6. `004_document_assignments_immutable.sql` - Enforces immutability of signed assignments

## Seeding Data

Seed scripts are idempotent and safe to run multiple times:

```bash
# Seed RBAC (roles, permissions, mappings)
npm run db:seed:sql

# Seed demo data (optional - for development/demo)
psql "$DATABASE_URL" -f backend/db/seeds/002_demo_data.sql
```

**001_seed_rbac.sql** creates:
- Roles: `resident`, `committee`, `admin_root`
- Permissions: All permission keys from spec
- Role-permission mappings: Default assignments per role

**002_demo_data.sql** creates (for single project mode):
- 1 project
- 1 admin_root user
- 1 committee user
- 200 residents with apartments
- Sample document assignments (50 pending)
- 1 open vote with options
- 2 sample messages

**Note**: If Prisma seeding exists (`prisma/seed.ts`), it may also seed data. The SQL seed is provided for clarity and can be used independently.

## Script Naming Convention

All SQL scripts in `rls/` and `seeds/` use numeric prefixes to ensure ordering:
- `001_*.sql` - First to execute
- `002_*.sql` - Second to execute
- `003_*.sql` - Third to execute
- etc.

When adding new scripts, use the next available number and descriptive names.

## RLS Policy Overview

Row Level Security enforces access control at the database level:

- **Residents**: Can only see their own data (documents, ballots, apartment)
- **Committee**: Can see project-scoped data but cannot sign documents or modify resident data
- **Admin Root**: Full system access

Key principles:
- Default deny: All tables deny access by default
- Policies allow access based on role and project membership
- Multi-project isolation: Users only see data from projects they belong to
- Signed documents are immutable: Committee cannot modify signed document_assignments

See `backend/db/rls/003_policies.sql` for detailed policy definitions.

## Database Constraints & Triggers

### Maximum 2 Users Per Apartment

The system enforces a maximum of 2 users per apartment via a database trigger.

**Trigger File**: `backend/db/migrations/002_apartment_users_max2_trigger.sql`

**Table**: `apartment_users` (join table between apartments and users)

**How it works**:
- Before inserting into `apartment_users`, the trigger checks the current count
- If count >= 2, the insert is rejected with an error: `'Apartment already has maximum 2 users (limit: 2)'`
- The trigger function `check_apartment_user_limit()` is automatically executed
- The constraint is enforced at both database level (trigger) and application level (service layer returns 409 Conflict)

**To apply the triggers and constraints**:
```bash
# Apply the max 2 users trigger
psql "$DATABASE_URL" -f backend/db/migrations/002_apartment_users_max2_trigger.sql

# Apply the composite FK constraint (ensures project_id consistency)
psql "$DATABASE_URL" -f backend/db/migrations/003_apartment_composite_fk.sql
```

**Verification**:
```sql
-- Check if triggers exist
SELECT tgname FROM pg_trigger WHERE tgname IN ('apartment_user_limit_trigger', 'apartment_user_limit_update_trigger');

-- Check if function exists
SELECT proname FROM pg_proc WHERE proname = 'check_apartment_user_limit';

-- Check if composite FK constraint exists
SELECT conname FROM pg_constraint WHERE conname = 'apartment_users_apartment_project_fk';
```

**Note**: 
- This constraint is also enforced at the service layer (`ApartmentsService.assignUserToApartment`) for better error messages (409 Conflict)
- The INSERT trigger prevents inserts that would exceed the limit
- The UPDATE trigger prevents changing `apartment_id` if target apartment already has 2 users
- Error code 23514 (CHECK_VIOLATION) is used for proper error handling
- Composite FK ensures `apartment_id` and `project_id` consistency between `apartment_users` and `apartments`

## Troubleshooting

### RLS policies not working

1. Verify RLS is enabled: `SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';`
2. Check helper function exists: `SELECT current_user_id();`
3. Verify session variable is set: Your application must set `app.user_id` before queries

### Migration conflicts

If Prisma migrations conflict:
1. Review migration history: `ls backend/prisma/migrations/`
2. Reset development database (destructive): `prisma migrate reset`
3. Create new migration: `npm run db:prisma:migrate:dev`

### Seed data already exists

Seed scripts use `ON CONFLICT DO NOTHING` or `INSERT ... WHERE NOT EXISTS` patterns, so running them multiple times is safe.

## Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL RLS Documentation](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- System Specification: `spec/UNIFIED_SYSTEM_SPEC.md`
- Data Model: `spec/DATA_MODEL.md`
- Roles & Permissions: `spec/ROLES_AND_PERMISSIONS.md`
