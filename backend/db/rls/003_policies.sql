-- Row Level Security Policies
-- These policies enforce access control at the database level
-- Based on spec/UNIFIED_SYSTEM_SPEC.md section 6

-- ============================================================================
-- USERS TABLE
-- ============================================================================

-- SELECT: User can see own record, admin_root can see all
DROP POLICY IF EXISTS users_select_own ON users;
CREATE POLICY users_select_own ON users
  FOR SELECT
  USING (
    id = current_user_id()
    OR is_admin_root(current_user_id())
  );

-- UPDATE: User can update own record, admin_root can update any
DROP POLICY IF EXISTS users_update_own ON users;
CREATE POLICY users_update_own ON users
  FOR UPDATE
  USING (
    id = current_user_id()
    OR is_admin_root(current_user_id())
  );

-- INSERT: Only system/admin (handled by application, but allow for registration)
-- Note: Registration flow may need special handling
DROP POLICY IF EXISTS users_insert_registration ON users;
CREATE POLICY users_insert_registration ON users
  FOR INSERT
  WITH CHECK (true); -- Application layer controls registration

-- ============================================================================
-- ROLES TABLE
-- ============================================================================

-- SELECT: All authenticated users can read roles (needed for permission checks)
DROP POLICY IF EXISTS roles_select_all ON roles;
CREATE POLICY roles_select_all ON roles
  FOR SELECT
  USING (current_user_id() IS NOT NULL);

-- ============================================================================
-- PERMISSIONS TABLE
-- ============================================================================

-- SELECT: All authenticated users can read permissions
DROP POLICY IF EXISTS permissions_select_all ON permissions;
CREATE POLICY permissions_select_all ON permissions
  FOR SELECT
  USING (current_user_id() IS NOT NULL);

-- ============================================================================
-- ROLE_PERMISSIONS TABLE
-- ============================================================================

-- SELECT: All authenticated users can read role_permissions
DROP POLICY IF EXISTS role_permissions_select_all ON role_permissions;
CREATE POLICY role_permissions_select_all ON role_permissions
  FOR SELECT
  USING (current_user_id() IS NOT NULL);

-- INSERT/UPDATE/DELETE: Only admin_root
DROP POLICY IF EXISTS role_permissions_manage_admin ON role_permissions;
CREATE POLICY role_permissions_manage_admin ON role_permissions
  FOR ALL
  USING (is_admin_root(current_user_id()))
  WITH CHECK (is_admin_root(current_user_id()));

-- ============================================================================
-- PROJECTS TABLE
-- ============================================================================

-- SELECT: Project members or admin_root
DROP POLICY IF EXISTS projects_select_member ON projects;
CREATE POLICY projects_select_member ON projects
  FOR SELECT
  USING (
    is_project_member(current_user_id(), id)
    OR is_admin_root(current_user_id())
  );

-- INSERT: Only admin_root
DROP POLICY IF EXISTS projects_insert_admin ON projects;
CREATE POLICY projects_insert_admin ON projects
  FOR INSERT
  WITH CHECK (is_admin_root(current_user_id()));

-- UPDATE: Only admin_root
DROP POLICY IF EXISTS projects_update_admin ON projects;
CREATE POLICY projects_update_admin ON projects
  FOR UPDATE
  USING (is_admin_root(current_user_id()))
  WITH CHECK (is_admin_root(current_user_id()));

-- DELETE: Only admin_root
DROP POLICY IF EXISTS projects_delete_admin ON projects;
CREATE POLICY projects_delete_admin ON projects
  FOR DELETE
  USING (is_admin_root(current_user_id()));

-- ============================================================================
-- PROJECT_MEMBERSHIPS TABLE
-- ============================================================================

-- SELECT: Own memberships, committee can see in their projects, admin_root sees all
DROP POLICY IF EXISTS project_memberships_select ON project_memberships;
CREATE POLICY project_memberships_select ON project_memberships
  FOR SELECT
  USING (
    user_id = current_user_id()
    OR is_committee_in_project(current_user_id(), project_id)
    OR is_admin_root(current_user_id())
  );

