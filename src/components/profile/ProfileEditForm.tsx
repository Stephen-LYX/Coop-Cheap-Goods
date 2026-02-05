"use client";

import { Save, X, MapPin } from "lucide-react";
import SocialLinksEditor from "./SocialLinksEditor";

interface ProfileEditData {
  username: string;
  bio: string;
  location: string;
  socialLinks: Record<string, string>;
}

interface ProfileEditFormProps {
  data: ProfileEditData;
  onChange: (field: keyof ProfileEditData, value: string | Record<string, string>) => void;
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
  error: string | null;
}

export default function ProfileEditForm({
  data,
  onChange,
  onSave,
  onCancel,
  isSaving,
  error,
}: ProfileEditFormProps) {
  return (
    <div className="space-y-4">
      {/* Username */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Display Name
        </label>
        <input
          type="text"
          value={data.username}
          onChange={(e) => onChange("username", e.target.value)}
          className="block w-full max-w-sm px-3 py-2 text-lg font-semibold text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          placeholder="Your display name"
        />
      </div>

      {/* Bio */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Bio
        </label>
        <textarea
          value={data.bio}
          onChange={(e) => {
            if (e.target.value.length <= 500) {
              onChange("bio", e.target.value);
            }
          }}
          rows={3}
          className="block w-full max-w-lg px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
          placeholder="Tell others about yourself..."
        />
        <p className="mt-1 text-xs text-gray-400 text-right max-w-lg">
          {data.bio.length}/500
        </p>
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location
        </label>
        <div className="relative max-w-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin className="w-4 h-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={data.location}
            onChange={(e) => onChange("location", e.target.value)}
            className="block w-full pl-10 pr-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="City, State"
          />
        </div>
      </div>

      {/* Social Links */}
      <div className="max-w-sm">
        <SocialLinksEditor
          socialLinks={data.socialLinks}
          onChange={(links) => onChange("socialLinks", links)}
        />
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-600 font-medium">{error}</p>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
        <button
          onClick={onCancel}
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
      </div>
    </div>
  );
}
