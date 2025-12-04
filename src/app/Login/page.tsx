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
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  // -------------------------
  // Scalable college domain mapping
  // -------------------------
  const getDomain = (email: string) =>
    email.split("@")[1]?.toLowerCase() ?? "";

  const findCollegeDomain = async (email: string) => {
    const domain = getDomain(email);
    if (!domain) return null;

    const { data } = await supabase
      .from("college_domains")
      .select("*")
      .eq("domain", domain)
      .maybeSingle();

    return data ?? null;
  };
  // -------------------------

  // -------------------------
  // LOGIN
  // -------------------------
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!agreed) {
      setMessage("You must agree to the Terms and Conditions before logging in.");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage("Error: " + error.message);
      } else {
        setMessage("Login successful! Welcome " + data.user.email);
        router.push("/home");
      }
    } catch (err: any) {
      console.error("Login network error:", err);
      setMessage("Network error");
    } finally {
      setLoading(false);
    }
  };
  // -------------------------

  // -------------------------
  // SIGNUP with auto-join to coop_members
  // -------------------------
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!agreed) {
      setMessage("You must agree to the Terms and Conditions before creating an account.");
      setLoading(false);
      return;
    }

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
      // -------------------------
      // 1️⃣ Find college domain
      // -------------------------
      const collegeRecord = await findCollegeDomain(email);

      // -------------------------
      // 2️⃣ Create user in Supabase
      // -------------------------
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            college_domain_id: collegeRecord?.id ?? null,
          },
        },
      });

      if (error) {
        setMessage("Error: " + error.message);
        setLoading(false);
        return;
      }

      // -------------------------
      // 3️⃣ Auto-join the user to their university coop
      // -------------------------
      if (collegeRecord && data.user) {
        // Insert into coop_members
        await supabase.from("coop_members").insert({
          coops_id: collegeRecord.coop_id,
          user_id: data.user.id,
          joined_at: new Date().toISOString(),
        });
      }

      // -------------------------
      // 4️⃣ Message / redirect
      // -------------------------
      if (data.user && !data.user.email_confirmed_at) {
        setMessage("Success! Please check your email to confirm your account.");
      } else {
        setMessage("Account created. Redirecting...");
        router.push("/home");
      }
    } catch (err: any) {
      console.error("Signup network error:", err);
      setMessage("Network error");
    } finally {
      setLoading(false);
    }
  };
  // -------------------------

  // -------------------------
  // PASSWORD RESET
  // -------------------------
  const handleResetRequest = async () => {
    if (!email) {
      setMessage("Please enter your email first.");
      return;
    }
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });

      if (error) {
        setMessage("Error: " + error.message);
      } else {
        setMessage("Password reset link sent! Check your email.");
      }
    } catch (err: any) {
      console.error("Reset request error:", err);
      setMessage("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });

      if (error) {
        setMessage("Error: " + error.message);
      } else {
        setMessage("Password updated! You can now log in.");
        setIsResettingPassword(false);
        setNewPassword("");
      }
    } catch (err: any) {
      console.error("Password update error:", err);
      setMessage("Network error");
    } finally {
      setLoading(false);
    }
  };
  // -------------------------

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setMessage("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setUsername("");
    setAgreed(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
          {isResettingPassword ? "Reset Password" : isSignUp ? "Create Account" : "Login"}
        </h1>

        {isResettingPassword ? (
          <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              className="rounded-lg border border-gray-300 px-4 py-2 text-black focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 py-2 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
            <button
              type="button"
              onClick={() => setIsResettingPassword(false)}
              className="text-sm text-blue-600 underline hover:text-blue-700 mt-2"
            >
              Back to Login
            </button>
          </form>
        ) : (
          <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="flex flex-col gap-4">
            {isSignUp && (
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="rounded-lg border border-gray-300 px-4 py-2 text-black focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-lg border border-gray-300 px-4 py-2 text-black focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="rounded-lg border border-gray-300 px-4 py-2 text-black focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            {isSignUp && (
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="rounded-lg border border-gray-300 px-4 py-2 text-black focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            )}

            <label className="flex items-start gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1"
              />
              <span>
                I agree to the{" "}
                <a
                  href="/terms"
                  target="_blank"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  Terms and Conditions
                </a>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 py-2 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Loading..." : isSignUp ? "Create Account" : "Log In"}
            </button>

            {!isSignUp && (
              <button
                type="button"
                onClick={handleResetRequest}
                className="text-sm text-blue-600 underline hover:text-blue-700 mt-2"
              >
                Forgot password?
              </button>
            )}
          </form>
        )}

        {!isResettingPassword && (
          <div className="mt-4 text-center">
            <button
              onClick={toggleMode}
              className="text-blue-600 hover:text-blue-700 text-sm underline cursor-pointer"
            >
              {isSignUp
                ? "Already have an account? Log in"
                : "Don't have an account? Create one"}
            </button>
          </div>
        )}

        {message && (
          <p
            className={`mt-4 text-center text-sm ${
              message.includes("Error") ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
