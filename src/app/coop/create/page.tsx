"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Upload, X } from "lucide-react";
import Image from "next/image";


export default function CreateCoopPage() {
  const { user, supabase } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    if (!user) {
      setMessage("You must be logged in to create a coop.");
      setIsSubmitting(false);
      return;
    }

    try {
      let imageUrl = null;

      // Upload image if provided
      if (image) {
        const formData = new FormData();
        formData.append("image", image);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) {
          setMessage("Image upload failed: " + uploadData.error);
          setIsSubmitting(false);
          return;
        }
        imageUrl = uploadData.filename;
      }

      // Create the coop
      const { data: coopData, error: coopError } = await supabase
        .from("coops")
        .insert([
          {
            name,
            description,
            category,
            image_url: imageUrl,
            creator_id: user.id,
            is_active: true,
          },
        ])
        .select()
        .single();

      if (coopError) {
        setMessage("Error creating coop: " + coopError.message);
        setIsSubmitting(false);
        return;
      }

      // Add creator as owner in coop_members
      const { error: memberError } = await supabase
        .from("coop_members")
        .insert([
          {
            coop_id: coopData.id,
            user_id: user.id,
            role: "owner",
          },
        ]);

      if (memberError) {
        setMessage("Error adding you as owner: " + memberError.message);
        setIsSubmitting(false);
        return;
      }

      setMessage("Coop created successfully!");

      // Redirect to the coop page after a short delay
      setTimeout(() => {
        router.push(`/coop/${coopData.id}`);
      }, 1500);
    } catch (err) {
      console.error("Error creating coop:", err);
      setMessage("An unexpected error occurred.");
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back
          </button>
        </div>

        <h1 className="text-black text-3xl font-bold mb-2">Create a Coop</h1>
        <p className="text-gray-600 mb-8">
          Start a community marketplace for your group
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Coop Image */}
          <div>
            <label className="text-black block text-xl font-bold mb-3">
              Coop Image <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <div className="flex gap-3 items-center">
              {imagePreview ? (
                <div className="relative w-48 h-48 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={imagePreview}
                    alt="Coop preview"
                    width={192}
                    height={192}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors">
                  <Upload size={32} className="text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500 font-medium">
                    Add image
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Coop Name */}
          <div>
            <label className="text-black block text-xl font-bold mb-2">
              Coop Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Campus Clothing Exchange"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-gray-600 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              maxLength={100}
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-black block text-xl font-bold mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Describe what this coop is about and who can join..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-gray-600 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={5}
              required
            />
          </div>

          {/* Group Type */}
          <div>
            <label className="text-black block text-lg font-bold mb-2">
              Group Type <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. College Students, Book Club, Gaming Community"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="text-gray-600 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              maxLength={100}
            />
            <p className="text-sm text-gray-500 mt-2">
              A short description of what type of group this is. This helps people understand who the coop is for.
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">
              What happens next?
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• You'll be the coop owner with full moderation rights</li>
              <li>• You can invite members and assign moderators</li>
              <li>• Members can list and buy items within the coop</li>
              <li>• Only coop members can see and interact with coop items</li>
            </ul>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white font-semibold py-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating Coop..." : "Create Coop"}
          </button>

          {message && (
            <div
              className={`text-center text-sm font-medium ${
                message.includes("Error") || message.includes("failed")
                  ? "text-red-600"
                  : "text-green-600"
              }`}
            >
              {message}
            </div>
          )}
        </form>
      </div>
    </main>
  );
}
