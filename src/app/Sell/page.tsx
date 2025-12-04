"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/component/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { Upload, X } from "lucide-react";

export default function SellPage() {
  const { user, supabase, loading } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clothing-specific fields
  const [brand, setBrand] = useState("");
  const [size, setSize] = useState("");
  const [condition, setCondition] = useState("");
  const [color, setColor] = useState("");

  const categories = [
    "Clothing",
    "Electronics",
    "Sports & Outdoor",
    "Home & Kitchen",
    "Books",
    "Beauty & Health",
    "Toys & Games",
    "Other",
  ];

  // Depop-style dropdown options
  const clothingBrands = [
    "Nike",
    "Adidas",
    "Zara",
    "H&M",
    "Levi’s",
    "Urban Outfitters",
    "Vintage",
    "Brandy Melville",
    "Champion",
    "Patagonia",
    "Other",
  ];

  const clothingSizes = [
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "XXL",
    "One Size",
    "Custom",
  ];

  const clothingConditions = [
    "Brand new",
    "Like new",
    "Used - Excellent",
    "Used - Good",
    "Used - Fair",
  ];

  const clothingColors = [
    "Black",
    "White",
    "Gray",
    "Blue",
    "Red",
    "Green",
    "Yellow",
    "Brown",
    "Purple",
    "Pink",
    "Orange",
    "Beige",
    "Multi-color",
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newImages = [...images, ...filesArray].slice(0, 5);
      setImages(newImages);
      const newPreviews = newImages.map((file) => URL.createObjectURL(file));
      setImagePreviews(newPreviews);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (images.length === 0) {
      setMessage("Please select at least one image.");
      setIsSubmitting(false);
      return;
    }

    if (category === "Clothing") {
      if (!brand || !size || !condition || !color) {
        setMessage("Please fill in all clothing details.");
        setIsSubmitting(false);
        return;
      }
    }

    // Upload images
    const uploadedUrls: string[] = [];
    for (const image of images) {
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
      uploadedUrls.push(uploadData.filename);
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("You must be logged in to list an item.");
      setIsSubmitting(false);
      return;
    }

    const { error } = await supabase.from("items").insert([
      {
        user_id: user.id,
        title,
        description,
        price: parseFloat(price),
        category,
        image_url: uploadedUrls[0],
        images: uploadedUrls,
        is_active: true,
        ...(category === "Clothing" && {
          brand,
          size,
          condition,
          color,
        }),
      },
    ]);

    if (error) {
      setMessage("Error: " + error.message);
      setIsSubmitting(false);
    } else {
      setMessage("Item listed successfully!");
      setTitle("");
      setDescription("");
      setPrice("");
      setCategory("");
      setImages([]);
      setImagePreviews([]);
      setBrand("");
      setSize("");
      setCondition("");
      setColor("");
      setIsSubmitting(false);
      router.push("/home");
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
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-black text-3xl font-bold mb-2">List an item</h1>
        <p className="text-gray-600 mb-8">Fill in the details below</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className="text-black block text-xl font-bold mb-3">
              Photos <span className="text-gray-400 font-normal">({images.length}/5)</span>
            </label>
            <div className="flex gap-3 flex-wrap">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative w-32 h-32 rounded-lg overflow-hidden bg-gray-100">
                  <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                  >
                    <X size={16} />
                  </button>
                  {index === 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs py-1 text-center">
                      Main photo
                    </div>
                  )}
                </div>
              ))}

              {images.length < 5 && (
                <label className="w-36 h-36 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors">
                  <Upload size={28} className="text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500 font-medium">Add photo</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" multiple />
                </label>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-black block text-xl font-bold mb-2">Title</label>
            <input
              type="text"
              placeholder="e.g. Blue Nike Hoodie"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-gray-600 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              maxLength={100}
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-black block text-xl font-bold mb-2">Description</label>
            <textarea
              placeholder="Describe your item..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-gray-600 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={6}
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-black block text-lg font-bold mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="text-gray-600 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              required
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Clothing subcategories */}
          {category === "Clothing" && (
            <div className="space-y-4 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Clothing Details</h2>

              <div>
                <label className="text-black block text-md font-bold mb-2">Brand</label>
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="text-gray-600 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="" disabled>
                    Select brand
                  </option>
                  {clothingBrands.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-black block text-md font-bold mb-2">Size</label>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="text-gray-600 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="" disabled>
                    Select size
                  </option>
                  {clothingSizes.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-black block text-md font-bold mb-2">Condition</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="text-gray-600 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="" disabled>
                    Select condition
                  </option>
                  {clothingConditions.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-black block text-md font-bold mb-2">Color</label>
                <select
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="text-gray-600 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="" disabled>
                    Select color
                  </option>
                  {clothingColors.map((clr) => (
                    <option key={clr} value={clr}>
                      {clr}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Price */}
          <div>
            <label className="text-black block text-lg font-bold mb-2">Price</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-medium">$</span>
              <input
                type="number"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="text-gray-600 w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                step="0.01"
                min="0"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white font-semibold py-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Listing..." : "List item"}
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
