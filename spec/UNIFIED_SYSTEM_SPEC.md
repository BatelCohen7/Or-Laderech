# Or LaDerech — Unified System Spec (LLM-Ready)
Version: 1.0 (Unified)
Language: Hebrew-first (UI text can be Hebrew; code comments in English recommended)

---

## 0) מטרת המסמך
מסמך זה הוא Single Source of Truth עבור LLM לייצור מערכת מלאה:
- Frontend (UI/UX + Routing + Guards)
- Backend APIs (Auth + Business APIs)
- Database Schema (Tables + Relations + Constraints)
- Row Level Security (RLS) Policies
- User Flows לכל Role
- Test Scenarios (Functional + Security + RBAC + Multi-project isolation)

איסורים:
- לא להמציא פיצ'רים שלא קיימים במסמך.
- לא לשנות הרשאות/חוקי RBAC.
- לא לחשוף מידע בין פרויקטים.

---

## 1) System Overview
פלטפורמה להתחדשות עירונית המחברת:
- דיירים רגילים
- דיירים נציגים (ועד/נציגות)
- מנהל מערכת ROOT (DevOps/Dev/QA)

המערכת מבוססת RBAC עם בידוד פרויקטים (multi-project / multi-tenant) לפי `project_id`.
כל פעולה קריטית מתועדת ב־Audit Trail.

---

## 2) Roles & Permission Model (RBAC)

### 2.1 Roles (Mandatory)
- `resident` — דייר רגיל
- `committee` — דייר נציג (נציגות)
- `admin_root` — מנהל מערכת ROOT (Master)

> הערת תאימות לפרודקשן: במערכת קיימים תפקידי `cto/ceo/coo` (global_role). במסמך המאוחד:
- כל `cto/ceo/coo` ימופה ליכולת Admin (לפחות admin_root) או לחלופה "admin_staff" אם תרצו בהמשך.
- כרגע: להתייחס אליהם כ־admin_root כדי לא לחסום יכולות QA/DevOps.

### 2.2 Hierarchy
`admin_root > committee > resident`

### 2.3 Hard Rules (Non-negotiable)
- Resident לא רואה דיירים אחרים, לא שמות, לא רשימות חתימות.
- Resident רואה רק מסמכים *שהוקצו אליו*.
- Committee לא חותם מסמכים בשום מצב.
- Committee לא משנה נתוני דירה.
- Committee לא מוחק מסמכים חתומים.
- Admin ROOT יכול לבצע הכל (כולל impersonation, role mgmt, deletion).

### 2.4 Permission Keys (Atomic)
(רלוונטי למימוש Guards + Policies)
- `project.read`, `project.manage`
- `users.manage`
- `roles.manage`
- `documents.read_own`, `documents.read_project`, `documents.sign_own`
- `votes.read`, `votes.vote`, `votes.create`, `votes.manage`
- `messages.read`, `messages.create`, `messages.schedule`
- `files.upload_project`
- `audit.read`
- `feature_flags.manage`
- `impersonate.use`
- `system.delete`

### 2.5 Permissions Matrix (Strict)
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

---

## 3) UI/UX (Dashboards + Wireframes)

### 3.1 Resident Dashboard — Purpose
תמונת מצב אישית + פעולות נדרשות (חתימה/הצבעה) + סטטוס פרויקט.
ללא עומס ניהולי.

#### Resident Wireframe (Low-Fi)
HEADER:
- Project Name
- Global Status (Read-only): "שלב החתמות – 68% הושלמו"
- Profile + Logout

CARDS:
1) My Documents
- Status: Signed / Pending
- CTA: "Sign Now" (only if pending)

2) Active Votes
- Vote title
- Status: Voted / Not Voted
- Deadline
- CTA: "Vote Now"

3) Updates
- Official messages only (Developer/Committee)
- Read-only

SECTIONS:
- My Apartment (current + future additions + planning docs link)
- Project Progress (Planning → Signatures → Permit → Construction) read-only

QUICK ACTIONS:
Documents | Votes | Updates | Contact

Resident Restrictions:
- No list of residents
- No signature breakdown by names
- Cannot create votes
- Cannot send messages

---

### 3.2 Committee Dashboard — Purpose
שליטה ומעקב: חתימות, הצבעות, הודעות, Tracking, Analytics.

#### Committee Wireframe (Low-Fi)
HEADER:
- Project name
- Exact progress %
- Alerts for delays
- Profile + Logout

