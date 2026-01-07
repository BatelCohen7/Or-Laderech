-- Migration: Enforce immutability of signed document assignments
-- Prevents updates to signed assignments (except audit fields if needed)
-- Table: document_assignments

-- Drop existing function and trigger if they exist
DROP TRIGGER IF EXISTS document_assignment_immutable_trigger ON document_assignments;
DROP FUNCTION IF EXISTS check_document_assignment_immutable();

-- Create function to prevent updates to signed assignments
CREATE OR REPLACE FUNCTION check_document_assignment_immutable()
RETURNS TRIGGER AS $$
BEGIN
  -- If the assignment is signed, prevent any updates
  IF OLD.status = 'SIGNED' THEN
    RAISE EXCEPTION USING
      ERRCODE = '23514', -- CHECK_VIOLATION (standard PostgreSQL error code)
      MESSAGE = format('Document assignment %s is signed and cannot be modified', OLD.id);
  END IF;

  -- Prevent changing status from SIGNED back to PENDING
  IF OLD.status = 'SIGNED' AND NEW.status != 'SIGNED' THEN
    RAISE EXCEPTION USING
      ERRCODE = '23514', -- CHECK_VIOLATION
      MESSAGE = format('Cannot revert signed document assignment %s', OLD.id);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger before update
CREATE TRIGGER document_assignment_immutable_trigger
  BEFORE UPDATE ON document_assignments
  FOR EACH ROW
  EXECUTE FUNCTION check_document_assignment_immutable();

-- Note: This trigger prevents any updates to signed assignments.
-- The only exception would be adding audit fields, but we keep it minimal per spec.
-- Signing is idempotent: if already signed, the application layer returns 200 with existing signed_at.
