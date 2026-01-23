"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export interface OtherFilterState {
  priceRange: { min: number; max: number } | null;
  conditions: string[];
}

interface OtherFiltersProps {
  onFilterChange: (filters: OtherFilterState) => void;
  availableFilters: {
    conditions: string[];
  };
}

const OtherFilters = ({
  onFilterChange,
  availableFilters,
}: OtherFiltersProps) => {
  const [pendingFilters, setPendingFilters] = useState<OtherFilterState>({
    priceRange: { min: 0, max: 1000 },
    conditions: [],
  });

  const [expandedSections, setExpandedSections] = useState({
    price: true,
    condition: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleFilter = (
    category: keyof Omit<OtherFilterState, "priceRange">,
    value: string,
  ) => {
    setPendingFilters((prev) => {
      const currentValues = prev[category] as string[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      return { ...prev, [category]: newValues };
    });
  };

  const handlePriceChange = (type: "min" | "max", value: number) => {
    setPendingFilters((prev) => ({
      ...prev,
      priceRange: {
        ...prev.priceRange!,
        [type]: value,
      },
    }));
  };

  const clearAllFilters = () => {
    setPendingFilters({
      priceRange: { min: 0, max: 1000 },
      conditions: [],
    });
    onFilterChange({
      priceRange: { min: 0, max: 1000 },
      conditions: [],
    });
  };

  const applyFilters = () => {
    onFilterChange(pendingFilters);
  };

  const FilterSection = ({
    title,
    section,
    children,
  }: {
    title: string;
    section: keyof typeof expandedSections;
    children: React.ReactNode;
  }) => (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={() => toggleSection(section)}
        className="flex items-center justify-between w-full text-left"
      >
        <span className="font-medium text-gray-900">{title}</span>
        {expandedSections[section] ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>
      {expandedSections[section] && (
        <div className="mt-3 space-y-2">{children}</div>
      )}
    </div>
  );

  const hasActiveFilters =
    pendingFilters.conditions.length > 0 ||
    (pendingFilters.priceRange &&
      (pendingFilters.priceRange.min !== 0 ||
        pendingFilters.priceRange.max !== 1000));

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Price Filter */}
        <FilterSection title="Price" section="price">
          <div className="space-y-3">
            <div className="flex items-center gap-2 mt-2">
              <input
                type="number"
                value={pendingFilters.priceRange?.min ?? 0}
                onChange={(e) =>
                  handlePriceChange("min", parseInt(e.target.value) || 0)
                }
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                placeholder="Min"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                value={pendingFilters.priceRange?.max ?? 1000}
                onChange={(e) =>
                  handlePriceChange("max", parseInt(e.target.value) || 1000)
                }
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                placeholder="Max"
              />
            </div>
          </div>
        </FilterSection>

        {/* Condition Filter */}
        <FilterSection title="Condition" section="condition">
          {availableFilters.conditions.map((condition) => (
            <label
              key={condition}
              className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded"
            >
              <input
                type="checkbox"
                checked={pendingFilters.conditions.includes(condition)}
                onChange={() => toggleFilter("conditions", condition)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{condition}</span>
            </label>
          ))}
        </FilterSection>

        {/* Apply Button */}
        <button
          onClick={applyFilters}
          className="w-full mt-4 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default OtherFilters;
