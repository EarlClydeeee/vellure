-- Test & admin accounts for Vellure
-- Run after: 001_initial_schema.sql, 003_tier1_commerce.sql
--
-- ┌─────────────────────────────────────────────────────────────────────────┐
-- │ ADMIN (simulated auth — NOT in auth.users)                              │
-- │   URL:      /admin/login                                                │
-- │   Username: admin                                                       │
-- │   Password: admin1234                                                   │
-- │   Configure in .env.local:                                              │
-- │     ADMIN_USERNAME=admin                                                │
-- │     ADMIN_PASSWORD=admin1234                                            │
-- └─────────────────────────────────────────────────────────────────────────┘
--
-- ┌─────────────────────────────────────────────────────────────────────────┐
-- │ TEST CUSTOMER (Supabase Auth — login at /login)                         │
-- │   Email:    test@gmail.com                                              │
-- │   Password: test1234                                                    │
-- └─────────────────────────────────────────────────────────────────────────┘

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
DECLARE
  test_email TEXT := 'test@gmail.com';
  test_password TEXT := 'test1234';
  test_id UUID := 'c1111111-1111-4111-8111-111111111111';
  existing_id UUID;
BEGIN
  SELECT id INTO existing_id FROM auth.users WHERE email = test_email;

  IF existing_id IS NULL THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      test_id,
      'authenticated',
      'authenticated',
      test_email,
      crypt(test_password, gen_salt('bf')),
      NOW(),
      NOW(),
      NOW(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"Test Customer"}'::jsonb,
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    );

    INSERT INTO auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      provider_id,
      last_sign_in_at,
      created_at,
      updated_at
    ) VALUES (
      test_id,
      test_id,
      jsonb_build_object('sub', test_id::text, 'email', test_email),
      'email',
      test_id::text,
      NOW(),
      NOW(),
      NOW()
    );

    existing_id := test_id;
    RAISE NOTICE 'Created test customer: % / %', test_email, test_password;
  ELSE
    UPDATE auth.users
    SET
      encrypted_password = crypt(test_password, gen_salt('bf')),
      email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
      raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb)
        || '{"full_name":"Test Customer"}'::jsonb,
      updated_at = NOW()
    WHERE id = existing_id;

    RAISE NOTICE 'Test customer % already exists — password reset to %', test_email, test_password;
  END IF;

  INSERT INTO public.customers (id, email, full_name, contact_number)
  VALUES (existing_id, test_email, 'Test Customer', '09171234567')
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    contact_number = EXCLUDED.contact_number;
END $$;
