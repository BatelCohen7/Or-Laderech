# Test Scenarios (LLM Must Implement)

## A) Role Routing
1) Login as resident -> lands on /app/resident/dashboard
2) Login as committee -> lands on /app/committee/dashboard
3) Login as admin_root -> lands on /admin

4) Route access denied:
- resident tries /admin -> blocked
- committee tries /admin/users -> blocked
- resident tries /app/committee/signatures -> blocked

## B) Data Access Enforcement
5) resident reads only own document_assignments
6) resident cannot list residents -> forbidden/empty
7) committee can view signature list (only within their project)
8) committee cannot sign resident documents
9) admin_root can read everything

## C) Documents Flow
10) CTA "Sign Now" shown only when pending exists
11) signing changes pending->signed and sets signed_at
12) audit event created: documents.sign
13) cannot sign twice (idempotent)

## D) Voting Flow
14) committee creates vote -> draft/open
15) vote_options render correctly
16) resident votes once only
17) after close/deadline: submit blocked
18) committee sees participation breakdown
19) audit events: votes.create, votes.vote, votes.close

## E) Messages
20) committee sends to all residents -> all eligible residents see in Updates
21) unsigned_residents filter works
22) scheduled message visible only after sent_at
23) audit event: messages.create/messages.send

## F) Tracking & Progress
24) resident sees progress read-only
25) committee creates project log -> visible in tracking
26) resident cannot create log

## G) Admin ROOT
27) admin creates project -> audit project.create
28) admin creates users + memberships
29) admin changes RBAC -> takes effect immediately
30) feature flags enable globally and scoped
31) impersonation session is recorded + banner visible
32) system delete only admin -> audit system.delete

## H) Multi-Project Isolation
33) resident in project A cannot read project B data
34) committee in A cannot manage B
35) admin can access all
