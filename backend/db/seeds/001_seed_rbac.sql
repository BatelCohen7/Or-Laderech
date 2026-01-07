-- Seed RBAC Data
-- This script seeds roles, permissions, and role_permission mappings
-- Idempotent: Safe to run multiple times

-- ============================================================================
-- ROLES
-- ============================================================================

INSERT INTO roles (id, name, description)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'resident', 'Regular tenant/resident')
ON CONFLICT (name) DO NOTHING;

INSERT INTO roles (id, name, description)
VALUES
  ('00000000-0000-0000-0000-000000000002', 'committee', 'Tenant representative/committee member')
ON CONFLICT (name) DO NOTHING;

INSERT INTO roles (id, name, description)
VALUES
  ('00000000-0000-0000-0000-000000000003', 'admin_root', 'System administrator (ROOT)')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- PERMISSIONS
-- ============================================================================

-- Project permissions
INSERT INTO permissions (id, key, description)
VALUES
  ('10000000-0000-0000-0000-000000000001', 'project.read', 'Read project information')
ON CONFLICT (key) DO NOTHING;

INSERT INTO permissions (id, key, description)
VALUES
  ('10000000-0000-0000-0000-000000000002', 'project.manage', 'Create and manage projects')
ON CONFLICT (key) DO NOTHING;

-- User management
INSERT INTO permissions (id, key, description)
VALUES
  ('10000000-0000-0000-0000-000000000003', 'users.manage', 'Manage users and memberships')
ON CONFLICT (key) DO NOTHING;

-- Role management
INSERT INTO permissions (id, key, description)
VALUES
  ('10000000-0000-0000-0000-000000000004', 'roles.manage', 'Manage roles and permissions')
ON CONFLICT (key) DO NOTHING;

-- Document permissions
INSERT INTO permissions (id, key, description)
VALUES
  ('10000000-0000-0000-0000-000000000005', 'documents.read_own', 'Read own assigned documents')
ON CONFLICT (key) DO NOTHING;

INSERT INTO permissions (id, key, description)
VALUES
  ('10000000-0000-0000-0000-000000000006', 'documents.read_project', 'Read project documents')
ON CONFLICT (key) DO NOTHING;

INSERT INTO permissions (id, key, description)
VALUES
  ('10000000-0000-0000-0000-000000000007', 'documents.sign_own', 'Sign own assigned documents')
ON CONFLICT (key) DO NOTHING;

-- Vote permissions
INSERT INTO permissions (id, key, description)
VALUES
  ('10000000-0000-0000-0000-000000000008', 'votes.read', 'Read votes')
ON CONFLICT (key) DO NOTHING;

INSERT INTO permissions (id, key, description)
VALUES
  ('10000000-0000-0000-0000-000000000009', 'votes.vote', 'Submit vote ballot')
ON CONFLICT (key) DO NOTHING;

INSERT INTO permissions (id, key, description)
VALUES
  ('10000000-0000-0000-0000-000000000010', 'votes.create', 'Create votes')
ON CONFLICT (key) DO NOTHING;

INSERT INTO permissions (id, key, description)
VALUES
  ('10000000-0000-0000-0000-000000000011', 'votes.manage', 'Manage and close votes')
ON CONFLICT (key) DO NOTHING;

-- Message permissions
INSERT INTO permissions (id, key, description)
VALUES
  ('10000000-0000-0000-0000-000000000012', 'messages.read', 'Read messages')
ON CONFLICT (key) DO NOTHING;

INSERT INTO permissions (id, key, description)
VALUES
  ('10000000-0000-0000-0000-000000000013', 'messages.create', 'Create messages')
ON CONFLICT (key) DO NOTHING;

INSERT INTO permissions (id, key, description)
VALUES
  ('10000000-0000-0000-0000-000000000014', 'messages.schedule', 'Schedule messages')
ON CONFLICT (key) DO NOTHING;

