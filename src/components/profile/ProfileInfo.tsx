"use client";

import { Calendar, MapPin, Mail, Pencil } from "lucide-react";
import SocialLinksDisplay from "./SocialLinksDisplay";

interface ProfileInfoProps {
  username: string;
  email: string;
  joinDate: string;
  bio: string | null;
  location: string | null;
  socialLinks: Record<string, string>;
  onEditClick: () => void;
  itemCount: number;
}

export default function ProfileInfo({
  username,
  email,
  joinDate,
  bio,
  location,
  socialLinks,
  onEditClick,
  itemCount,
}: ProfileInfoProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold text-gray-900 truncate">
          {username}
        </h1>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            Member since {joinDate}
          </span>
          {location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {location}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5" />
            {email}
          </span>
        </div>

        {bio && (
          <p className="mt-3 text-sm text-gray-700 max-w-xl leading-relaxed">
            {bio}
          </p>
        )}

        <div className="mt-3 flex items-center gap-3">
          <SocialLinksDisplay socialLinks={socialLinks} />
          <span className="text-xs text-gray-400">
            {itemCount} {itemCount === 1 ? "item" : "items"} listed
          </span>
        </div>
      </div>

      <button
        onClick={onEditClick}
        className="shrink-0 flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Pencil className="w-3.5 h-3.5" />
        Edit Profile
      </button>
    </div>
  );
}
