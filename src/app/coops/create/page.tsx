"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/component/Navbar";
import { useAuth } from "@/contexts/AuthContext";

export default function CreateCoopPage() {
  const { user, supabase } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setMessage("You must be logged in.");
      return;
    }

    const { data, error } = await supabase
      .from("coops")
      .insert([{ name, description, created_by: user.id }])
      .select()
      .single();

    if (error) {
      setMessage(error.message);
      return;
    }

    // Add creator as first member
    await supabase.from("coop_members").insert([
      { coop_id: data.id, user_id: user.id }
    ]);

    router.push(`/coops/${data.id}`);
  };

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-2xl shadow">
        <h1 className="text-3xl font-bold mb-6">Create a Coop</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Coop Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border px-4 py-2 rounded-lg"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full border px-4 py-2 rounded-lg"
            />
          </div>

          <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold">
            Create Coop
          </button>

          {message && <p className="text-center text-red-500">{message}</p>}
        </form>
      </div>
    </main>
  );
}