MANAGEMENT CARDS:
1) Signatures Status
- total % signed
- signed / not signed list
- CTA: send reminder to unsigned

2) Voting Management
- create vote
- real-time results
- close vote

3) Messages
- create message
- choose audience (all / unsigned)
- schedule

SECTIONS:
- Project Tracking (developer/lawyer status, upload general docs, meeting logs)
- Analytics (signature velocity, voting participation, risk indicator)

QUICK ACTION BAR:
Send Reminder | Create Vote | Upload Doc | New Message

Committee Restrictions:
- Cannot sign documents
- Cannot modify apartment data
- Cannot delete signed documents

---

### 3.3 Admin ROOT Dashboard — Purpose
System-level control for DevOps/Dev/QA, including:
- create projects
- user management + role mgmt
- permissions matrix mgmt
- feature flags
- monitoring & logs
- impersonation

Admin System Navigation:
Projects | Users | Roles & Permissions | Feature Flags | Monitoring & Logs | System Settings

---

## 4) User Flows (Mandatory)

### 4.1 Global Auth Flow
Login → Resolve Role + memberships → Redirect:
- resident → /app/resident/dashboard
- committee → /app/committee/dashboard
- admin_root → /admin

Edge cases:
- disabled user → block
- resident/committee with no project membership → show "no project assigned"

---

### 4.2 Resident Flows
R-01 Dashboard → Sign Document:
- Show CTA only if pending assignment exists
- Sign → status pending→signed, signed_at set
- Audit event: documents.sign
- Return dashboard (card updates)

R-02 Dashboard → Vote:
- Vote open + eligible + not voted
- Submit ballot once
- Audit event: votes.vote
- Return dashboard (status voted)

R-03 View Updates:
- Read-only official messages list/detail

R-04 View Apartment + Planning Docs:
- Read apartment info + open planning docs link

---

### 4.3 Committee Flows
C-01 Signature Status + Reminder:
- View signed/unsigned list (project scoped)
- Send reminder to unsigned (default)
- Audit event: messages.create or reminders.send (choose one key)

C-02 Create Vote:
- Create vote with options + deadline + audience
- Save draft or publish (open)
- Audit: votes.create

C-03 Manage Vote:
- Results real-time
- Close vote → status closed
- Audit: votes.close

C-04 Create Message:
- Compose + audience + schedule
- Send now or scheduled
- Audit: messages.create/messages.send

C-05 Project Tracking Logs:
- Create log entries (meeting/status)
- Upload general docs
- Audit: tracking.create / files.upload_project

---

### 4.4 Admin ROOT Flows
A-01 Create Project:
- Create project record
- Audit: project.create

A-02 Manage Users + Memberships:
- Create users
- Assign role(s)
- Assign project memberships
- Audit: users.manage

A-03 RBAC Management:
- Change role_permissions
- Audit: roles.manage

A-04 Impersonation:
- Start session + banner
- End session
- Audit: impersonate.start/impersonate.end
- Record in impersonation_sessions

A-05 Monitoring:
- view errors/performance
- view audit logs (filters)

---

## 5) Database Schema (Canonical Unified Model)

### 5.1 Core Entities (UUID PK)
Tables:
- projects
- users
- roles
- permissions
- role_permissions
- project_memberships

Resident domain:
- apartments
- documents
- document_assignments

Voting:
- votes
- vote_options
- vote_ballots

Messages/Updates:
- messages

Tracking:
- project_logs

Feature flags:
- feature_flags
- feature_flag_scopes

Audit/Security:
- audit_events
- impersonation_sessions

> NOTE: Existing PRD uses `project_members`, `vote_responses`, etc.
Canonical names above are recommended.
If you must keep legacy table names, map them 1:1 (see section 5.4).

---

### 5.2 Table Definitions (Fields)

#### projects
- id uuid pk
- name text required
- address text optional
- city text optional
- status_stage enum(planning|signatures|permit|construction)
- status_percent int (0..100)
- is_active bool default true
- created_by uuid fk users.id (optional if admin-root creates)
- created_at timestamp
- updated_at timestamp

#### users
- id uuid pk
- auth_provider_uid text unique (if using external auth)
- username text optional (legacy)
- email text unique
- name text
- phone text
- avatar_url text
- bio text
- global_role text optional (legacy: cto/ceo/coo/user)
- is_enabled bool default true
- created_at timestamp
- last_login_at timestamp

