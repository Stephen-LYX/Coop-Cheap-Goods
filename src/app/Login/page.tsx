"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🆕 Forgot password states
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  // --- LOGIN ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage("Error: " + error.message);
    } else {
      setMessage("Login successful! Welcome " + data.user.email);
      router.push("/Home");
    }
    setLoading(false);
  };

  // --- SIGN UP ---
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

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
        },
      },
    });

    if (error) {
      setMessage("Error: " + error.message);
    } else {
      if (data.user && !data.user.email_confirmed_at) {
        setMessage("Success! Please check your email to confirm your account.");
      } else {
        setMessage("Account created successfully! Welcome " + data.user?.email);
        router.push("/Home");
      }
    }
    setLoading(false);
  };

  // 🆕 Handle password reset request
  const handleResetRequest = async () => {
    if (!email) {
      setMessage("Please enter your email first.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
    if (error) setMessage("Error: " + error.message);
    else setMessage("Password reset link sent! Check your email.");
    setLoading(false);
  };

  // 🆕 Handle updating password after reset link
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) setMessage("Error: " + error.message);
    else {
      setMessage("Password updated! You can now log in.");
      setIsResettingPassword(false);
      setNewPassword("");
    }
    setLoading(false);
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
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
          {isResettingPassword
            ? "Reset Password"
            : isSignUp
            ? "Create Account"
            : "Login"}
        </h1>

        {/* 🆕 Reset Password Form */}
        {isResettingPassword ? (
          <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 py-2 text-white font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
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
          // --- Normal Login / Signup Form ---
          <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="flex flex-col gap-4">
            {isSignUp && (
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            )}

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />

            {isSignUp && (
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            )}

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 py-2 text-white font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Loading..." : isSignUp ? "Create Account" : "Log In"}
            </button>

            {/* 🆕 Forgot password button */}
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

        {/* Toggle between login and signup */}
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
