"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { contactSeller } from "@/utils/supabase/messageUtils";
import { useItemContext } from "../contexts/ItemContext";

// Heart icon for favorites
const HeartIcon = ({ filled = false }) => (
  <svg
    className="w-5 h-5"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />
  </svg>
);

interface Seller {
  username: string;
  full_name?: string;
  avatar_url?: string;
}

export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url?: string;
  seller_id: string;
  seller: Seller;
  created_at: string;
}

interface MarketplaceItemProps {
  item: MarketplaceItem;
}
export type { MarketplaceItem as Item };
export default function ItemCard({ item }: MarketplaceItemProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [isContacting, setIsContacting] = useState(false);

  // favorites from your old ItemCard
  const { isFavorite, addToFavorites, removeFromFavorites } = useItemContext();
  const favorite = isFavorite(item.id);

  const onFavoriteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (favorite) {
      removeFromFavorites(item.id);
    } else {
      addToFavorites(item);
    }
  };

  // new "contact seller" logic
  const handleContactSeller = async () => {
    if (!user) {
      router.push("/Login");
      return;
    }

    if (user.id === item.seller_id) {
      alert("You cannot contact yourself!");
      return;
    }

    setIsContacting(true);
    try {
      const result = await contactSeller(
        user.id,
        item.seller_id,
        item.id,
        item.title
      );

      if (result.success) {
        router.push("/inbox");
      } else {
        alert("Failed to start conversation. Please try again.");
      }
    } catch (error) {
      console.error("Error contacting seller:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsContacting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 group">
      <Link href={`/item/${item.id}`} className="block">
        {/* Item Image */}
        <div className="relative aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
          <Image
            src={item.image_url || "/placeholder.jpg"}
            alt={item.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
          <button
            onClick={onFavoriteClick}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
              favorite
                ? "bg-red-500 text-white"
                : "bg-white/80 text-gray-600 hover:bg-white hover:text-red-500"
            }`}
          >
            <HeartIcon filled={favorite} />
          </button>
        </div>

        {/* Item Details */}
        <div className="p-4">
          {/* Title */}
          <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {item.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-gray-500 mb-2 line-clamp-2">
            {item.description}
          </p>

          {/* Price */}
          <span className="text-lg font-bold text-gray-900 block mb-3">
            ${item.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>

          {/* Seller Info */}
          <div className="flex items-center mb-4">
            <img
              src={item.seller.avatar_url || "/default-avatar.png"}
              alt={item.seller.username}
              className="w-8 h-8 rounded-full object-cover mr-2"
            />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {item.seller.username}
              </p>
              <p className="text-xs text-gray-500">
                Posted {new Date(item.  created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={() => router.push(`/item/${item.id}`)}
              className="w-full bg-gray-100 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
            >
              View Details
            </button>

            {user && user.id !== item.seller_id && (
              <button
                onClick={handleContactSeller}
                disabled={isContacting}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isContacting ? "Starting Chat..." : "Contact Seller"}
              </button>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
