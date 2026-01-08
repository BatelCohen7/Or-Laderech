# Or LaDerech – Screens V1 (FROZEN SCOPE)

## Status: FROZEN ✅
This file is the **single source of truth** for the V1 UI scope.
**Do not** add screens, routes, flows, or UI pages that are not explicitly listed here.
Any scope change must be done by editing this file first.

---

## Global Requirements (Apply to ALL screens)
- i18n required from day 1 (no hardcoded strings)
- Supported languages:
  - Hebrew (RTL)
  - Arabic (RTL)
  - Russian (LTR)
  - English (LTR)
- RTL/LTR support:
  - Layout must flip correctly
  - Icons that imply direction should flip in RTL
- Accessibility baseline:
  - Minimum button height: 44px
  - Font size: 16px+ for body text
  - High contrast (no light-gray-on-white)
  - Visible focus states
  - Clear success/error feedback

---

## App Mode Assumptions (V1)
- Single Project Mode (there is currently only ONE project)
- ~200 apartments / residents
- Max 2 users per apartment (enforced in DB + service layer)
- Roles in V1 UI:
  - Resident
  - Committee
- Admin Root UI screens are OUT OF SCOPE for V1 (can exist later)

---

# Resident Screens (V1)

### R-01 Login
- Login form
- Language selector
- “Forgot password” (optional – if backend supports; otherwise hide)

### R-02 First-time Language Selection (Optional screen)
- Shown only if no language preference exists
- Otherwise skip

### R-03 Resident Dashboard
- Cards summary:
  - Pending documents
  - Active votes
  - Latest announcements/messages

### R-04 My Documents
- List of assignments for the resident
- Status: PENDING / SIGNED
- Primary CTA: open assignment
- Secondary: download

### R-05 Document Details + Sign
- Document title/type
- Status badge
- Primary CTA: Sign (if PENDING)
- Secondary CTA: Download (token URL / presigned)
- Confirm modal before signing

### R-06 My Votes
- List: open + past
- Status: OPEN / CLOSED
- Shows: whether user voted + selected option

### R-07 Vote Details + Cast Vote
- Vote title/description
- Options list
- Primary CTA: Submit vote (if open and not voted)
- If already voted: show selection + message (read-only)

### R-08 Messages / Announcements
- List of message deliveries
- Status: read/unread
- Filter: All / Unread

### R-09 Message Details
- Full message content
- Mark as read (idempotent) on open OR explicit button

### R-10 Profile (Basic)
- Name
- Phone (optional)
- Language preference
- Logout

### R-11 Help / Contact (Static)
- Contact details
- “Send us a message” (only if backend supports; otherwise static)

---

# Committee Screens (V1)

### C-01 Committee Dashboard
- Quick stats:
  - signatures progress (aggregated)
  - votes open/closed
  - messages scheduled/sent
- Quick actions:
  - upload document
  - create vote
  - create message

### C-02 Documents Management (Index)
- List project documents
- Upload button

### C-03 Upload Document
- Upload file (multipart)
- title + docType
- Submit (creates document)

### C-04 Assign Document
- Assign target:
  - Apartment (assign to all users in apartment)
  - Users (manual list)
- Respect max 2 users per apartment
- Success confirmation

### C-05 Document Assignment Status Summary
- Aggregated counts:
  - pending vs signed
- No personal sensitive data

### C-06 Votes Management (Index)
- List all votes
- Create vote button

### C-07 Create Vote
- Title, description
- Audience filter (ALL_RESIDENTS / COMMITTEE_ONLY / UNSIGNED_RESIDENTS fallback)
- opensAt / closesAt
- options list
- Submit (creates vote + optional reminder scheduling)

### C-08 Close Vote
- Close action with confirm modal
- Audit event emitted

### C-09 Vote Results
- Aggregated results
- participationRate + totalEligible
- No personal info (unless explicitly required later)

### C-10 Vote Participation (IDs only)
- voted userIds
- notVoted userIds
- totals + participationRate

### C-11 Messages Management (Index)
- List project messages
- Create message button
- Show status: DRAFT / SCHEDULED / SENT / CANCELLED (as implemented)

### C-12 Create Message (Immediate or Scheduled)
- Title + body
- Audience filter
- Send now OR schedule time
- Confirm before send

### C-13 Cancel Scheduled Message
- Cancel action with confirmation
- Only if status is scheduled

### C-14 Deliveries Summary
- read/unread counts aggregated
- no resident personal fields exposed

### C-15 Residents List (Read-only)
- Project residents list (minimal fields)
- Used only for operations like “assign to users” (if implemented)
- No editing resident profile

### C-16 Audit Log (Read-only, Basic)
- List audit events (high level)
- filter by action type and time

---

## Out of Scope (V1) ❌
- Admin Root UI (system settings, roles editor, feature flags UI)
- Multi-project switching UI
- Push notifications settings
- Advanced analytics dashboards
- Document templates editor
- Complex resident search / segmentation beyond existing audience filters
- Mobile-native app UI (responsive web only for V1)

---

## Definition of Done (V1 UI)
- All screens above exist as routes/pages
- RBAC enforced in UI routing (guards)
- Uses i18n keys everywhere (no hardcoded copy)
- RTL/LTR verified on at least:
  - Resident Dashboard
  - Documents
  - Votes
  - Messages
- Calls backend endpoints under `/api/v1/...`
