import { createClient } from '@/lib/supabase/client';

export async function signUp(email: string, password: string, fullName?: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    return { success: false as const, error: error.message };
  }

  return { success: true as const, data };
}

export async function signIn(email: string, password: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false as const, error: error.message };
  }

  return { success: true as const, data };
}

export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { success: false as const, error: error.message };
  }

  return { success: true as const };
}

export async function getSession() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    return { success: false as const, error: error.message };
  }

  return { success: true as const, data: data.session };
}

export async function getUser() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return { success: false as const, error: error.message };
  }

  return { success: true as const, data: data.user };
}
