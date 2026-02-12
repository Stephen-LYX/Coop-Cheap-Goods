"use client";

import { Calendar, MapPin, Package, User } from "lucide-react";
import SocialLinksDisplay from "./SocialLinksDisplay";

interface ProfileAboutTabProps {
  bio: string | null;
  location: string | null;
  joinDate: string;
  socialLinks: Record<string, string>;
  itemCount: number;
}

export default function ProfileAboutTab({
  bio,
  location,
  joinDate,
  socialLinks,
  itemCount,
}: ProfileAboutTabProps) {
  return (
    <div className="max-w-2xl">
      {/* Bio Section */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
          About
        </h3>
        {bio ? (
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {bio}
          </p>
        ) : (
          <p className="text-gray-400 italic">No bio provided yet.</p>
        )}
      </div>

      {/* Details */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
          Details
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-2.5 text-sm text-gray-600">
            <Calendar className="w-4 h-4 text-gray-400" />
            Member since {joinDate}
          </div>
          {location && (
            <div className="flex items-center gap-2.5 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-gray-400" />
              {location}
            </div>
          )}
          <div className="flex items-center gap-2.5 text-sm text-gray-600">
            <Package className="w-4 h-4 text-gray-400" />
            {itemCount} {itemCount === 1 ? "item" : "items"} listed
          </div>
        </div>
      </div>

      {/* Social Links */}
      {Object.values(socialLinks).some((v) => v && v.trim()) && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
            Find me on
          </h3>
          <SocialLinksDisplay socialLinks={socialLinks} />
        </div>
      )}

      {/* Empty state when nothing is filled */}
      {!bio &&
        !location &&
        !Object.values(socialLinks).some((v) => v && v.trim()) && (
          <div className="text-center py-8">
            <User className="w-10 h-10 text-gray-300 mx-auto" />
            <p className="mt-3 text-sm text-gray-500">
              This profile doesn&apos;t have any additional info yet.
            </p>
          </div>
        )}
    </div>
  );
}
