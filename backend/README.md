# Or LaDerech Backend

Production-grade NestJS backend for multi-tenant urban renewal platform.

## Features

- **Multi-tenant isolation** - Project-based data isolation
- **RBAC** - Role-based access control (resident, committee, admin_root)
- **Audit trail** - All critical actions logged
- **JWT authentication** - Access + refresh tokens
- **Document signing** - Resident document assignment and signing
- **Voting system** - Create, manage, and vote on polls
- **Messaging** - Scheduled messages with audience filters
- **Project tracking** - Logs and timeline
- **Admin platform** - User management, roles, permissions, impersonation
- **Cloud-ready** - Storage and job queue abstractions (S3/Redis ready)

## Prerequisites

- Node.js 18+
- PostgreSQL 15+
- npm or yarn

## Local Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

Create a `.env` file in the `backend` directory:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/or_laderech?schema=public"
JWT_SECRET="your-secret-key-change-in-production"
JWT_REFRESH_SECRET="your-refresh-secret-key-change-in-production"
JWT_EXPIRES_IN="24h"
JWT_REFRESH_EXPIRES_IN="7d"
NODE_ENV="development"
PORT=3000
API_PREFIX="api/v1"
```

### 3. Run Database Migrations

```bash
# Generate Prisma Client
npm run db:prisma:generate

# Run migrations
npm run db:prisma:migrate:dev

# Apply RLS policies
npm run db:rls

# Seed initial data (roles, permissions)
npm run db:seed:sql
```

### 4. Start Development Server

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000/api/v1`

Swagger documentation: `http://localhost:3000/api/v1/docs`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_REFRESH_SECRET` | JWT refresh token secret | Required |
| `JWT_EXPIRES_IN` | Access token expiration | `24h` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiration | `7d` |
| `DOWNLOAD_JWT_SECRET` | Secret for download tokens (falls back to JWT_SECRET) | - |
| `DOWNLOAD_TOKEN_TTL` | Download token expiration (e.g., "10m", "600s", "1h") | `10m` |
| `NODE_ENV` | Environment (development/staging/production) | `development` |
| `PORT` | Server port | `3000` |
| `API_PREFIX` | API route prefix | `api/v1` |
| `STORAGE_PROVIDER` | Storage provider (local/s3) | `local` |
| `STORAGE_LOCAL_PATH` | Local storage path | `./storage` |
| `JOB_QUEUE_PROVIDER` | Job queue provider (in-memory/redis) | `in-memory` |
| `REDIS_URL` | Redis connection URL (if using redis) | - |
| `RATE_LIMIT_TTL` | Rate limit window (seconds) | `60` |
| `RATE_LIMIT_MAX` | Max requests per window | `100` |
| `CORS_ORIGIN` | CORS allowed origins | `*` |

### AWS/Production Variables (for future deployment)

```env
AWS_S3_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
```

## Project Structure

```
backend/
├── src/
│   ├── admin/           # Admin platform module
│   ├── audit/            # Audit trail service
│   ├── auth/             # Authentication module
│   ├── common/           # Shared utilities, guards, decorators
│   ├── config/           # Configuration service
│   ├── documents/        # Documents module
│   ├── health/            # Health check endpoints
│   ├── jobs/             # Job queue abstraction
│   ├── messages/         # Messages module
│   ├── project-logs/     # Project logs module
│   ├── projects/         # Projects module
│   ├── storage/          # Storage abstraction
│   ├── votes/            # Voting module
│   ├── app.module.ts     # Root module
│   └── main.ts            # Application entry point
├── prisma/
│   └── schema.prisma      # Database schema
├── db/
│   ├── rls/              # Row Level Security policies
│   └── seeds/            # Seed data
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh access token
- `GET /api/v1/auth/profile` - Get current user profile
- `PUT /api/v1/auth/profile` - Update profile