-- INSERT: Only admin_root
DROP POLICY IF EXISTS project_memberships_insert_admin ON project_memberships;
CREATE POLICY project_memberships_insert_admin ON project_memberships
  FOR INSERT
  WITH CHECK (is_admin_root(current_user_id()));

-- DELETE: Only admin_root
DROP POLICY IF EXISTS project_memberships_delete_admin ON project_memberships;
CREATE POLICY project_memberships_delete_admin ON project_memberships
  FOR DELETE
  USING (is_admin_root(current_user_id()));

-- ============================================================================
-- APARTMENTS TABLE
-- ============================================================================

-- SELECT: Resident sees apartments they're linked to, committee/admin sees project apartments
DROP POLICY IF EXISTS apartments_select ON apartments;
CREATE POLICY apartments_select ON apartments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM apartment_users au
      WHERE au.apartment_id = apartments.id
        AND au.user_id = current_user_id()
    )
    OR is_committee_in_project(current_user_id(), project_id)
    OR is_admin_root(current_user_id())
  );

-- INSERT/UPDATE/DELETE: Only admin_root (committee cannot modify apartment data per spec)
DROP POLICY IF EXISTS apartments_manage_admin ON apartments;
CREATE POLICY apartments_manage_admin ON apartments
  FOR ALL
  USING (is_admin_root(current_user_id()))
  WITH CHECK (is_admin_root(current_user_id()));

-- ============================================================================
-- APARTMENT_USERS TABLE
-- ============================================================================

-- SELECT: Resident sees own apartment_user link, committee/admin sees project apartment_users
DROP POLICY IF EXISTS apartment_users_select ON apartment_users;
CREATE POLICY apartment_users_select ON apartment_users
  FOR SELECT
  USING (
    user_id = current_user_id()
    OR is_committee_in_project(current_user_id(), project_id)
    OR is_admin_root(current_user_id())
  );

-- INSERT/UPDATE/DELETE: Only admin_root
DROP POLICY IF EXISTS apartment_users_manage_admin ON apartment_users;
CREATE POLICY apartment_users_manage_admin ON apartment_users
  FOR ALL
  USING (is_admin_root(current_user_id()))
  WITH CHECK (is_admin_root(current_user_id()));

-- ============================================================================
-- DOCUMENTS TABLE
-- ============================================================================

-- SELECT: Resident sees only assigned documents, committee sees project docs, admin sees all
DROP POLICY IF EXISTS documents_select ON documents;
CREATE POLICY documents_select ON documents
  FOR SELECT
  USING (
    -- Resident: only documents assigned to them
    EXISTS (
      SELECT 1 FROM document_assignments da
      WHERE da.document_id = documents.id
        AND da.resident_user_id = current_user_id()
    )
    -- Committee: project documents
    OR is_committee_in_project(current_user_id(), project_id)
    -- Admin: all
    OR is_admin_root(current_user_id())
  );

-- INSERT: Committee and admin_root can upload project docs
DROP POLICY IF EXISTS documents_insert ON documents;
CREATE POLICY documents_insert ON documents
  FOR INSERT
  WITH CHECK (
    is_committee_in_project(current_user_id(), project_id)
    OR is_admin_root(current_user_id())
  );

-- UPDATE/DELETE: Creator or admin_root (but business rule: cannot delete signed docs)
-- Note: Business rule enforcement should be in application layer, but RLS allows creator/admin
DROP POLICY IF EXISTS documents_update_delete ON documents;
CREATE POLICY documents_update_delete ON documents
  FOR ALL
  USING (
    created_by_user_id = current_user_id()
    OR is_admin_root(current_user_id())
  )
  WITH CHECK (
    created_by_user_id = current_user_id()
    OR is_admin_root(current_user_id())
  );

-- ============================================================================
-- DOCUMENT_ASSIGNMENTS TABLE
-- ============================================================================

-- SELECT: Resident sees own assignments, committee sees aggregate (no content), admin sees all
DROP POLICY IF EXISTS document_assignments_select ON document_assignments;
CREATE POLICY document_assignments_select ON document_assignments
  FOR SELECT
  USING (
    resident_user_id = current_user_id()
    OR is_committee_in_project(current_user_id(), project_id)
    OR is_admin_root(current_user_id())
  );

