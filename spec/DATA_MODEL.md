# Data Model Specification

## Overview

This document describes the data model for Or LaDerech platform. For complete schema details, see `spec/UNIFIED_SYSTEM_SPEC.md` section 5.

## Core Entities

### Projects
- Multi-tenant isolation via `project_id`
- Each project contains apartments, documents, votes, messages, and logs

### Users & Roles
- Users have project memberships with roles (resident, committee, admin_root)
- RBAC enforced via `role_permissions` mapping

### Apartments

#### Apartment Model
- Scoped by `project_id`
- Contains physical apartment details (building, floor, unit_number, sqm, etc.)
- No direct user linkage (uses join table)

#### Apartment Users (Join Table)
- **Table**: `apartment_users`
- **Purpose**: Links users to apartments (many-to-many relationship)
- **Fields**:
  - `id` (UUID, primary key)
  - `project_id` (UUID, foreign key to projects)
  - `apartment_id` (UUID, foreign key to apartments)
  - `user_id` (UUID, foreign key to users)
  - `role_in_apartment` (text, optional: 'primary'/'secondary')
  - `created_at` (timestamp)

#### Constraints

1. **Unique Constraint**: `unique(apartment_id, user_id)`
   - Prevents duplicate user-apartment assignments

2. **Maximum 2 Users Per Apartment**
   - **Rule**: Each apartment can have a maximum of 2 resident users
   - **Enforcement**:
     - **Database Level**: PostgreSQL trigger (`check_apartment_user_limit()`) prevents inserts that would exceed 2 users
     - **Application Level**: Service layer (`ApartmentsService`) returns `409 Conflict` with message "Apartment already has 2 users"
   - **Trigger File**: `backend/db/migrations/002_apartment_users_max2_trigger.sql`
   - **Rationale**: Supports couples/families sharing an apartment while maintaining data integrity

3. **Indexes**:
   - `index(project_id)` - For project-scoped queries
   - `index(apartment_id)` - For apartment lookups
   - `index(user_id)` - For user apartment lookups

#### Access Rules

- **Residents**: Can only read apartments where they are linked via `apartment_users`
- **Committee**: Can read all apartments in their project (non-sensitive fields only)
- **Admin Root**: Full access to all apartments

## Documents

- Documents are assigned to residents via `document_assignments`
- Residents can sign their assigned documents
- Signed documents are immutable

## Votes

- Created by committee/admin
- Residents and committee can vote
- One vote per user per vote (enforced via unique constraint)

## Messages

- Created by committee/admin
- Can be scheduled for future delivery
- Audience filters: all_residents, unsigned_residents, committee_only

## Audit Trail

- All critical actions logged in `audit_events`
- Includes: actor, project, action, target, metadata, IP, user agent

## Multi-Project Capability

The system is designed for multi-project support:
- All entities scoped by `project_id`
- RLS policies enforce project isolation
- Users can be members of multiple projects (future expansion)

**Current Mode**: Single Project Mode (`SINGLE_PROJECT_MODE=true`)
- In practice, one project with ~200 residents
- System remains multi-project ready for future expansion
- `/api/app/me/*` endpoints auto-resolve project from user membership
