-- Migration: Add composite foreign key constraint for apartment_users
-- Ensures apartment_id and project_id in apartment_users match apartments table
-- Note: Prisma doesn't support composite FKs natively, so we add this as a database constraint

-- Add check constraint to ensure apartment_id and project_id consistency
ALTER TABLE apartment_users
ADD CONSTRAINT apartment_users_apartment_project_fk
FOREIGN KEY (apartment_id, project_id)
REFERENCES apartments(id, project_id)
ON DELETE CASCADE;

-- Add index for the composite FK (if not exists from Prisma)
CREATE INDEX IF NOT EXISTS apartment_users_apartment_project_idx 
ON apartment_users(apartment_id, project_id);