### Projects
- `GET /api/v1/projects` - List projects (user's projects)
- `GET /api/v1/projects/:id` - Get project details
- `GET /api/v1/projects/:id/overview` - Get project overview with stats
- `POST /api/v1/projects/:id/memberships` - Add user to project (admin)
- `GET /api/v1/projects/:id/memberships` - List project members

### Documents

#### Committee/Admin (Project-scoped)
- `POST /api/v1/projects/:projectId/documents` - Upload document (multipart/form-data)
- `POST /api/v1/projects/:projectId/documents/:documentId/assign` - Assign document to residents
- `GET /api/v1/projects/:projectId/documents/:documentId/assignments/summary` - Get assignment summary
- `GET /api/v1/projects/:projectId/documents` - List all project documents

#### Resident (Single Project Mode)
- `GET /api/v1/me/documents` - Get my assigned documents
- `GET /api/v1/me/documents/:assignmentId/download` - Get download URL
  - **Local storage**: Returns tokenized URL (`/api/v1/storage/download?token=...`) with short-lived token (default 10 minutes)
  - **S3 storage**: Returns S3 presigned URL directly (no token validation needed)
- `POST /api/v1/me/documents/:assignmentId/sign` - Sign document (idempotent)

### Votes

#### Committee/Admin (Project-scoped)
- `POST /api/v1/projects/:projectId/votes` - Create vote (committee/admin)
- `POST /api/v1/projects/:projectId/votes/:voteId/close` - Close vote (committee/admin)
- `GET /api/v1/projects/:projectId/votes/:voteId/results` - Get vote results (aggregated counts)
- `GET /api/v1/projects/:projectId/votes/:voteId/participation` - Get participation (voted/not voted list) - committee/admin only
- `GET /api/v1/projects/:projectId/votes` - List all votes in project

#### Resident (Single Project Mode)
- `GET /api/v1/me/votes` - Get my votes (open + past)
- `GET /api/v1/me/votes/:voteId` - Get vote details + my ballot
- `POST /api/v1/me/votes/:voteId/ballot` - Cast vote (idempotent)

#### Storage (Public - No Auth Required)
- `GET /api/v1/storage/download?token=...` - Download file (local storage only, token-based access)
  - **Note**: This endpoint does NOT require JWT authentication - relies on short-lived token validation only
  - **S3**: When using S3, `/me/documents/:id/download` returns presigned URL directly; no token validation on download path

### Messages

#### Committee/Admin (Project-scoped)
- `POST /api/v1/projects/:projectId/messages` - Create message (draft or scheduled)
- `POST /api/v1/projects/:projectId/messages/:messageId/send` - Send message immediately
- `POST /api/v1/projects/:projectId/messages/:messageId/schedule` - Schedule message for future
- `POST /api/v1/projects/:projectId/messages/:messageId/cancel` - Cancel scheduled message
- `GET /api/v1/projects/:projectId/messages` - List project messages
- `GET /api/v1/projects/:projectId/messages/:messageId/deliveries/summary` - Get delivery summary (read/unread counts)

#### Resident (Single Project Mode)
- `GET /api/v1/me/messages` - Get my messages
- `POST /api/v1/me/messages/:deliveryId/read` - Mark message as read (idempotent)

### Admin
- `GET /api/v1/admin/users` - List all users
- `POST /api/v1/admin/users` - Create user
- `GET /api/v1/admin/roles` - List roles and permissions
- `PUT /api/v1/admin/roles/:id/permissions` - Update role permissions
- `POST /api/v1/admin/impersonate/start` - Start impersonation
- `GET /api/v1/admin/audit` - Get audit logs

See Swagger docs at `/api/v1/docs` for complete API documentation.

## Voting Examples

### 1. Create a Vote (Committee/Admin)

```bash
# Replace <PROJECT_ID> and <COMMITTEE_TOKEN>
curl -X POST "http://localhost:3000/api/v1/projects/<PROJECT_ID>/votes" \
  -H "Authorization: Bearer <COMMITTEE_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Approve Phase 1 Construction",
    "description": "Vote on whether to proceed with Phase 1 construction",
    "audienceFilter": "ALL_RESIDENTS",
    "opensAt": "2024-01-01T00:00:00Z",
    "closesAt": "2024-01-31T23:59:59Z",
    "options": [
      { "label": "Yes", "sortOrder": 0 },
      { "label": "No", "sortOrder": 1 },
      { "label": "Abstain", "sortOrder": 2 }
    ]
  }'
```

### 2. Cast a Vote (Resident)

```bash
# Replace <VOTE_ID>, <OPTION_ID>, and <RESIDENT_TOKEN>
curl -X POST "http://localhost:3000/api/v1/me/votes/<VOTE_ID>/ballot" \
  -H "Authorization: Bearer <RESIDENT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "optionId": "<OPTION_ID>"
  }'
```

### 3. Get Vote Results (Committee/Admin)

```bash
# Replace <PROJECT_ID>, <VOTE_ID>, and <COMMITTEE_TOKEN>
curl -X GET "http://localhost:3000/api/v1/projects/<PROJECT_ID>/votes/<VOTE_ID>/results" \
  -H "Authorization: Bearer <COMMITTEE_TOKEN>"
```

### 4. Get Participation List (Committee/Admin)

```bash
# Replace <PROJECT_ID>, <VOTE_ID>, and <COMMITTEE_TOKEN>
curl -X GET "http://localhost:3000/api/v1/projects/<PROJECT_ID>/votes/<VOTE_ID>/participation" \
  -H "Authorization: Bearer <COMMITTEE_TOKEN>"
```

### 5. Close a Vote (Committee/Admin)

```bash
# Replace <PROJECT_ID>, <VOTE_ID>, and <COMMITTEE_TOKEN>
curl -X POST "http://localhost:3000/api/v1/projects/<PROJECT_ID>/votes/<VOTE_ID>/close" \
  -H "Authorization: Bearer <COMMITTEE_TOKEN>"
```

## Message Examples

### 1. Create and Send Message Immediately (Committee/Admin)

```bash
# Replace <PROJECT_ID> and <COMMITTEE_TOKEN>
curl -X POST "http://localhost:3000/api/v1/projects/<PROJECT_ID>/messages" \
  -H "Authorization: Bearer <COMMITTEE_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Important Announcement",
    "body": "This is an important announcement for all residents.",
    "audienceFilter": "ALL_RESIDENTS"
  }'
```

### 2. Create Scheduled Message (Committee/Admin)

```bash
# Replace <PROJECT_ID> and <COMMITTEE_TOKEN>
curl -X POST "http://localhost:3000/api/v1/projects/<PROJECT_ID>/messages" \
  -H "Authorization: Bearer <COMMITTEE_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Meeting Reminder",
    "body": "Don'\''t forget about the meeting tomorrow at 7 PM.",
    "audienceFilter": "ALL_RESIDENTS",
    "scheduledAt": "2024-01-15T10:00:00Z"
  }'
```

### 3. Send Scheduled Message Now (Committee/Admin)

```bash
# Replace <PROJECT_ID>, <MESSAGE_ID>, and <COMMITTEE_TOKEN>
curl -X POST "http://localhost:3000/api/v1/projects/<PROJECT_ID>/messages/<MESSAGE_ID>/send" \
  -H "Authorization: Bearer <COMMITTEE_TOKEN>"
```

### 4. Cancel Scheduled Message (Committee/Admin)

```bash
# Replace <PROJECT_ID>, <MESSAGE_ID>, and <COMMITTEE_TOKEN>
curl -X POST "http://localhost:3000/api/v1/projects/<PROJECT_ID>/messages/<MESSAGE_ID>/cancel" \
  -H "Authorization: Bearer <COMMITTEE_TOKEN>"
```

### 5. Get Delivery Summary (Committee/Admin)

```bash
# Replace <PROJECT_ID>, <MESSAGE_ID>, and <COMMITTEE_TOKEN>
curl -X GET "http://localhost:3000/api/v1/projects/<PROJECT_ID>/messages/<MESSAGE_ID>/deliveries/summary" \
  -H "Authorization: Bearer <COMMITTEE_TOKEN>"
```

### 6. Get My Messages (Resident)

```bash
# Replace <RESIDENT_TOKEN>
curl -X GET "http://localhost:3000/api/v1/me/messages" \
  -H "Authorization: Bearer <RESIDENT_TOKEN>"
```

### 7. Mark Message as Read (Resident)

```bash
# Replace <DELIVERY_ID> and <RESIDENT_TOKEN>
curl -X POST "http://localhost:3000/api/v1/me/messages/<DELIVERY_ID>/read" \
  -H "Authorization: Bearer <RESIDENT_TOKEN>"
```

## Testing

### Run Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Test Database

For integration tests, you can use SQLite:

```env
DATABASE_URL="file:./test.db"
```

Or use a separate PostgreSQL database:

```env
TEST_DATABASE_URL="postgresql://postgres:postgres@localhost:5432/or_laderech_test"
```

## Database Migrations

### Development

```bash
# Create and apply migration
npm run db:prisma:migrate:dev

# Generate Prisma Client
npm run db:prisma:generate
```

### Production

```bash
# Apply pending migrations (safe for production)
npm run db:prisma:migrate:deploy
```

## Security

- **RBAC** enforced at guard level
- **Multi-tenant isolation** via project membership guards
- **RLS policies** at database level
- **JWT authentication** with refresh tokens
- **Rate limiting** on all endpoints
- **Input validation** via class-validator
- **Audit trail** for all critical actions

## Cloud Deployment Readiness

The backend is designed to be cloud-ready:

- **Storage**: Abstracted interface (local filesystem → S3)
- **Job Queue**: Abstracted interface (in-memory → Redis/Bull)
- **Environment-based config**: Dev/staging/prod separation
- **Health checks**: `/health`, `/health/ready`, `/health/live`
- **Structured logging**: Ready for CloudWatch/DataDog

To switch to cloud services, update environment variables:

```env
STORAGE_PROVIDER=s3
JOB_QUEUE_PROVIDER=redis
REDIS_URL=redis://your-redis-url
```

## Troubleshooting

### Database Connection Issues

- Verify `DATABASE_URL` is correct
- Ensure PostgreSQL is running
- Check database exists: `createdb or_laderech`

### RLS Policies Not Working

- Verify RLS scripts applied: `npm run db:rls`
- Check session variable is set in application (PrismaService.setUserId)

### Migration Issues

- Reset development database: `npx prisma migrate reset`
- Check migration status: `npx prisma migrate status`

## License

Proprietary - Or LaDerech