#### roles
Seed: resident, committee, admin_root
- id uuid pk
- name text unique
- description text

#### permissions
Seed keys (as in RBAC section)
- id uuid pk
- key text unique
- description text

#### role_permissions
- role_id uuid fk roles
- permission_id uuid fk permissions
PK(role_id, permission_id)

#### project_memberships
- id uuid pk
- project_id uuid fk projects
- user_id uuid fk users
- role_id uuid fk roles
- created_at timestamp
Unique(project_id, user_id)

#### apartments
- id uuid pk
- project_id uuid fk
- resident_user_id uuid fk users
- building text
- floor int
- unit_number text
- current_sqm numeric
- future_sqm numeric
- future_balcony_sqm numeric
- future_parking_count int
- planning_docs_url text
- created_at timestamp

#### documents
- id uuid pk
- project_id uuid fk
- title text
- doc_type enum(personal_contract|planning|general|legal)
- storage_path text
- created_by_user_id uuid fk users
- created_at timestamp

#### document_assignments
- id uuid pk
- project_id uuid fk
- document_id uuid fk documents
- resident_user_id uuid fk users
- status enum(pending|signed)
- signed_at timestamp nullable
- signature_provider text nullable
- signature_payload jsonb nullable
- created_at timestamp
Unique(document_id, resident_user_id)

#### votes
- id uuid pk
- project_id uuid fk
- title text
- description text
- audience_filter enum(all_residents|unsigned_residents|committee_only)
- deadline_at timestamp
- status enum(draft|open|closed)
- created_by_user_id uuid fk users
- created_at timestamp

#### vote_options
- id uuid pk
- vote_id uuid fk votes
- label text
- sort_order int

#### vote_ballots
- id uuid pk
- project_id uuid fk
- vote_id uuid fk votes
- voter_user_id uuid fk users
- option_id uuid fk vote_options
- voted_at timestamp
Unique(vote_id, voter_user_id)

#### messages
- id uuid pk
- project_id uuid fk
- title text
- body text
- audience_filter enum(all_residents|unsigned_residents|committee_only)
- scheduled_at timestamp nullable
- sent_at timestamp nullable
- created_by_user_id uuid fk users
- created_at timestamp

#### project_logs
- id uuid pk
- project_id uuid fk
- log_type enum(meeting|developer_update|lawyer_update|milestone)
- title text
- notes text
- created_by_user_id uuid fk users
- created_at timestamp

#### feature_flags
- id uuid pk
- key text unique
- description text
- is_enabled_global bool default false

#### feature_flag_scopes
- id uuid pk
- flag_id uuid fk feature_flags
- scope_type enum(project|role|environment)
- scope_value text
- is_enabled bool

#### audit_events
- id uuid pk
- occurred_at timestamp
- actor_user_id uuid fk users
- project_id uuid nullable
- action_key text
- target_type text
- target_id uuid nullable
- metadata jsonb nullable
- ip_address text nullable
- user_agent text nullable

#### impersonation_sessions
- id uuid pk
- admin_user_id uuid fk users
- impersonated_user_id uuid fk users
- started_at timestamp
- ended_at timestamp nullable
- reason text nullable

---

### 5.3 Seeds (Mandatory)
Roles:
- resident, committee, admin_root

Permissions keys:
project.read, project.manage, users.manage, roles.manage,
documents.read_own, documents.read_project, documents.sign_own,
votes.read, votes.vote, votes.create, votes.manage,
messages.read, messages.create, messages.schedule,
files.upload_project, audit.read, feature_flags.manage, impersonate.use, system.delete

Default role_permissions:
- resident: project.read, documents.read_own, documents.sign_own, votes.read, votes.vote, messages.read
- committee: project.read, documents.read_project, votes.read, votes.vote, votes.create, votes.manage,
            messages.read, messages.create, messages.schedule, files.upload_project, audit.read (project scope)
- admin_root: all permissions

---

### 5.4 Legacy Compatibility (Existing PRD Mapping)
If existing DB uses:
- `project_members` → map to `project_memberships`
- `vote_responses` → map to `vote_ballots`
- existing `documents` table currently behaves like project documents; ensure `document_assignments` exists for personal signing.

---

## 6) Database Security — RLS Policies (Updated Canonical Approach)

### 6.1 Helper Function: current_user_id()
Description: returns UUID of authenticated user.
Used across RLS policies.

### 6.2 Baseline Rule
By default, deny everything; allow via policies only.

