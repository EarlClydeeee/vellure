-- Admin & test accounts for Vellure
-- Run after: 001_initial_schema.sql, 003_tier1_commerce.sql
--
-- ┌─────────────────────────────────────────────────────────────────────────┐
-- │ ADMIN                                                                   │
-- │   Dashboard: /admin/login                                               │
-- │   Email:     admin@gmail.com                                            │
-- │   Password:  admin1234                                                  │
-- │   .env.local: ADMIN_EMAIL=admin@gmail.com                               │
-- │               ADMIN_PASSWORD=admin1234                                  │
-- └─────────────────────────────────────────────────────────────────────────┘
--
-- ┌─────────────────────────────────────────────────────────────────────────┐
-- │ TEST CUSTOMER (storefront /login)                                       │
-- │   Email:    test@gmail.com                                              │
-- │   Password: test1234                                                    │
-- └─────────────────────────────────────────────────────────────────────────┘

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE OR REPLACE FUNCTION public.seed_auth_email_user(
  p_email TEXT,
  p_password TEXT,
  p_user_id UUID,
  p_full_name TEXT,
  p_contact_number TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions
AS $$
DECLARE
  existing_id UUID;
BEGIN
  SELECT id INTO existing_id FROM auth.users WHERE email = p_email;

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
      p_user_id,
      'authenticated',
      'authenticated',
      p_email,
      crypt(p_password, gen_salt('bf')),
      NOW(),
      NOW(),
      NOW(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('full_name', p_full_name),
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
      p_user_id,
      p_user_id,
      jsonb_build_object('sub', p_user_id::text, 'email', p_email),
      'email',
      p_user_id::text,
      NOW(),
      NOW(),
      NOW()
    );

    existing_id := p_user_id;
    RAISE NOTICE 'Created user: % / %', p_email, p_password;
  ELSE
    UPDATE auth.users
    SET
      encrypted_password = crypt(p_password, gen_salt('bf')),
      email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
      raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb)
        || jsonb_build_object('full_name', p_full_name),
      updated_at = NOW()
    WHERE id = existing_id;

    RAISE NOTICE 'User % already exists — password reset to %', p_email, p_password;
  END IF;

  INSERT INTO public.customers (id, email, full_name, contact_number)
  VALUES (existing_id, p_email, p_full_name, p_contact_number)
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    contact_number = COALESCE(EXCLUDED.contact_number, customers.contact_number);

  RETURN existing_id;
END;
$$;

SELECT public.seed_auth_email_user(
  'admin@gmail.com',
  'admin1234',
  'a1111111-1111-4111-8111-111111111111'::uuid,
  'Platform Admin'
);

SELECT public.seed_auth_email_user(
  'test@gmail.com',
  'test1234',
  'c1111111-1111-4111-8111-111111111111'::uuid,
  'Test Customer',
  '09171234567'
);

DROP FUNCTION public.seed_auth_email_user(TEXT, TEXT, UUID, TEXT, TEXT);
