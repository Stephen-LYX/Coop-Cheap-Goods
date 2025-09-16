"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Navbar from "@/component/Navbar";
import Sidebar from "@/component/Sidebar";

export default function SellPage() {
  const supabase = createClientComponentClient();

  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [message, setMessage] = useState("");

  // Handle image selection (stored in state, saved to /public/uploads later)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Insert product into Supabase (without image storage)
    const { error } = await supabase.from("products").insert([
      {
        name: productName,
        description,
        price: parseFloat(price),
        images: images.map((img) => img.name), // store filenames only
      },
    ]);

    if (error) {
      setMessage("Error: " + error.message);
    } else {
      setMessage("Item listed successfully!");
      setProductName("");
      setDescription("");
      setPrice("");
      setImages([]);
    }
  };

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
              placeholder="Product Name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
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

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="text-sm text-gray-600"
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

          {images.length > 0 && (
            <div className="mt-6">
              <h2 className="font-semibold text-lg mb-2">Preview:</h2>
              <div className="flex gap-4 flex-wrap">
                {images.map((img, index) => (
                  <p
                    key={index}
                    className="text-sm text-gray-700 border p-2 rounded-lg"
                  >
                    {img.name}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