### 6.3 users table
- SELECT: user can select own record only
  condition: users.id = current_user_id()
- UPDATE: user can update own record only
  condition: users.id = current_user_id()
- Admin root override (if using RLS-based admin): allow admin_root to select/update any user.

### 6.4 projects table
- SELECT: allow if:
  - user is project member (exists in project_memberships)
  - OR admin_root
- INSERT:
  - only admin_root can create projects (as per new spec)
- UPDATE/DELETE:
  - only admin_root

> NOTE: Your existing PRD allows "project creator" to update/delete.
Unified spec shifts project creation/management to admin_root. If you must keep creator flow, restrict it to admin_root only or creator+admin_root.

### 6.5 project_memberships table
- SELECT:
  - user can see own memberships
  - committee can see memberships in projects they are committee in (for lists)
  - admin_root can see all
- INSERT/DELETE:
  - only admin_root

### 6.6 documents table
- SELECT:
  - resident: only documents assigned to them via document_assignments
  - committee: project documents for their project
  - admin_root: all
- INSERT:
  - committee/admin_root can upload project docs (files.upload_project)
- UPDATE/DELETE:
  - creator/admin_root only (and block deleting signed docs by business rule)

### 6.7 document_assignments
- SELECT:
  - resident: only where resident_user_id = current_user_id()
  - committee: only aggregate stats, or list within project if allowed (but never expose doc content unless explicitly approved; default NO)
  - admin_root: all
- UPDATE (sign):
  - resident: can update only their assignment from pending->signed
  - enforce: resident_user_id = current_user_id() AND status = 'pending'
  - committee: denied
  - admin_root: denied for signing (can change status only for admin maintenance if explicitly allowed; default NO)

### 6.8 votes / vote_options
- SELECT:
  - project member can read project votes
  - admin_root: all
- INSERT/UPDATE/DELETE:
  - committee and admin_root can create/manage votes in their project scope
  - resident: denied

### 6.9 vote_ballots
- SELECT:
  - resident: own ballots only
  - committee: ballots within project (aggregated & per-user status allowed)
  - admin_root: all
- INSERT:
  - voter_user_id must be current_user_id()
  - unique (vote_id, voter_user_id)
- UPDATE/DELETE:
  - default deny (optional allow update own until deadline, but unified spec: keep simple—no update; revote not allowed)

### 6.10 messages
- SELECT:
  - resident: messages in their project AND eligible by audience filter
  - committee: project messages
  - admin_root: all
- INSERT:
  - committee/admin_root only
- DELETE:
  - creator/admin_root only (optional)

### 6.11 knowledge_articles (existing PRD)
Your existing PRD includes knowledge_articles with open read for authenticated.
Keep as is OR scope by role if needed.

### 6.12 audit_events
- INSERT: system inserts for critical actions
- SELECT:
  - committee: project scoped only
  - admin_root: all
  - resident: denied by default

### 6.13 impersonation_sessions
- INSERT/UPDATE/SELECT:
  - admin_root only

---

## 7) Backend PRD (APIs)

### 7.1 Authentication & Authorization
- JWT token-based authentication for protected endpoints
- Tokens expire after 24 hours
- Each request must resolve:
  - current user
  - role
  - project memberships
  - permission checks

### 7.2 Existing Auth APIs (keep)
- POST /api/register → {username, email, password} -> {token}
- POST /api/login → {email, password} -> {token, user}
- GET /api/auth/profile -> user profile
- PUT /api/auth/profile/update -> update profile
- PUT /api/admin/users/avatar_url_update -> admin updates any avatar_url

> Update: admin endpoints must require admin_root (or legacy global_role in {cto,ceo,coo} mapped to admin_root).

### 7.3 Required Business APIs (Canonical)
(Implement to match DB + flows. Exact routing can vary but functionality must exist.)

Projects (Admin):
- POST /api/admin/projects
- GET /api/admin/projects
- GET /api/admin/projects/:id
- PUT /api/admin/projects/:id
- POST /api/admin/projects/:id/memberships (assign resident/committee)
- DELETE /api/admin/projects/:id/memberships/:membershipId

Resident:
- GET /api/app/projects/my (projects via memberships)
- GET /api/app/projects/:projectId/overview (progress, etc)

Documents:
- GET /api/app/projects/:projectId/documents/my (resident assignments)
- POST /api/app/documents/:assignmentId/sign (resident sign)
- Committee/Admin upload general docs:
  - POST /api/app/projects/:projectId/documents/upload

