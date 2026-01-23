"use client";

import { useState, useEffect } from "react";
import MarketplaceGrid from "@/components/MarketplaceGrid";
import BeautyHealthFilters, {
  BeautyHealthFilterState,
} from "@/components/filters/BeautyHealthFilters";
import { createClient } from "@/utils/supabase/client";
import { BreadCrumbs } from "@/components/BreadCrumbs";

export default function BeautyHealthPage() {
  const [filters, setFilters] = useState<BeautyHealthFilterState>({
    priceRange: { min: 0, max: 1000 },
    conditions: [],
  });

  const [availableFilters, setAvailableFilters] = useState({
    conditions: [] as string[],
  });

  const supabase = createClient();

  useEffect(() => {
    const fetchFilterOptions = async () => {
      const { data, error } = await supabase
        .from("beauty_and_health_items")
        .select("condition");

      if (error) {
        console.error("Error fetching filter options:", error);
        return;
      }

      if (data) {
        const brands = [
          ...new Set(data.map((item) => item.brand).filter(Boolean)),
        ] as string[];
        const conditions = [
          ...new Set(data.map((item) => item.condition).filter(Boolean)),
        ] as string[];

        setAvailableFilters({
          conditions: conditions.sort(),
        });
      }
    };

    fetchFilterOptions();
  }, []);

  const handleFilterChange = (newFilters: BeautyHealthFilterState) => {
    setFilters(newFilters);
  };

  return (
    <main>
      <div className="flex">
        <BeautyHealthFilters
          onFilterChange={handleFilterChange}
          availableFilters={availableFilters}
        />
        <div className="flex-1">
          <div className="px-4 py-6">
            <BreadCrumbs />
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Beauty & Health
            </h1>
            <MarketplaceGrid
              category="Beauty and Health"
              beautyHealthFilters={filters}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
