-- Demo/Seed Data for Single Project Mode
-- Creates: 1 project, 1 admin, 1 committee, 200 residents + apartments, sample data

-- Note: This assumes roles and permissions are already seeded (001_seed_rbac.sql)

-- Get role IDs (assuming they exist from seed)
DO $$
DECLARE
  admin_role_id UUID;
  committee_role_id UUID;
  resident_role_id UUID;
  project_id UUID;
  admin_user_id UUID;
  committee_user_id UUID;
  sample_vote_id UUID;
  sample_doc_id UUID;
BEGIN
  -- Get role IDs
  SELECT id INTO admin_role_id FROM roles WHERE name = 'admin_root';
  SELECT id INTO committee_role_id FROM roles WHERE name = 'committee';
  SELECT id INTO resident_role_id FROM roles WHERE name = 'resident';

  -- Create project
  INSERT INTO projects (id, name, address, city, status_stage, status_percent, is_active, created_at, updated_at)
  VALUES (
    gen_random_uuid(),
    'תוכנית התחדשות עירונית - רחוב ראשי 123',
    'רחוב ראשי 123, תל אביב',
    'תל אביב',
    'SIGNATURES',
    45,
    true,
    NOW(),
    NOW()
  )
  RETURNING id INTO project_id;

  -- Create admin user
  INSERT INTO users (id, email, name, password, is_enabled, global_role, created_at, updated_at)
  VALUES (
    gen_random_uuid(),
    'admin@orladerech.com',
    'מנהל מערכת',
    '$2b$10$dummy.hash.for.demo.purposes.only', -- In production, use proper bcrypt hash
    true,
    'admin_root',
    NOW(),
    NOW()
  )
  RETURNING id INTO admin_user_id;

  -- Assign admin to project
  INSERT INTO project_memberships (id, project_id, user_id, role_id, created_at)
  VALUES (gen_random_uuid(), project_id, admin_user_id, admin_role_id, NOW());

  -- Create committee user
  INSERT INTO users (id, email, name, phone, password, is_enabled, created_at, updated_at)
  VALUES (
    gen_random_uuid(),
    'committee@orladerech.com',
    'יו"ר הוועד',
    '050-1234567',
    '$2b$10$dummy.hash.for.demo.purposes.only',
    true,
    NOW(),
    NOW()
  )
  RETURNING id INTO committee_user_id;

  -- Assign committee to project
  INSERT INTO project_memberships (id, project_id, user_id, role_id, created_at)
  VALUES (gen_random_uuid(), project_id, committee_user_id, committee_role_id, NOW());

  -- Create 200 residents with apartments
  FOR i IN 1..200 LOOP
    DECLARE
      resident_user_id UUID;
      apartment_id UUID;
    BEGIN
      -- Create resident user
      INSERT INTO users (id, email, name, phone, password, is_enabled, created_at, updated_at)
      VALUES (
        gen_random_uuid(),
        'resident' || i || '@example.com',
        'דייר ' || i,
        '050-' || LPAD(i::text, 7, '0'),
        '$2b$10$dummy.hash.for.demo.purposes.only',
        true,
        NOW(),
        NOW()
      )
      RETURNING id INTO resident_user_id;

      -- Assign resident to project
      INSERT INTO project_memberships (id, project_id, user_id, role_id, created_at)
      VALUES (gen_random_uuid(), project_id, resident_user_id, resident_role_id, NOW());

      -- Create apartment
      INSERT INTO apartments (id, project_id, building, floor, unit_number, current_sqm, future_sqm, created_at)
      VALUES (
        gen_random_uuid(),
        project_id,
        'בית ' || ((i - 1) / 20 + 1),
        (i % 10) + 1,
        LPAD(i::text, 3, '0'),
        80 + (i % 40),
        100 + (i % 50),
        NOW()
      )
      RETURNING id INTO apartment_id;

      -- Link resident to apartment (primary)
      INSERT INTO apartment_users (id, project_id, apartment_id, user_id, role_in_apartment, created_at)
      VALUES (gen_random_uuid(), project_id, apartment_id, resident_user_id, 'primary', NOW());
    END;
  END LOOP;

  -- Create sample document (for assignments)
  INSERT INTO documents (id, project_id, title, doc_type, storage_path, created_by_user_id, created_at)
  VALUES (
    gen_random_uuid(),
    project_id,
    'חוזה אישי - דירה',
    'PERSONAL_CONTRACT',
    'documents/sample-contract.pdf',
    admin_user_id,
    NOW()
  )
  RETURNING id INTO sample_doc_id;

  -- Create sample document assignments (first 50 residents, pending)
  FOR i IN 1..50 LOOP
    DECLARE
      resident_user_id UUID;
    BEGIN
      SELECT pm.user_id INTO resident_user_id
      FROM project_memberships pm
      JOIN roles r ON pm.role_id = r.id
      WHERE pm.project_id = project_id AND r.name = 'resident'
      ORDER BY pm.created_at
      LIMIT 1 OFFSET (i - 1);

      IF resident_user_id IS NOT NULL THEN
        INSERT INTO document_assignments (id, project_id, document_id, resident_user_id, status, created_at)
        VALUES (gen_random_uuid(), project_id, sample_doc_id, resident_user_id, 'PENDING', NOW());
      END IF;
    END;
  END LOOP;

  -- Create sample vote
  INSERT INTO votes (id, project_id, title, description, audience_filter, deadline_at, status, created_by_user_id, created_at)
  VALUES (
    gen_random_uuid(),
    project_id,
    'הצבעה על תאריך אספה כללית',
    'אנא בחרו את התאריך המועדף עליכם לאספה הכללית',
    'ALL_RESIDENTS',
    NOW() + INTERVAL '30 days',
    'OPEN',
    committee_user_id,
    NOW()
  )
  RETURNING id INTO sample_vote_id;

  -- Create vote options
  INSERT INTO vote_options (id, vote_id, label, sort_order)
  VALUES
    (gen_random_uuid(), sample_vote_id, 'יום ראשון, 15.01.2024', 1),
    (gen_random_uuid(), sample_vote_id, 'יום שני, 16.01.2024', 2),
    (gen_random_uuid(), sample_vote_id, 'יום שלישי, 17.01.2024', 3);

  -- Create sample messages
  INSERT INTO messages (id, project_id, title, body, audience_filter, sent_at, created_by_user_id, created_at)
  VALUES
    (
      gen_random_uuid(),
      project_id,
      'עדכון חשוב - התקדמות הפרויקט',
      'שלום לכולם, אנו שמחים לעדכן כי התקדמנו ל-45% מהחתימות הנדרשות. אנא המשיכו לחתום על המסמכים.',
      'ALL_RESIDENTS',
      NOW(),
      committee_user_id,
      NOW()
    ),
    (
      gen_random_uuid(),
      project_id,
      'תזכורת - חתימה על מסמכים',
      'לכל הדיירים שעדיין לא חתמו: אנא חתמו על המסמכים בהקדם.',
      'UNSIGNED_RESIDENTS',
      NOW(),
      committee_user_id,
      NOW()
    );

  RAISE NOTICE 'Demo data created successfully: Project %, Admin %, Committee %, 200 Residents', project_id, admin_user_id, committee_user_id;
END $$;