Votes:
- GET /api/app/projects/:projectId/votes (read)
- POST /api/app/projects/:projectId/votes (committee/admin create)
- PUT /api/app/votes/:voteId/close
- POST /api/app/votes/:voteId/ballot (resident/committee vote once)
- GET /api/app/votes/:voteId/results (committee/admin)

Messages:
- GET /api/app/projects/:projectId/messages
- POST /api/app/projects/:projectId/messages (committee/admin create/schedule)

Tracking:
- GET /api/app/projects/:projectId/logs
- POST /api/app/projects/:projectId/logs (committee/admin)

Admin:
- GET /api/admin/audit (filters)
- GET /api/admin/monitoring/errors
- POST /api/admin/impersonate/start
- POST /api/admin/impersonate/end

All endpoints MUST:
- validate RBAC permission key
- validate project membership & scoping
- produce audit events for critical actions

---

## 8) Frontend PRD (UI + Codebase Notes)

### 8.1 Layouts by Role
- AdminLayout: navigation for admin_root
- ResidentLayout: navigation for resident
- CommitteeLayout: (must be added if not exist) navigation for committee

### 8.2 Existing Frontend Notes (Keep)
Admin profile image upload fix:
- client-side file size validation (e.g., 10MB)
- improved server error handling for profile update
- Type safety improvements across key pages/components

### 8.3 Required Routing
- Public:
  - /home
  - /login
  - /register

- Resident:
  - /app/resident/dashboard
  - /app/resident/documents
  - /app/resident/voting
  - /app/resident/timeline (optional: progress view)
  - /app/resident/messages
  - /app/resident/contact

- Committee:
  - /app/committee/dashboard
  - /app/committee/signatures
  - /app/committee/votes
  - /app/committee/messages
  - /app/committee/tracking
  - /app/committee/analytics

- Admin:
  - /admin/dashboard
  - /admin/projects
  - /admin/users
  - /admin/roles-permissions
  - /admin/feature-flags
  - /admin/monitoring
  - /admin/audit
  - /admin/profile

### 8.4 Permission Guards
Implement both:
- Route Guards (block navigation)
- Component Guards (hide actions/CTAs)
Additionally enforce on API (server side).

---

## 9) Business Rules (Non-negotiable)
Documents:
- Sign Now CTA only if pending assignment exists
- Signed documents are immutable
- Signing is idempotent (no double sign)

Voting:
- one vote per user per vote (unique constraint)
- vote can be draft/open/closed
- close prevents ballots immediately

Messages:
- residents read-only
- committee sends targeted messages (all / unsigned)

Project Tracking:
- committee can create logs
- resident read-only

Admin Root:
- full access
- impersonation must show banner and be logged

---

## 10) Tests — Scenarios (LLM must implement)

A) Role Routing
1) resident -> resident dashboard
2) committee -> committee dashboard
3) admin_root -> admin dashboard
4) route access denied across roles

B) Data Access Enforcement
5) resident reads only own document_assignments
6) resident cannot list residents
7) committee reads signature list only in project scope
8) committee cannot sign documents
9) admin reads everything

C) Documents Flow
10) Sign Now CTA only when pending exists
11) signing sets signed_at + status signed
12) audit documents.sign exists
13) idempotent signing (no duplicates)

D) Voting Flow
14) committee creates vote draft/open
15) options render
16) resident votes once
17) close/deadline blocks submit
18) committee sees participation breakdown
19) audit votes.create/votes.vote/votes.close exists

E) Messages
20) committee sends to all -> residents see
21) unsigned filter works
22) scheduled message visible only after sent_at
23) audit messages.create/send exists

F) Tracking & Progress
24) resident sees progress read-only
25) committee adds log -> visible
26) resident cannot create log

G) Admin ROOT
27) creates project -> audit project.create
28) creates users + memberships
29) RBAC change takes effect
30) feature flags scoped/global works
31) impersonation recorded + banner visible
32) system delete admin only -> audit system.delete

H) Multi-project isolation
33) resident in A cannot read B
34) committee in A cannot manage B
35) admin can access all

---

## 11) Definition of Done
- All role dashboards exist per wireframes
- All user flows implemented
- RBAC enforced UI + API + DB/RLS
- Multi-project isolation enforced
- Audit events emitted for critical actions
- Tests cover all scenarios above
- No cross-role route leakage
- No cross-project data leakage

END OF SPEC
