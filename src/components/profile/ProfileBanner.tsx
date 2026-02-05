"use client";

import { Camera } from "lucide-react";

interface ProfileBannerProps {
  bannerUrl: string | null;
  isEditing: boolean;
  onUploadClick: () => void;
}

export default function ProfileBanner({
  bannerUrl,
  isEditing,
  onUploadClick,
}: ProfileBannerProps) {
  return (
    <div className="relative h-200 sm:h-100 bg-gradient-to-r from-emerald-600 to-teal-500">
      {bannerUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={bannerUrl}
          alt="Profile banner"
          className="w-full h-full object-cover"
        />
      )}

      {isEditing && (
        <button
          type="button"
          onClick={onUploadClick}
          className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer hover:bg-black/40 transition-colors"
        >
          <div className="text-white text-center">
            <Camera className="w-8 h-8 mx-auto mb-1" />
            <span className="text-sm font-medium">
              {bannerUrl ? "Change Banner" : "Add Banner"}
            </span>
          </div>
        </button>
      )}
    </div>
  );
}
