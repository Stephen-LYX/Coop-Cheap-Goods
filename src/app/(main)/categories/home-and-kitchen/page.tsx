"use client";

import { useState, useEffect } from "react";
import MarketplaceGrid from "@/components/MarketplaceGrid";
import HomeKitchenFilters, {
  HomeKitchenFilterState,
} from "@/components/filters/HomeKitchenFilters";
import { createClient } from "@/utils/supabase/client";
import { BreadCrumbs } from "@/components/BreadCrumbs";

export default function HomeKitchenPage() {
  const [filters, setFilters] = useState<HomeKitchenFilterState>({
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
        .from("home_and_kitchen_items")
        .select("condition");

      if (error) {
        console.error("Error fetching filter options:", error);
        return;
      }

      if (data) {
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

  const handleFilterChange = (newFilters: HomeKitchenFilterState) => {
    setFilters(newFilters);
  };

  return (
    <main>
      <div className="flex">
        <HomeKitchenFilters
          onFilterChange={handleFilterChange}
          availableFilters={availableFilters}
        />
        <div className="flex-1">
          <div className="px-4 py-6">
            <BreadCrumbs />
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Home & Kitchen
            </h1>
            <MarketplaceGrid
              category="Home and Kitchen"
              homeKitchenFilters={filters}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
