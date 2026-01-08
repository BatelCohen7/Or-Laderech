# Or LaDerech – V1 Wireframes (Low-Fi, Textual)

## Status: FROZEN ✅
These wireframes define the **exact UI structure** for V1.
Cursor must build UI **only** according to this file + SCREENS_V1.md.
No additional components, pages, or flows are allowed.

---

# Global Layout (All Screens)

- Page container (max width, centered)
- Header (fixed)
- Main content
- Footer (optional, minimal)

### Header
- Logo (left in LTR / right in RTL)
- Project name
- Language switcher (icon + text)
- Profile icon (dropdown: profile, logout)

Accessibility:
- Header height ≥ 64px
- All items keyboard reachable
- Language switcher accessible via Tab

---

# Resident Wireframes

## R-03 Resident Dashboard

### Layout
- Header (fixed)
- Main content (vertical)
- Cards grid (1 column mobile, 2–3 desktop)

---

### Section: Pending Actions

#### Card: Pending Documents
- Icon: document
- Title: documents.pending.title
- Description: documents.pending.description
- Status badge: PENDING
- Primary CTA: documents.pending.cta
- Click → My Documents

---

#### Card: Active Votes
- Icon: vote
- Title: votes.active.title
- Description: votes.active.description
- Status badge: OPEN
- Primary CTA: votes.active.cta
- Click → My Votes

---

### Section: Updates

#### Card: Latest Messages
- Icon: message
- Title: messages.latest.title
- Short preview (2 lines max)
- Status badge: UNREAD / READ
- CTA: messages.latest.cta
- Click → Messages List

---

### Empty State
- Illustration (urban/building theme)
- Title: dashboard.empty.title
- Subtitle: dashboard.empty.subtitle

---

## R-04 My Documents

### Layout
- Header
- List container

### Document Row
- Title
- Type badge
- Status badge: PENDING / SIGNED
- CTA: Open

Empty State:
- Icon + text: documents.empty

---

## R-05 Document Details + Sign

### Content
- Document title
- Type
- Status badge

### Actions
- Primary CTA: Sign Document (only if PENDING)
- Secondary CTA: Download

Signing Flow:
- Confirm modal
- Success toast

---

## R-06 My Votes

### Vote Row
- Title
- Status badge: OPEN / CLOSED
- User status: VOTED / NOT VOTED
- CTA: Open Vote

---

## R-07 Vote Details + Cast Vote

### Content
- Vote title
- Description
- Options (radio buttons)

### Actions
- Primary CTA: Submit Vote (only if open + not voted)

If already voted:
- Show selected option
- Disable inputs

---

## R-08 Messages List

### Message Row
- Title
- Preview
- Status: READ / UNREAD
- Timestamp
- Click → Message Details

---

## R-09 Message Details

### Content
- Title
- Full body text
- Timestamp

Behavior:
- Mark as read on open (idempotent)

---

## R-10 Profile

- Name
- Language selector
- Logout button

---

# Committee Wireframes

## C-01 Committee Dashboard

### Stats Cards
- Documents: signed / pending
- Votes: open / closed
- Messages: scheduled / sent

### Quick Actions
- Upload Document
- Create Vote
- Create Message

---

## C-02 Documents Management

### List
- Document title
- Created date
- CTA: Assign / View Status

---

## C-03 Upload Document

### Form
- File upload
- Title
- Document type
- Submit

---

## C-04 Assign Document

### Target Selection
- Radio:
  - Apartment
  - Users

### Submit
- Confirmation modal

---

## C-05 Document Status Summary

- Aggregated counts only
- No personal resident data

---

## C-06 Votes Management

### Vote Row
- Title
- Status
- CTA: Results / Close

---

## C-07 Create Vote

### Form
- Title
- Description
- Audience filter
- OpensAt
- ClosesAt
- Options list
- Submit

---

## C-08 Vote Results

- Options + counts
- Participation rate
- Total eligible

---

## C-09 Vote Participation

- Two lists:
  - Voted (user IDs only)
  - Not voted (user IDs only)

---

## C-11 Messages Management

### Message Row
- Title
- Status: DRAFT / SCHEDULED / SENT
- CTA: View / Cancel (if scheduled)

---

## C-12 Create Message

### Form
- Title
- Body
- Audience filter
- Send now / Schedule
- Submit

---

## C-13 Cancel Message

- Confirm modal
- Success toast

---

## Accessibility Rules (All Screens)

- Button height ≥ 44px
- Text size ≥ 16px
- Clear focus outline
- No color-only meaning
- Simple language, short sentences

---

## Final Rule
Cursor must:
- Use SCREENS_V1.md + this file as **frozen scope**
- Not infer additional flows
- Not invent UI states