-- File permissions
INSERT INTO permissions (id, key, description)
VALUES
  ('10000000-0000-0000-0000-000000000015', 'files.upload_project', 'Upload project documents')
ON CONFLICT (key) DO NOTHING;

-- Audit permissions
INSERT INTO permissions (id, key, description)
VALUES
  ('10000000-0000-0000-0000-000000000016', 'audit.read', 'Read audit logs')
ON CONFLICT (key) DO NOTHING;

-- Feature flag permissions
INSERT INTO permissions (id, key, description)
VALUES
  ('10000000-0000-0000-0000-000000000017', 'feature_flags.manage', 'Manage feature flags')
ON CONFLICT (key) DO NOTHING;

-- Impersonation permissions
INSERT INTO permissions (id, key, description)
VALUES
  ('10000000-0000-0000-0000-000000000018', 'impersonate.use', 'Use impersonation feature')
ON CONFLICT (key) DO NOTHING;

-- System permissions
INSERT INTO permissions (id, key, description)
VALUES
  ('10000000-0000-0000-0000-000000000019', 'system.delete', 'Delete system data')
ON CONFLICT (key) DO NOTHING;

-- ============================================================================
-- ROLE_PERMISSIONS MAPPINGS
-- ============================================================================

-- Resident permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT
  (SELECT id FROM roles WHERE name = 'resident'),
  (SELECT id FROM permissions WHERE key = 'project.read')
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT
  (SELECT id FROM roles WHERE name = 'resident'),
  (SELECT id FROM permissions WHERE key = 'documents.read_own')
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT
  (SELECT id FROM roles WHERE name = 'resident'),
  (SELECT id FROM permissions WHERE key = 'documents.sign_own')
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT
  (SELECT id FROM roles WHERE name = 'resident'),
  (SELECT id FROM permissions WHERE key = 'votes.read')
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT
  (SELECT id FROM roles WHERE name = 'resident'),
  (SELECT id FROM permissions WHERE key = 'votes.vote')
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT
  (SELECT id FROM roles WHERE name = 'resident'),
  (SELECT id FROM permissions WHERE key = 'messages.read')
ON CONFLICT DO NOTHING;

-- Committee permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT
  (SELECT id FROM roles WHERE name = 'committee'),
  (SELECT id FROM permissions WHERE key = 'project.read')
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT
  (SELECT id FROM roles WHERE name = 'committee'),
  (SELECT id FROM permissions WHERE key = 'documents.read_project')
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT
  (SELECT id FROM roles WHERE name = 'committee'),
  (SELECT id FROM permissions WHERE key = 'votes.read')
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT
  (SELECT id FROM roles WHERE name = 'committee'),
  (SELECT id FROM permissions WHERE key = 'votes.vote')
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT
  (SELECT id FROM roles WHERE name = 'committee'),
  (SELECT id FROM permissions WHERE key = 'votes.create')
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT
  (SELECT id FROM roles WHERE name = 'committee'),
  (SELECT id FROM permissions WHERE key = 'votes.manage')
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT
  (SELECT id FROM roles WHERE name = 'committee'),
  (SELECT id FROM permissions WHERE key = 'messages.read')
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT
  (SELECT id FROM roles WHERE name = 'committee'),
  (SELECT id FROM permissions WHERE key = 'messages.create')
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT
  (SELECT id FROM roles WHERE name = 'committee'),
  (SELECT id FROM permissions WHERE key = 'messages.schedule')
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT
  (SELECT id FROM roles WHERE name = 'committee'),
  (SELECT id FROM permissions WHERE key = 'files.upload_project')
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT
  (SELECT id FROM roles WHERE name = 'committee'),
  (SELECT id FROM permissions WHERE key = 'audit.read')
ON CONFLICT DO NOTHING;

-- Admin root permissions (all permissions)
INSERT INTO role_permissions (role_id, permission_id)
SELECT
  (SELECT id FROM roles WHERE name = 'admin_root'),
  id
FROM permissions
ON CONFLICT DO NOTHING;
