# UI Wireframes (Low-Fi, Textual)

## Resident Dashboard

[HEADER]
- Project Name
- Global Status: "Signatures 68% complete"
- Profile + Logout

[CARDS ROW]
1) My Documents
- status: Signed / Pending
- CTA: "Sign Now" (only if pending)

2) Active Votes
- vote title
- status: Voted / Not Voted
- deadline
- CTA: "Vote Now"

3) Updates
- official messages only
- read-only

[SECTION]
My Apartment
- current sqm
- future additions
- planning docs link

[SECTION]
Project Progress
- progress bar
- stages: Planning → Signatures → Permit → Construction
- read-only

[QUICK ACTIONS]
Documents | Votes | Updates | Contact

---

## Committee Dashboard

[HEADER]
- Project Name
- Exact progress %
- Alerts if delays exist
- Profile + Logout

[MANAGEMENT CARDS]
1) Signatures Status
- total % signed
- lists: signed / not signed
- CTA: send reminder to unsigned

2) Voting Management
- create vote
- real-time results
- close vote

3) Messages
- create message
- choose audience
- schedule

[SECTION]
Project Tracking
- developer/lawyer status
- upload general docs
- meeting logs

[SECTION]
Analytics
- signature velocity graph
- voting participation graph
- risk: green/orange/red

[QUICK ACTION BAR]
Send Reminder | Create Vote | Upload Doc | New Message

---

## Admin ROOT Dashboard

[SYSTEM NAV]
Projects | Users | Roles & Permissions | Feature Flags | Monitoring & Logs | System Settings

Projects:
- create/edit/disable
- assign stakeholders
- impersonate within project context

Users:
- create/disable/reset
- assign role + memberships

RBAC:
- manage roles
- manage permissions
- preview as role

Monitoring:
- errors
- performance
- audit log

Security:
- MFA
- session timeout
- IP restrictions