-- INSERT: Committee and admin_root can create assignments
DROP POLICY IF EXISTS document_assignments_insert ON document_assignments;
CREATE POLICY document_assignments_insert ON document_assignments
  FOR INSERT
  WITH CHECK (
    is_committee_in_project(current_user_id(), project_id)
    OR is_admin_root(current_user_id())
  );

-- UPDATE (Sign): Resident can sign own pending assignments only
-- Committee and admin_root are explicitly denied signing (per spec)
-- Signed assignments are immutable (enforced by trigger + this policy)
DROP POLICY IF EXISTS document_assignments_sign ON document_assignments;
CREATE POLICY document_assignments_sign ON document_assignments
  FOR UPDATE
  USING (
    resident_user_id = current_user_id()
    AND status = 'PENDING'
    AND NOT is_committee_in_project(current_user_id(), project_id)
    AND NOT is_admin_root(current_user_id())
  )
  WITH CHECK (
    resident_user_id = current_user_id()
    AND status = 'SIGNED'
    AND NOT is_committee_in_project(current_user_id(), project_id)
    AND NOT is_admin_root(current_user_id())
  );

-- Note: Signed documents are immutable - enforced by trigger (004_document_assignments_immutable.sql)
-- and this policy (status must be 'PENDING' to update, and only resident can update)

-- ============================================================================
-- VOTES TABLE
-- ============================================================================

-- SELECT: Project members can read project votes, admin sees all
DROP POLICY IF EXISTS votes_select ON votes;
CREATE POLICY votes_select ON votes
  FOR SELECT
  USING (
    is_project_member(current_user_id(), project_id)
    OR is_admin_root(current_user_id())
  );

-- INSERT/UPDATE/DELETE: Committee and admin_root in project scope
DROP POLICY IF EXISTS votes_manage ON votes;
CREATE POLICY votes_manage ON votes
  FOR ALL
  USING (
    (is_committee_in_project(current_user_id(), project_id) OR is_admin_root(current_user_id()))
  )
  WITH CHECK (
    (is_committee_in_project(current_user_id(), project_id) OR is_admin_root(current_user_id()))
  );

-- ============================================================================
-- VOTE_OPTIONS TABLE
-- ============================================================================

-- SELECT: Same as votes (project members)
DROP POLICY IF EXISTS vote_options_select ON vote_options;
CREATE POLICY vote_options_select ON vote_options
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM votes v
      WHERE v.id = vote_options.vote_id
        AND (is_project_member(current_user_id(), v.project_id) OR is_admin_root(current_user_id()))
    )
  );

-- INSERT/UPDATE/DELETE: Committee and admin_root
DROP POLICY IF EXISTS vote_options_manage ON vote_options;
CREATE POLICY vote_options_manage ON vote_options
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM votes v
      WHERE v.id = vote_options.vote_id
        AND (is_committee_in_project(current_user_id(), v.project_id) OR is_admin_root(current_user_id()))
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM votes v
      WHERE v.id = vote_options.vote_id
        AND (is_committee_in_project(current_user_id(), v.project_id) OR is_admin_root(current_user_id()))
    )
  );

-- ============================================================================
-- VOTE_BALLOTS TABLE
-- ============================================================================

-- SELECT: Resident sees own ballots, committee sees project ballots, admin sees all
DROP POLICY IF EXISTS vote_ballots_select ON vote_ballots;
CREATE POLICY vote_ballots_select ON vote_ballots
  FOR SELECT
  USING (
    voter_user_id = current_user_id()
    OR EXISTS (
      SELECT 1 FROM votes v
      WHERE v.id = vote_ballots.vote_id
        AND is_committee_in_project(current_user_id(), v.project_id)
    )
    OR is_admin_root(current_user_id())
  );

