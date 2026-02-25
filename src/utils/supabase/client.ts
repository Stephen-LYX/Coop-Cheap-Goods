"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Returns a Supabase client that is fully session-aware.
 *
 * The prior version used @supabase/auth-helpers-nextjs; after migrating to
 * @supabase/ssr we can simply expose a helper that constructs the client.
 */
export const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};
