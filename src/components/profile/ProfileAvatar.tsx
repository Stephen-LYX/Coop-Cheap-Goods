"use client";

import { Camera } from "lucide-react";

interface ProfileAvatarProps {
  avatarUrl: string | null;
  username: string;
  isEditing: boolean;
  onUploadClick: () => void;
}

function getInitials(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

export default function ProfileAvatar({
  avatarUrl,
  username,
  isEditing,
  onUploadClick,
}: ProfileAvatarProps) {
  return (
    <div className="-mt-16 z-10">
      <div className="relative w-[130px] h-[130px]">
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt="Profile picture"
            className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-3xl font-bold text-white border-4 border-white shadow-lg">
            {getInitials(username || "U")}
          </div>
        )}

        {isEditing && (
          <button
            type="button"
            onClick={onUploadClick}
            className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30 cursor-pointer hover:bg-black/40 transition-colors"
          >
            <Camera className="w-7 h-7 text-white" />
          </button>
        )}
      </div>
    </div>
  );
}
