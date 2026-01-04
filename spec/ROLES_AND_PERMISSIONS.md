# Roles & Permissions (RBAC)

## Roles (Mandatory)
- resident
- committee
- admin_root

## Role Hierarchy
admin_root > committee > resident

## Hard Rules (MUST ENFORCE)
- Resident never sees other residents’ identities or signature status list.
- Resident never sees project-wide document lists except those assigned to them.
- Committee never signs documents on behalf of residents.
- Committee cannot change resident apartment data.
- Committee cannot delete signed documents.
- Admin root can do everything, including impersonation and system deletion operations.

## Permission Keys (Atomic)
- project.read
- project.manage
- users.manage
- roles.manage
- documents.read_own
- documents.read_project
- documents.sign_own
- votes.read
- votes.vote
- votes.create
- votes.manage
- messages.read
- messages.create
- messages.schedule
- files.upload_project
- audit.read
- feature_flags.manage
- impersonate.use
- system.delete

## Permissions Matrix (Strict)
| Action | resident | committee | admin_root |
|------|---------|-----------|-----------|
| View own documents | ✅ | ❌ | ✅ |
| View all residents in project | ❌ | ✅ | ✅ |
| Sign own documents | ✅ | ❌ | ❌ |
| Vote | ✅ | ✅ | ✅ |
| Create vote | ❌ | ✅ | ✅ |
| Close/manage vote | ❌ | ✅ | ✅ |
| Read messages | ✅ | ✅ | ✅ |
| Create/schedule messages | ❌ | ✅ | ✅ |
| Upload project documents | ❌ | ✅ | ✅ |
| Create project | ❌ | ❌ | ✅ |
| Manage users | ❌ | ❌ | ✅ |
| Manage roles/permissions | ❌ | ❌ | ✅ |
| Feature flags | ❌ | ❌ | ✅ |
| Read audit logs | ❌ | ✅ (project scoped) | ✅ |
| Delete data | ❌ | ❌ | ✅ |

## Project Membership Rules
- Resident and Committee permissions apply only within projects they are members of.
- Admin root is system-level; may optionally be added as project member, but not required.

## Route Guarding Rules (UI)
- Resident routes: `/app/resident/*`
- Committee routes: `/app/committee/*`
- Admin routes: `/admin/*`
A user must never be able to access other role routes.

## Data Guarding Rules (Server/DB)
- All access must be verified by:
  1) role permissions
  2) project membership (where relevant)
  3) ownership constraints (own documents, own ballots)
