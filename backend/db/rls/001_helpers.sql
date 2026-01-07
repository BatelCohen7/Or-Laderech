-- Helper Functions for Row Level Security
-- These functions are used by RLS policies to determine user identity and roles

-- Function: current_user_id()
-- Returns the UUID of the authenticated user from the session variable
-- The application must set app.user_id before executing queries
-- Usage: current_user_id() returns UUID or NULL if not set

CREATE OR REPLACE FUNCTION current_user_id()
RETURNS UUID AS $$
BEGIN
  RETURN current_setting('app.user_id', true)::UUID;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function: is_admin_root(user_id UUID)
-- Checks if a user has admin_root role in any project membership
-- Returns true if user has admin_root role, false otherwise

CREATE OR REPLACE FUNCTION is_admin_root(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM project_memberships pm
    JOIN roles r ON pm.role_id = r.id
    WHERE pm.user_id = is_admin_root.user_id
      AND r.name = 'admin_root'
  );
END;
$$ LANGUAGE plpgsql STABLE;

-- Function: is_committee_in_project(user_id UUID, project_id UUID)
-- Checks if a user has committee role in a specific project
-- Returns true if user is committee member of the project, false otherwise

CREATE OR REPLACE FUNCTION is_committee_in_project(user_id UUID, project_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM project_memberships pm
    JOIN roles r ON pm.role_id = r.id
    WHERE pm.user_id = is_committee_in_project.user_id
      AND pm.project_id = is_committee_in_project.project_id
      AND r.name = 'committee'
  );
END;
$$ LANGUAGE plpgsql STABLE;

-- Function: is_project_member(user_id UUID, project_id UUID)
-- Checks if a user is a member of a specific project (any role)
-- Returns true if user has any role in the project, false otherwise

CREATE OR REPLACE FUNCTION is_project_member(user_id UUID, project_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM project_memberships pm
    WHERE pm.user_id = is_project_member.user_id
      AND pm.project_id = is_project_member.project_id
  );
END;
$$ LANGUAGE plpgsql STABLE;

-- Function: get_user_role_in_project(user_id UUID, project_id UUID)
-- Returns the role name for a user in a specific project
-- Returns NULL if user is not a member of the project

CREATE OR REPLACE FUNCTION get_user_role_in_project(user_id UUID, project_id UUID)
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT r.name
    FROM project_memberships pm
    JOIN roles r ON pm.role_id = r.id
    WHERE pm.user_id = get_user_role_in_project.user_id
      AND pm.project_id = get_user_role_in_project.project_id
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql STABLE;
