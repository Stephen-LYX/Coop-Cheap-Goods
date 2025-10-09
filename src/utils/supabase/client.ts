"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

/**
 * Returns a Supabase client that is fully session-aware
 * and compatible with @supabase/auth-helpers-nextjs.
 *
 * This ensures user authentication, cookies, and session
 * persistence all work correctly across your Next.js app.
 */
export const createClient = () => createClientComponentClient();
