"use client";

export type ProfileTab = "shop" | "reviews" | "about";

interface ProfileTabsProps {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
  itemCount: number;
  reviewCount: number;
}

const TABS: { key: ProfileTab; label: string; countKey?: "itemCount" | "reviewCount" }[] = [
  { key: "shop", label: "Shop Items", countKey: "itemCount" },
  { key: "reviews", label: "Reviews", countKey: "reviewCount" },
  { key: "about", label: "About" },
];

export default function ProfileTabs({
  activeTab,
  onTabChange,
  itemCount,
  reviewCount,
}: ProfileTabsProps) {
  const counts = { itemCount, reviewCount };

  return (
    <div className="mt-6 border-b border-gray-200 overflow-x-auto">
      <nav className="flex gap-8 min-w-max" role="tablist">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          const count = tab.countKey ? counts[tab.countKey] : undefined;

          return (
            <button
              key={tab.key}
              role="tab"
              aria-selected={isActive}
              onClick={() => onTabChange(tab.key)}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                isActive
                  ? "text-gray-900 border-gray-900"
                  : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
              {count !== undefined && (
                <span
                  className={`ml-1.5 text-xs ${
                    isActive ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  ({count})
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
