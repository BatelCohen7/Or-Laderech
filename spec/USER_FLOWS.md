# User Flows (Mandatory)

## Global Flow: Authentication & Landing
1. User logs in
2. System resolves role + project memberships
3. System routes user to the correct dashboard:
   - resident -> Resident Dashboard
   - committee -> Committee Dashboard
   - admin_root -> System Admin Dashboard

Edge cases:
- user disabled -> block login + show "account disabled"
- user has no project membership (resident/committee) -> show "no project assigned" + contact support

---

## Resident Flows

### Flow R-01: Dashboard → Sign Document
Preconditions:
- user role = resident
- exists document_assignment status = pending for this user

Steps:
1. Resident opens dashboard
2. "My Documents" card shows pending state + CTA "Sign Now"
3. Click "Sign Now" -> Document View screen (read-only)
4. Click "Sign" -> Signature action
5. On success:
   - assignment.status = signed
   - assignment.signed_at set
   - audit event recorded
6. Show confirmation
7. Return to dashboard (card becomes signed)

Edge cases:
- Document already signed -> hide CTA, show "Signed"
- Signature service failure -> show error + retry
- Network failure -> show error + safe retry (idempotent)

### Flow R-02: Dashboard → Vote
Preconditions:
- user role = resident
- exists open vote where audience includes resident
- user has not voted yet

Steps:
1. Resident opens dashboard
2. "Active Votes" card lists open votes + CTA "Vote Now"
3. Click "Vote Now" -> Vote screen
4. Select option + Submit
5. On success:
   - vote_ballot created
   - audit event recorded
6. Confirmation
7. Return to dashboard (status changes to "Voted")

Edge cases:
- user already voted -> show "Voted"
- vote closed while voting -> prevent submit, show "Vote closed"
- deadline passed -> same as closed
- unique constraint violation -> treat as already voted

### Flow R-03: View Updates
Steps:
1. Dashboard -> Updates card
2. Click -> Updates list
3. Click item -> Message detail (read-only)

### Flow R-04: View Apartment + Planning Docs
Steps:
1. Dashboard -> "My Apartment" section
2. Click planning docs -> open viewer/download

---

## Committee Flows

### Flow C-01: View Signature Status + Remind
Preconditions:
- user role = committee
- member of project

Steps:
1. Committee opens dashboard
2. "Signatures" card shows totals and list (signed/unsigned)
3. Click "Send Reminder"
4. Choose target = unsigned residents (default)
5. Confirm send
6. System sends reminders + logs audit event

Edge cases:
- no unsigned -> disable CTA + show "All signed"
- partial failure -> report which failed + retry option

### Flow C-02: Create Vote
Steps:
1. Committee -> Voting Management -> "Create Vote"
2. Fill:
   - title, description
   - audience_filter
   - deadline_at
   - options list
3. Save as draft OR Publish (open)
4. Audit event recorded

Edge cases:
- invalid deadline -> validation
- no options -> validation

### Flow C-03: Manage Vote (Close + Results)
Steps:
1. Committee opens vote list
2. Select vote -> results view
3. See:
   - voted vs not voted
   - real-time counts
4. Close vote -> status closed + audit event

### Flow C-04: Create Message (Targeted/Scheduled)
Steps:
1. Committee -> Messages -> New Message
2. Compose title/body
3. Choose audience_filter
4. Choose send now or schedule
5. Send -> message visible to eligible residents
6. Audit event recorded

### Flow C-05: Project Tracking Logs
Steps:
1. Committee -> Project Tracking
2. Add log entry (meeting/status update)
3. Upload general document (optional)
4. Audit event recorded

---

## Admin ROOT Flows

### Flow A-01: Create Project
Steps:
1. Admin -> Projects -> Create
2. Fill project fields
3. Create -> project saved
4. Audit event: project.create

### Flow A-02: Manage Users + Memberships
Steps:
1. Admin -> Users -> Create user
2. Assign role + enable flag
3. Assign project memberships (for resident/committee)
4. Audit event: users.manage

### Flow A-03: RBAC Management
Steps:
1. Admin -> Roles & Permissions
2. Add/remove permissions from roles
3. Save
4. Audit event: roles.manage

### Flow A-04: Impersonation (QA/Support)
Steps:
1. Admin selects user -> "Impersonate"
2. Start session:
   - impersonation_sessions started
   - banner visible "Impersonating {user}"
3. Navigate and test flows as that user
4. End impersonation session:
   - ended_at set
   - audit event recorded

### Flow A-05: Monitoring & Logs
Steps:
1. Admin -> Monitoring
2. View errors/performance
3. View audit events (filter by project/user/action)
