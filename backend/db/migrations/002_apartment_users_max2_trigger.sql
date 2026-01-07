-- Migration: Enforce maximum 2 users per apartment
-- This trigger prevents inserting or updating more than 2 users into an apartment
-- Table: apartment_users
-- Constraint: Maximum 2 rows per apartment_id

-- Drop existing function and trigger if they exist
DROP TRIGGER IF EXISTS apartment_user_limit_trigger ON apartment_users;
DROP FUNCTION IF EXISTS check_apartment_user_limit();

-- Create function to check apartment user limit
CREATE OR REPLACE FUNCTION check_apartment_user_limit()
RETURNS TRIGGER AS $$
DECLARE
  user_count INTEGER;
  apartment_uuid UUID;
BEGIN
  -- Determine which apartment_id to check
  apartment_uuid := COALESCE(NEW.apartment_id, OLD.apartment_id);
  
  -- Count existing users for this apartment (excluding the current row if updating)
  SELECT COUNT(*) INTO user_count
  FROM apartment_users
  WHERE apartment_id = apartment_uuid
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid);

  -- If already 2 users, prevent insert/update
  IF user_count >= 2 THEN
    RAISE EXCEPTION USING
      ERRCODE = '23514',
      MESSAGE = format('Apartment %s already has maximum 2 users (limit: 2)', apartment_uuid);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger before insert
CREATE TRIGGER apartment_user_limit_trigger
  BEFORE INSERT ON apartment_users
  FOR EACH ROW
  EXECUTE FUNCTION check_apartment_user_limit();

-- Create trigger before update of apartment_id
CREATE TRIGGER apartment_user_limit_update_trigger
  BEFORE UPDATE OF apartment_id ON apartment_users
  FOR EACH ROW
  WHEN (NEW.apartment_id IS DISTINCT FROM OLD.apartment_id)
  EXECUTE FUNCTION check_apartment_user_limit();

-- Note: 
-- - INSERT trigger prevents inserts that would exceed the limit
-- - UPDATE trigger prevents changing apartment_id if target apartment already has 2 users
-- - Error code 23514 is CHECK_VIOLATION (standard PostgreSQL error code)
-- - The constraint is enforced at both database level (this trigger) and application level (service layer)
