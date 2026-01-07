-- Enable Row Level Security on all tables
-- This script enables RLS on all relevant tables in the schema
-- RLS is enabled but no policies are created here (see 003_policies.sql)

-- Core entities
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_memberships ENABLE ROW LEVEL SECURITY;

-- Resident domain
ALTER TABLE apartments ENABLE ROW LEVEL SECURITY;
ALTER TABLE apartment_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_assignments ENABLE ROW LEVEL SECURITY;

-- Voting
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE vote_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE vote_ballots ENABLE ROW LEVEL SECURITY;

-- Messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Tracking
ALTER TABLE project_logs ENABLE ROW LEVEL SECURITY;

-- Feature flags
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_flag_scopes ENABLE ROW LEVEL SECURITY;

-- Audit/Security
ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE impersonation_sessions ENABLE ROW LEVEL SECURITY;

-- Note: Tables that should be publicly readable (if any) can have permissive policies
-- By default, all tables deny access until policies are created
