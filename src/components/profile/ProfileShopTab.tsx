"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, Package } from "lucide-react";
import ItemCard from "@/components/ItemCard";
import type { Item } from "@/components/ItemCard";

interface ProfileShopTabProps {
  items: Item[];
  loading: boolean;
}

const CATEGORIES = [
  "All Categories",
  "Electronics",
  "Clothing",
  "Books",
  "Home & Kitchen",
  "Beauty & Health",
  "Sports & Outdoors",
  "Toys & Games",
  "Other",
];

const PRICE_RANGES = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under $25", min: 0, max: 25 },
  { label: "$25 - $50", min: 25, max: 50 },
  { label: "$50 - $100", min: 50, max: 100 },
  { label: "$100 - $200", min: 100, max: 200 },
  { label: "Over $200", min: 200, max: Infinity },
];

export default function ProfileShopTab({
  items,
  loading,
}: ProfileShopTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedPriceRange, setSelectedPriceRange] = useState("All Prices");

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All Categories" ||
      item.category === selectedCategory;

    const range = PRICE_RANGES.find((r) => r.label === selectedPriceRange);
    const matchesPrice =
      !range || (item.price >= range.min && item.price <= range.max);

    return matchesSearch && matchesCategory && matchesPrice;
  });

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedCategory !== "All Categories" ||
    selectedPriceRange !== "All Prices";

  const clearFilters = () => {
    setSearchQuery("");
    setSearchInput("");
    setSelectedCategory("All Categories");
    setSelectedPriceRange("All Prices");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="text-gray-500">Loading items...</div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <Package className="w-12 h-12 text-gray-300 mx-auto" />
        <p className="text-gray-500 mt-4 mb-6">No items posted yet</p>
        <a
          href="/sell"
          className="inline-block px-6 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Post Your First Item
        </a>
      </div>
    );
  }

  return (
    <div>
      {/* Search and Filters */}
      <div className="mb-6 space-y-3">
        <form onSubmit={handleSearchSubmit} className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search items..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="block w-full pl-10 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
          />
        </form>

        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-1.5 text-gray-500">
            <SlidersHorizontal className="w-4 h-4" />
            <span className="text-sm font-medium">Filters:</span>
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white cursor-pointer hover:border-gray-400 transition-colors"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={selectedPriceRange}
            onChange={(e) => setSelectedPriceRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white cursor-pointer hover:border-gray-400 transition-colors"
          >
            {PRICE_RANGES.map((range) => (
              <option key={range.label} value={range.label}>
                {range.label}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-3 py-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          )}

          <span className="text-sm text-gray-400 ml-auto">
            {filteredItems.length} of {items.length}
          </span>
        </div>
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16">
          <SlidersHorizontal className="w-10 h-10 text-gray-300 mx-auto" />
          <p className="text-gray-500 mt-4 mb-4">
            No items match your filters
          </p>
          <button
            onClick={clearFilters}
            className="px-5 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
