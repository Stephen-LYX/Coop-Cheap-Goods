"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { createClientComponentClient, SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { User } from "@supabase/supabase-js";

// 1. Define the shape of your context
type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, username: string) => Promise<any>;
  logout: () => Promise<any>;
  loading: boolean;
  supabase: SupabaseClient;
};

// 2. Create the context with proper typing
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (!error) setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  // Auth functions
  const login = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  };

  const signUp = async (email: string, password: string, username: string) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    });
  };

  const logout = async () => {
    return await supabase.auth.signOut();
  };

  const value: AuthContextType = {
    user,
    login,
    signUp,
    logout,
    loading,
    supabase,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};