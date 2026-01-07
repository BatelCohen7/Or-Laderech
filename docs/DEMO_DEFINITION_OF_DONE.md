# Demo Definition of Done

## Overview

Checklist to ensure investor demo readiness. All items must be completed before demo.

## Pre-Demo Checklist

### Code Quality
- [ ] `main` branch is stable and deployable
- [ ] No critical bugs or errors in console
- [ ] All critical user flows work end-to-end
- [ ] No hardcoded test data visible in demo
- [ ] Error messages are user-friendly (no technical stack traces)

### Specification Compliance
- [ ] All demo features align with `/spec/UNIFIED_SYSTEM_SPEC.md`
- [ ] RBAC enforced correctly per `/spec/ROLES_AND_PERMISSIONS.md`
- [ ] User flows match `/spec/USER_FLOWS.md`
- [ ] UI matches wireframes in `/spec/UI_WIREFRAME.md`

### Core Features (Per Spec)

#### Authentication
- [ ] Login works for all roles (resident, committee, admin_root)
- [ ] Role-based redirect after login
- [ ] Logout works correctly

#### Resident Dashboard
- [ ] Dashboard loads with correct data
- [ ] "My Documents" card shows pending/signed status
- [ ] "Active Votes" card shows open votes
- [ ] "Updates" section shows messages
- [ ] Project progress visible (read-only)
- [ ] Can sign pending documents
- [ ] Can vote on open votes

#### Committee Dashboard
- [ ] Dashboard loads with project data
- [ ] Signature status shows signed/unsigned list
- [ ] Can create votes
- [ ] Can view vote results
- [ ] Can create and send messages
- [ ] Can view project tracking logs
- [ ] Cannot sign documents (enforced)

#### Admin Dashboard
- [ ] Can create projects
- [ ] Can manage users and memberships
- [ ] Can view audit logs
- [ ] Can impersonate users (if demoing)
- [ ] System settings accessible

### Data & Security
- [ ] Multi-project isolation enforced (user in project A cannot see project B)
- [ ] Resident cannot see other residents' data
- [ ] Committee cannot sign documents
- [ ] Signed documents are immutable
- [ ] One vote per user enforced

### Demo Environment
- [ ] Demo data seeded (realistic but anonymized)
- [ ] All test accounts work (resident, committee, admin)
- [ ] Database migrations applied
- [ ] RLS policies active
- [ ] Environment variables configured
- [ ] No development/debug code visible

### Documentation
- [ ] Demo script prepared (`docs/DEMO_SCRIPT_DETAILED.md`)
- [ ] Login credentials documented (`docs/ADMIN_LOGIN_GUIDE.md`)
- [ ] Quick start guide available (`docs/QUICK_START.md`)
- [ ] Known limitations documented

### Testing
- [ ] Critical paths tested manually:
  - [ ] Resident sign document flow (R-01)
  - [ ] Resident vote flow (R-02)
  - [ ] Committee create vote (C-02)
  - [ ] Committee send message (C-04)
  - [ ] Admin create project (A-01)
- [ ] No blocking errors in test scenarios from `/spec/TEST_SCENARIOS.md`

### Performance
- [ ] Pages load within 2-3 seconds
- [ ] No obvious performance issues
- [ ] Database queries optimized (no N+1 issues visible)

### Browser Compatibility
- [ ] Works in Chrome (primary demo browser)
- [ ] Works in Safari (if demoing on Mac)
- [ ] Mobile responsive (if demoing mobile)

## Demo Day Checklist

### Before Demo
- [ ] Test all demo accounts login
- [ ] Clear browser cache
- [ ] Have backup demo data ready
- [ ] Have demo script open
- [ ] Test screen sharing/recording setup
- [ ] Have `/spec` folder accessible for reference

### During Demo
- [ ] Follow demo script
- [ ] Highlight spec compliance
- [ ] Show RBAC enforcement
- [ ] Demonstrate multi-project isolation
- [ ] Show audit trail (if relevant)

### After Demo
- [ ] Document feedback
- [ ] Note any issues encountered
- [ ] Update demo script with improvements

## Post-Demo

- [ ] Tag demo version: `git tag demo-v1.0.0`
- [ ] Document any demo-specific changes
- [ ] Plan follow-up improvements based on feedback

## Quick Reference

**Spec Location**: `/spec`
**Demo Script**: `docs/DEMO_SCRIPT_DETAILED.md`
**Login Guide**: `docs/ADMIN_LOGIN_GUIDE.md`
**Test Scenarios**: `spec/TEST_SCENARIOS.md`
