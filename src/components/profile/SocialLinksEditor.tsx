"use client";

import { Instagram, Twitter, Globe, Facebook } from "lucide-react";

interface SocialLinksEditorProps {
  socialLinks: Record<string, string>;
  onChange: (links: Record<string, string>) => void;
}

const PLATFORMS = [
  { key: "website", icon: Globe, placeholder: "https://yourwebsite.com" },
  { key: "instagram", icon: Instagram, placeholder: "Instagram username" },
  { key: "twitter", icon: Twitter, placeholder: "Twitter username" },
  { key: "facebook", icon: Facebook, placeholder: "Facebook username" },
];

export default function SocialLinksEditor({
  socialLinks,
  onChange,
}: SocialLinksEditorProps) {
  const handleChange = (key: string, value: string) => {
    onChange({ ...socialLinks, [key]: value });
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Social Links
      </label>
      {PLATFORMS.map((platform) => {
        const Icon = platform.icon;
        return (
          <div key={platform.key} className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={socialLinks[platform.key] || ""}
              onChange={(e) => handleChange(platform.key, e.target.value)}
              placeholder={platform.placeholder}
              className="block w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
            />
          </div>
        );
      })}
    </div>
  );
}