-- INSERT: Voter must be current user, and must be project member
-- Unique constraint (vote_id, voter_user_id) prevents double voting
DROP POLICY IF EXISTS vote_ballots_insert ON vote_ballots;
CREATE POLICY vote_ballots_insert ON vote_ballots
  FOR INSERT
  WITH CHECK (
    voter_user_id = current_user_id()
    AND EXISTS (
      SELECT 1 FROM votes v
      WHERE v.id = vote_ballots.vote_id
        AND is_project_member(current_user_id(), v.project_id)
        AND v.status = 'OPEN'
        AND v.opens_at <= NOW()
        AND v.closes_at > NOW()
    )
  );

-- UPDATE/DELETE: Denied (no revoting per spec)
-- Note: This is enforced by default deny, but explicit policy for clarity
DROP POLICY IF EXISTS vote_ballots_no_update_delete ON vote_ballots;
CREATE POLICY vote_ballots_no_update_delete ON vote_ballots
  FOR ALL
  USING (false)
  WITH CHECK (false);

-- ============================================================================
-- MESSAGES TABLE
-- ============================================================================

-- SELECT: Resident sees eligible messages in their project, committee sees project messages, admin sees all
-- Audience filter logic (all_residents, unsigned_residents, committee_only) is handled in application layer
DROP POLICY IF EXISTS messages_select ON messages;
CREATE POLICY messages_select ON messages
  FOR SELECT
  USING (
    is_project_member(current_user_id(), project_id)
    OR is_admin_root(current_user_id())
  );

-- INSERT: Committee and admin_root only (residents cannot create messages)
DROP POLICY IF EXISTS messages_insert ON messages;
CREATE POLICY messages_insert ON messages
  FOR INSERT
  WITH CHECK (
    is_committee_in_project(current_user_id(), project_id)
    OR is_admin_root(current_user_id())
  );

-- UPDATE: Creator or admin_root (for scheduling/cancelling)
DROP POLICY IF EXISTS messages_update ON messages;
CREATE POLICY messages_update ON messages
  FOR UPDATE
  USING (
    (created_by_user_id = current_user_id() AND is_committee_in_project(current_user_id(), project_id))
    OR is_admin_root(current_user_id())
  )
  WITH CHECK (
    (created_by_user_id = current_user_id() AND is_committee_in_project(current_user_id(), project_id))
    OR is_admin_root(current_user_id())
  );

-- DELETE: Creator or admin_root
DROP POLICY IF EXISTS messages_delete ON messages;
CREATE POLICY messages_delete ON messages
  FOR DELETE
  USING (
    created_by_user_id = current_user_id()
    OR is_admin_root(current_user_id())
  );

-- ============================================================================
-- MESSAGE_DELIVERIES TABLE
-- ============================================================================

-- SELECT: Resident sees only their own deliveries, committee/admin see project deliveries
DROP POLICY IF EXISTS message_deliveries_select ON message_deliveries;
CREATE POLICY message_deliveries_select ON message_deliveries
  FOR SELECT
  USING (
    recipient_user_id = current_user_id()
    OR is_committee_in_project(current_user_id(), project_id)
    OR is_admin_root(current_user_id())
  );

-- INSERT: System only (via message sending process)
-- Residents cannot insert their own deliveries
DROP POLICY IF EXISTS message_deliveries_insert ON message_deliveries;
CREATE POLICY message_deliveries_insert ON message_deliveries
  FOR INSERT
  WITH CHECK (
    is_committee_in_project(current_user_id(), project_id)
    OR is_admin_root(current_user_id())
  );

-- UPDATE: Resident can update only their own deliveries (mark as read)
-- Committee/admin cannot update deliveries (read status is resident-only)
DROP POLICY IF EXISTS message_deliveries_update ON message_deliveries;
CREATE POLICY message_deliveries_update ON message_deliveries
  FOR UPDATE
  USING (
    recipient_user_id = current_user_id()
    AND NOT is_committee_in_project(current_user_id(), project_id)
    AND NOT is_admin_root(current_user_id())
  )
  WITH CHECK (
    recipient_user_id = current_user_id()
    AND NOT is_committee_in_project(current_user_id(), project_id)
    AND NOT is_admin_root(current_user_id())
  );

