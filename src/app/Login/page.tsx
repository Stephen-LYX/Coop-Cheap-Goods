"use client"; //client component

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
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between login and signup
  const [loading, setLoading] = useState(false);

  // ✅ NEW: checkbox state
  const [agreed, setAgreed] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // ✅ Prevent login if terms not agreed
    if (!agreed) {
      setMessage("You must agree to the Terms and Conditions before logging in.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage("Error: " + error.message);
    } else {
      setMessage("Login successful! Welcome " + data.user.email);
      router.push("/Home"); // redirect after login
    }
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // ✅ Prevent signup if terms not agreed
    if (!agreed) {
      setMessage("You must agree to the Terms and Conditions before creating an account.");
      setLoading(false);
      return;
    }

    // Validate passwords match
    if (password !== confirmPassword) {
      setMessage("Error: Passwords do not match");
      setLoading(false);
      return;
    }

    // Validate password length
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
          username: username, // Store username in user metadata
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

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setMessage("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setUsername("");
    setAgreed(false); // reset terms when switching
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
          {isSignUp ? "Create Account" : "Login"}
        </h1>
        
        <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="flex flex-col gap-4">
          {/* Username field - only show for signup */}
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
          
          {/* Confirm password field - only show for signup */}
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

          {/* ✅ Terms & Conditions checkbox */}
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
            className="rounded-lg bg-blue-600 py-2 text-white font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Loading..." : (isSignUp ? "Create Account" : "Log In")}
          </button>
        </form>
        
        {/* Toggle between login and signup */}
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
        
        {message && (
          <p className={`mt-4 text-center text-sm ${
            message.includes("Error") ? "text-red-600" : "text-green-600"
          }`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
