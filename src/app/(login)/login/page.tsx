"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabaseClient";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState(""); // For password reset
  const [message, setMessage] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!agreed) {
      setMessage(
        "You must agree to the Terms and Conditions before logging in.",
      );
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
        router.push("/");
      }
    } catch (err: unknown) {
      console.error("Login network error:", err);
      setMessage("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!agreed) {
      setMessage(
        "You must agree to the Terms and Conditions before creating an account.",
      );
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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username } },
      });

      if (error) {
        setMessage("Error: " + error.message);
      } else {
        if (data.user && !data.user.email_confirmed_at) {
          setMessage(
            "Success! Please check your email to confirm your account.",
          );
        } else {
          console.log("✅ Signup success:", data.user?.id);
          setMessage(
            "Account created. Check email to confirm or you'll be redirected.",
          );
          router.push("/");
        }
      }
    } catch (err: unknown) {
      console.error("Signup network error:", err);
      setMessage("Network error");
    } finally {
      setLoading(false);
    }
  };

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
    } catch (err: unknown) {
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
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        setMessage("Error: " + error.message);
      } else {
        setMessage("Password updated! You can now log in.");
        setIsResettingPassword(false);
        setNewPassword("");
      }
    } catch (err: unknown) {
      console.error("Password update error:", err);
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
    setAgreed(false);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Left Side - Branding */}
          <div className="text-center lg:text-left space-y-4">
            <div className="flex justify-center lg:justify-start items-center gap-4 mb-6">
              <Image
                src="/chicken.png"
                alt="Coop Logo"
                width={80}
                height={80}
                className="object-contain"
              />
              <h1 className="text-5xl lg:text-6xl font-bold text-blue-600">
                Coop
              </h1>
            </div>
            <p className="text-2xl lg:text-3xl text-gray-700 max-w-md">
              Your trusted marketplace for local communities.
            </p>
          </div>

          {/* Right Side - Form */}
          <div className="w-full max-w-md mx-auto">
            <div className="rounded-lg bg-white p-6 shadow-xl">
              {isResettingPassword ? (
                <form
                  onSubmit={handleResetPassword}
                  className="flex flex-col gap-4"
                >
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    Reset Your Password
                  </h2>
                  <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    className="rounded-lg border border-gray-300 px-4 py-3 text-base text-black focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-blue-600 py-3 text-lg text-white font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
                  >
                    {loading ? "Updating..." : "Update Password"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsResettingPassword(false)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Back to Login
                  </button>
                </form>
              ) : isSignUp ? (
                <form onSubmit={handleSignUp} className="flex flex-col gap-3">
                  <h2 className="text-2xl font-bold text-gray-800 mb-1">
                    Create a new account
                  </h2>
                  <p className="text-gray-600 text-sm mb-2">
                    It&apos;s quick and easy.
                  </p>
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="rounded-lg border border-gray-300 px-4 py-3 text-base text-black focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="rounded-lg border border-gray-300 px-4 py-3 text-base text-black focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <input
                    type="password"
                    placeholder="New password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="rounded-lg border border-gray-300 px-4 py-3 text-base text-black focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <input
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="rounded-lg border border-gray-300 px-4 py-3 text-base text-black focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />

                  <label className="flex items-start gap-2 text-xs text-gray-600">
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
                        className="text-blue-600 hover:underline"
                      >
                        Terms and Conditions
                      </a>
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-green-600 py-3 text-lg text-white font-semibold hover:bg-green-700 disabled:opacity-50 transition mt-2"
                  >
                    {loading ? "Creating..." : "Sign Up"}
                  </button>

                  <div className="border-t border-gray-300 mt-4 pt-4 text-center">
                    <button
                      type="button"
                      onClick={toggleMode}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Already have an account?
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleLogin} className="flex flex-col gap-3">
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="rounded-lg border border-gray-300 px-4 py-3 text-base text-black focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="rounded-lg border border-gray-300 px-4 py-3 text-base text-black focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />

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
                        className="text-blue-600 hover:underline"
                      >
                        Terms and Conditions
                      </a>
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-blue-600 py-3 text-lg text-white font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
                  >
                    {loading ? "Loading..." : "Log In"}
                  </button>

                  <button
                    type="button"
                    onClick={handleResetRequest}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Forgot password?
                  </button>

                  <div className="border-t border-gray-300 mt-4 pt-4 text-center">
                    <button
                      type="button"
                      onClick={toggleMode}
                      className="rounded-lg bg-green-600 px-12 py-3 text-lg text-white font-semibold hover:bg-green-700 transition"
                    >
                      Create new account
                    </button>
                  </div>
                </form>
              )}

              {message && (
                <p
                  className={`mt-4 text-center text-sm ${
                    message.includes("Error")
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
