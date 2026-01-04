# Business Rules (Non-negotiable)

## General
- RBAC must be enforced at UI + server/data layer.
- Multi-project isolation must be enforced by project membership and project_id constraints.
- All critical actions must create an audit event.

## Documents
- Residents can sign only documents assigned to them.
- Signed documents are immutable and cannot be deleted by committee.
- "Sign Now" CTA is shown only when status = pending.
- Signing is idempotent: repeated requests must not create multiple signed states.

## Voting
- One user can vote only once per vote.
- Votes can be draft/open/closed.
- Voting is allowed only when vote is open and before deadline.
- Closing a vote prevents new ballots immediately.
- Committee can create and manage votes only in their project.

## Messages
- Residents can read official messages only.
- Committee can create messages with audience filters:
  - all_residents
  - unsigned_residents
  - committee_only
- Scheduled messages become visible only after sent_at is set (or scheduled time triggers send).

## Project Tracking
- Committee can create project logs.
- Residents can read progress but cannot write logs.

## Admin ROOT
- Admin can do everything:
  - projects/users/roles/permissions/feature flags
  - impersonation
  - system delete
- Impersonation must show a persistent banner and be recorded.
