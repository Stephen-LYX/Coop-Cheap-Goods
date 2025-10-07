// src/app/Login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      console.log("🔵 Attempting login for:", email);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        console.error("❌ Login error:", error);
        setMessage("Error: " + error.message);
        setLoading(false);
        return;
      }

      console.log("✅ Login API returned user:", data.user?.id);

      // Confirm session is now present
      const { data: sessionData } = await supabase.auth.getSession();
      console.log("🟢 Session after login:", sessionData.session?.user ?? sessionData);

      // redirect to home or inbox after successful sign-in
      router.push("/home");
    } catch (err: any) {
      console.error("Network/login error:", err);
      setMessage("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("Error: Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setMessage("Error: Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username } },
      });

      if (error) {
        console.error("❌ Signup error:", error);
        setMessage("Error: " + error.message);
      } else {
        console.log("✅ Signup success:", data.user?.id);
        setMessage("Account created. Check email to confirm or you'll be redirected.");
        // some flows require email confirmation; if not, you can redirect:
        router.push("/home");
      }
    } catch (err: any) {
      console.error("Signup network error:", err);
      setMessage("Network error");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setMessage("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setUsername("");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">{isSignUp ? "Create Account" : "Login"}</h1>

        <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="flex flex-col gap-4">
          {isSignUp && (
            <input value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="Username" className="rounded-lg border px-4 py-2"/>
          )}
          <input value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email" type="email" className="rounded-lg border px-4 py-2"/>
          <input value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Password" type="password" className="rounded-lg border px-4 py-2"/>
          {isSignUp && <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="Confirm password" type="password" className="rounded-lg border px-4 py-2"/>}

          <button type="submit" disabled={loading} className="rounded-lg bg-blue-600 py-2 text-white font-semibold hover:bg-blue-700">
            {loading ? "Loading..." : (isSignUp ? "Create Account" : "Log In")}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button onClick={toggleMode} className="text-blue-600 text-sm underline">
            {isSignUp ? "Already have an account? Log in" : "Don't have an account? Create one"}
          </button>
        </div>

        {message && <p className={`mt-4 text-center text-sm ${message.includes("Error") ? "text-red-600" : "text-green-600"}`}>{message}</p>}
      </div>
    </div>
  );
}
