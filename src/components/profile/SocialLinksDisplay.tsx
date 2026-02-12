"use client";

import { Instagram, Twitter, Globe, Facebook } from "lucide-react";

interface SocialLinksDisplayProps {
  socialLinks: Record<string, string>;
}

const PLATFORMS: {
  key: string;
  icon: React.ElementType;
  baseUrl?: string;
  label: string;
}[] = [
  { key: "website", icon: Globe, label: "Website" },
  {
    key: "instagram",
    icon: Instagram,
    baseUrl: "https://instagram.com/",
    label: "Instagram",
  },
  {
    key: "twitter",
    icon: Twitter,
    baseUrl: "https://twitter.com/",
    label: "Twitter",
  },
  {
    key: "facebook",
    icon: Facebook,
    baseUrl: "https://facebook.com/",
    label: "Facebook",
  },
];

function buildUrl(value: string, baseUrl?: string): string {
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }
  return baseUrl ? `${baseUrl}${value}` : `https://${value}`;
}

export default function SocialLinksDisplay({
  socialLinks,
}: SocialLinksDisplayProps) {
  const activeLinks = PLATFORMS.filter(
    (p) => socialLinks[p.key] && socialLinks[p.key].trim() !== ""
  );

  if (activeLinks.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      {activeLinks.map((platform) => {
        const Icon = platform.icon;
        return (
          <a
            key={platform.key}
            href={buildUrl(socialLinks[platform.key], platform.baseUrl)}
            target="_blank"
            rel="noopener noreferrer"
            title={platform.label}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
          >
            <Icon className="w-4 h-4" />
          </a>
        );
      })}
    </div>
  );
}