-- DELETE: Denied (deliveries are immutable records)
DROP POLICY IF EXISTS message_deliveries_delete ON message_deliveries;
CREATE POLICY message_deliveries_delete ON message_deliveries
  FOR DELETE
  USING (false);

-- ============================================================================
-- PROJECT_LOGS TABLE
-- ============================================================================

-- SELECT: Project members can read, admin sees all
DROP POLICY IF EXISTS project_logs_select ON project_logs;
CREATE POLICY project_logs_select ON project_logs
  FOR SELECT
  USING (
    is_project_member(current_user_id(), project_id)
    OR is_admin_root(current_user_id())
  );

-- INSERT: Committee and admin_root
DROP POLICY IF EXISTS project_logs_insert ON project_logs;
CREATE POLICY project_logs_insert ON project_logs
  FOR INSERT
  WITH CHECK (
    is_committee_in_project(current_user_id(), project_id)
    OR is_admin_root(current_user_id())
  );

-- UPDATE/DELETE: Creator or admin_root
DROP POLICY IF EXISTS project_logs_update_delete ON project_logs;
CREATE POLICY project_logs_update_delete ON project_logs
  FOR ALL
  USING (
    created_by_user_id = current_user_id()
    OR is_admin_root(current_user_id())
  )
  WITH CHECK (
    created_by_user_id = current_user_id()
    OR is_admin_root(current_user_id())
  );

-- ============================================================================
-- FEATURE_FLAGS TABLE
-- ============================================================================

-- SELECT: All authenticated users (needed for feature checks)
DROP POLICY IF EXISTS feature_flags_select ON feature_flags;
CREATE POLICY feature_flags_select ON feature_flags
  FOR SELECT
  USING (current_user_id() IS NOT NULL);

-- INSERT/UPDATE/DELETE: Only admin_root
DROP POLICY IF EXISTS feature_flags_manage ON feature_flags;
CREATE POLICY feature_flags_manage ON feature_flags
  FOR ALL
  USING (is_admin_root(current_user_id()))
  WITH CHECK (is_admin_root(current_user_id()));

-- ============================================================================
-- FEATURE_FLAG_SCOPES TABLE
-- ============================================================================

-- SELECT: All authenticated users
DROP POLICY IF EXISTS feature_flag_scopes_select ON feature_flag_scopes;
CREATE POLICY feature_flag_scopes_select ON feature_flag_scopes
  FOR SELECT
  USING (current_user_id() IS NOT NULL);

-- INSERT/UPDATE/DELETE: Only admin_root
DROP POLICY IF EXISTS feature_flag_scopes_manage ON feature_flag_scopes;
CREATE POLICY feature_flag_scopes_manage ON feature_flag_scopes
  FOR ALL
  USING (is_admin_root(current_user_id()))
  WITH CHECK (is_admin_root(current_user_id()));

-- ============================================================================
-- AUDIT_EVENTS TABLE
-- ============================================================================

-- INSERT: System inserts (application layer)
-- Note: Application must have elevated privileges or use service role connection
DROP POLICY IF EXISTS audit_events_insert_system ON audit_events;
CREATE POLICY audit_events_insert_system ON audit_events
  FOR INSERT
  WITH CHECK (true); -- Application layer controls

-- SELECT: Committee sees project-scoped, admin sees all, resident denied
DROP POLICY IF EXISTS audit_events_select ON audit_events;
CREATE POLICY audit_events_select ON audit_events
  FOR SELECT
  USING (
    (project_id IS NOT NULL AND is_committee_in_project(current_user_id(), project_id))
    OR is_admin_root(current_user_id())
  );

-- ============================================================================
-- IMPERSONATION_SESSIONS TABLE
-- ============================================================================

-- SELECT/INSERT/UPDATE: Only admin_root
DROP POLICY IF EXISTS impersonation_sessions_admin ON impersonation_sessions;
CREATE POLICY impersonation_sessions_admin ON impersonation_sessions
  FOR ALL
  USING (is_admin_root(current_user_id()))
  WITH CHECK (is_admin_root(current_user_id()));
