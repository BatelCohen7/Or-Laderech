# Or LaDerech — Urban Renewal Platform (PRD)

## 1. Product Summary
A multi-role web platform for managing urban renewal projects, connecting:
- Residents (regular tenants)
- Committee members (tenant representatives)
- System Admin (ROOT)

The platform provides dashboards, digital document signing, voting, official updates, and project tracking, with strict RBAC and audit trail.

## 2. Goals
- Reduce friction and chaos (WhatsApp / phone calls) by providing a single source of truth.
- Increase project progress through:
  - signature completion
  - structured votes
  - official messaging
- Provide secure, permissioned access:
  - residents see only their data
  - committee manages project processes
  - admin manages system-wide configuration

## 3. Non-Goals
- No public access.
- No resident-to-resident communication channels.
- No legal document editing inside the platform (documents are immutable once signed).

## 4. User Roles
- Resident (Regular Tenant)
- Committee Member (Tenant Representative)
- System Administrator (ROOT)

## 5. Core Modules
- Authentication & Authorization (RBAC)
- Dashboards per role
- Document Center (personal assignments + signing)
- Voting Center (create/manage/vote)
- Updates/Announcements (official messages)
- Apartment details (resident view)
- Project progress tracking
- Committee tools: reminders, analytics, tracking logs
- Admin tools: projects, users, roles/permissions, feature flags, monitoring/logs, impersonation
- Audit trail for critical actions

## 6. Role-based Dashboards (High Level)

### 6.1 Resident Dashboard — Purpose
Provide:
- personal status snapshot
- clear actions required (sign/vote)
- project progress visibility
Without management overload.

### 6.2 Committee Dashboard — Purpose
Provide:
- signature/vote progress control
- resident outreach (reminders, messages)
- project tracking and analytics
Without changing legal/resident data.

### 6.3 Admin ROOT Dashboard — Purpose
Provide full system-level control for DevOps/Dev/QA:
- create projects
- manage users and permissions
- feature flags
- monitoring/logs
- impersonation

## 7. Constraints & Security
- Strict RBAC at UI + server/data access level
- Multi-project isolation (project_id-based)
- Signed documents are immutable
- Voting is one ballot per user per vote
- All critical actions are logged in audit trail

## 8. Deliverables Expectations
The implementation must generate:
- routing per role
- guarded components & APIs
- dashboards per role (as defined in UI_WIREFRAME)
- flows (as defined in USER_FLOWS)
- DB schema (as defined in DATA_MODEL)
- tests (as defined in TEST_SCENARIOS)

Do not invent new features beyond the specification files in /spec.
