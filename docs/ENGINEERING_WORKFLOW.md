# Engineering Workflow

## Overview

Lightweight workflow optimized for solo founder building investor demo. Keep `main` branch always deployable.

## Source of Truth

**Specification**: `/spec` folder
- `UNIFIED_SYSTEM_SPEC.md` - Complete system specification
- `PRD.md` - Product requirements
- `DATA_MODEL.md` - Database schema
- `ROLES_AND_PERMISSIONS.md` - RBAC definitions
- `USER_FLOWS.md` - User flow definitions
- `UI_WIREFRAME.md` - UI specifications
- `BUSINESS_RULES.md` - Business constraints
- `TEST_SCENARIOS.md` - Test requirements

**Rule**: Do not implement features not in `/spec`. Do not change business logic without updating spec first.

## Branching Strategy

### Main Branch (`main`)
- **Always deployable** - Never commit broken code
- Protected branch (if using GitHub protection)
- Only merged via Pull Requests
- Represents production-ready state

### Feature Branches
- Naming: `feature/<short-description>`
- Examples: `feature/resident-dashboard`, `feature/document-signing`
- Create from `main`, merge back to `main` via PR
- Delete after merge

### Hotfix Branches
- Naming: `hotfix/<issue-description>`
- Create from `main` for urgent fixes
- Merge back to `main` immediately after fix

### Development Branch (Optional)
- `develop` branch only if working on multiple features simultaneously
- For solo founder: usually not needed, work directly on feature branches

## Commit Messages

Use conventional commits format:

```
<type>(<scope>): <subject>

<body (optional)>

<footer (optional)>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding/updating tests
- `chore`: Maintenance tasks

### Examples
```
feat(auth): add JWT token refresh endpoint
fix(documents): prevent duplicate signatures
docs(db): update RLS policy documentation
refactor(votes): simplify vote counting logic
```

### Rules
- Keep subject line under 50 characters
- Use imperative mood ("add" not "added")
- Reference spec section if relevant: `feat(documents): implement signing flow (spec 4.2 R-01)`

## Pull Request Process

1. **Create PR** from feature branch to `main`
2. **Fill PR template** (auto-populated)
3. **Self-review** before requesting review (if team exists)
4. **Ensure**:
   - Code follows spec
   - No breaking changes to `main`
   - Tests pass (if applicable)
   - Documentation updated if needed
5. **Merge**:
   - Use "Squash and merge" for clean history
   - Delete branch after merge

## Merge Strategy

### Preferred: Squash and Merge
- Keeps `main` history clean
- Single commit per feature
- Easy to revert entire feature if needed

### Alternative: Merge Commit
- Use if preserving branch history is important
- Creates merge commit in `main`

### Never: Rebase and Merge
- Avoid for `main` branch to prevent conflicts

## Code Review Checklist

Before merging to `main`:

- [ ] Follows specification in `/spec`
- [ ] No breaking changes (or documented migration path)
- [ ] RBAC/RLS enforced correctly
- [ ] Multi-project isolation maintained
- [ ] No hardcoded secrets/credentials
- [ ] Error handling implemented
- [ ] Documentation updated if needed

## Deployment

- `main` branch is always deployable
- Tag releases: `v1.0.0`, `v1.0.1`, etc.
- Deployment process documented in `docs/DEPLOY_INSTRUCTIONS.md`

## Demo Preparation

Before investor demo:

1. Ensure `main` is stable and tested
2. Create demo branch: `demo/<date>` if needed for demo-specific changes
3. Document demo flow in `docs/DEMO_SCRIPT_DETAILED.md`
4. Test all critical paths per `spec/TEST_SCENARIOS.md`

## Quick Reference

```bash
# Start new feature
git checkout main
git pull origin main
git checkout -b feature/my-feature

# Work and commit
git add .
git commit -m "feat(scope): description"

# Push and create PR
git push origin feature/my-feature
# Create PR on GitHub

# After merge, cleanup
git checkout main
git pull origin main
git branch -d feature/my-feature
```
