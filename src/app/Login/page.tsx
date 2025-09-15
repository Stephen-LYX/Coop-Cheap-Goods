"use client"; // client component

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { SupabaseAuthClient } from "@supabase/supabase-js/dist/module/lib/SupabaseAuthClient";

export default function LoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); // for signup
  const [isSignUp, setIsSignUp] = useState(false); // toggle between login/signup
  const [message, setMessage] = useState("");

<<<<<<< Updated upstream
  //handle login
=======
  // handle login
  // const handleLogin = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   const { data, error } = await supabase.auth.signInWithPassword({
  //     email,
  //     password,
  //   });

  //   if (error) {
  //     setMessage("Error: " + error.message);
  //   } else {
  //     setMessage("Login successful! Welcome " + data.user.email);
  //     router.push("/home");
  //   }
  // };

  // // handle signup
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage("Error: " + error.message);
      return;
    }

    // if signup works, insert username into your "profiles" (or "users") table
    const { error: insertError } = await supabase
      .from("profiles") // change this to your actual table name
      .insert([{ id: data.user?.id, email, username }]);

    if (insertError) {
      setMessage("Signup succeeded, but error saving username: " + insertError.message);
    } else {
      setMessage("Account created! Please check your email to confirm.");
    }
  };
// handle login

//delete the row below 
>>>>>>> Stashed changes
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email, 
      password,
    });

    if (error) {
      setMessage("Error: " + error.message);
<<<<<<< Updated upstream
    } else {
      setMessage("Login successful! Welcome " + data.user.email);
      router.push("/home");
=======
      return;
>>>>>>> Stashed changes
    }

    const user = data.user;

    // Fetch username from your profiles table
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .single();

    if (profileError) {
      setMessage("Login succeeded, but error fetching profile: " + profileError.message);
    } else {
      setMessage(`Login successful! Welcome ${profile.username}`);
      // You may want to save this username globally (context, zustand, recoil, etc.)
    }

    router.push("/chat");
  };
// delete the row above

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await SupabaseAuthClient.auth.signUp({
      email, 
      password,
    });

    if (error) {
      setMessage("Error: " + error.message);
      return;
    }

    // if signup works, insert username into your "profiles" (or "users") table
    const { error: insertError } = await supabase
      .from("profiles") //table name
      .insert([{id: data.user?.id, email, username}]);

    if(insertError) {
      setMessage("Signup succeeded, but error saving username: "+ insertError.message);
    } else {
        setMessage("Account created! Please check your email to confirm.");
    };
  };
}

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
          {isSignUp ? "Create Account" : "Login"}
        </h1>

        <form
          onSubmit={isSignUp ? handleSignUp : handleLogin}
          className="flex flex-col gap-4"
        >
          <input
            type="email"
            placeholder="Email"

          export default function LoginPage() {
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          {isSignUp && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          )}
          <button
            type="submit"
            className="rounded-lg bg-blue-600 py-2 text-white font-semibold hover:bg-blue-700 transition-colors"
          >
<<<<<<< Updated upstream
            Log In
=======
>>>>>>> Stashed changes
            {isSignUp ? "Sign Up" : "Log In"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          {isSignUp ? "Already have an account?" : "Don’t have an account?"}{" "}
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setMessage("");
            }}
            className="text-blue-600 hover:underline"
          >
            {isSignUp ? "Log In" : "Sign Up"}
          </button>
        </p>

        {message && (
          <p className="mt-4 text-center text-sm text-red-600">{message}</p>
        )}
      </div>
    </div>
  );
<<<<<<< Updated upstream
}
=======
>>>>>>> Stashed changes
}