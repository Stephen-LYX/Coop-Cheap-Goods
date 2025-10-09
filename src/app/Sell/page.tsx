"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import Navbar from "@/component/Navbar";
import Sidebar from "@/component/Sidebar";
import { useAuth } from "@/contexts/AuthContext";

export default function SellPage() {
  const { user, loading } = useAuth();
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(""); 
  const [image, setImage] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const categories = ["Electronics", "Clothing", "Books", "Home", "Other"]; // dropdown options

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image) {
      setMessage("Please select an image.");
      return;
    }

    // Upload image to /public/uploaded
    const formData = new FormData();
    formData.append("image", image);

    const uploadRes = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const uploadData = await uploadRes.json();

    if (!uploadRes.ok) {
      setMessage("Image upload failed: " + uploadData.error);
      return;
    }

    const imageUrl = uploadData.filename;

    // Get logged-in user UID from Supabase Auth
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("You must be logged in to list an item.");
      return;
    }

    // Insert item into Supabase directly linked to Auth UID
    const { error } = await supabase.from("items").insert([
      {
        user_id: user.id, // <-- directly from Supabase Auth
        title,
        description,
        price: parseFloat(price),
        category,
        image_url: imageUrl,
        is_active: true,
      },
    ]);

    if (error) {
      setMessage("Error: " + error.message);
    } else {
      setMessage("Item listed successfully!");
      setTitle("");
      setDescription("");
      setPrice("");
      setCategory("");
      setImage(null);
    }
  };

  useEffect(() => {
      const checkUser = async () => {
        const { data } = await supabase.auth.getSession();
        console.log("🟢 Supabase session user:", data.session?.user?.id);
        console.log("🟣 AuthContext user:", user?.id);
      };
      checkUser();
    }, [supabase, user]);

  return (
    <main>
      <Navbar />
      <div className="flex">
        <Sidebar />

        <div className="flex-1 p-8">
          <h1 className="font-bold text-blue-500 text-2xl mb-6">
            List an Item
          </h1>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 max-w-lg bg-white shadow-lg p-6 rounded-2xl"
          >
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            />

            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              rows={4}
              required
            />

            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            >
              <option value="" disabled>
                Select Category
              </option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="text-sm text-gray-600"
              required
            />

            <button
              type="submit"
              className="rounded-lg bg-blue-600 py-2 text-white font-semibold hover:bg-blue-700 transition-colors"
            >
              List Item
            </button>
          </form>

          {message && (
            <p className="mt-4 text-center text-sm text-green-600">{message}</p>
          )}
        </div>
      </div>
    </main>
  );
}
