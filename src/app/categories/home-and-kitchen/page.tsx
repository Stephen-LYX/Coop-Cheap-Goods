"use client";

import { useState, useEffect } from "react";
import CategoryBar from "@/component/CategoryBar";
import MarketplaceGrid from "../../../component/MarketplaceGrid";
import Navbar from "@/component/Navbar";
import HomeKitchenFilters, {
  HomeKitchenFilterState,
} from "@/component/HomeKitchenFilters";
import { createClient } from "@/utils/supabase/client";

export default function HomeKitchenPage() {
  const [filters, setFilters] = useState<HomeKitchenFilterState>({
    brands: [],
    priceRange: { min: 0, max: 1000 },
    colors: [],
    conditions: [],
  });

  const [availableFilters, setAvailableFilters] = useState({
    brands: [] as string[],
    colors: [] as string[],
    conditions: [] as string[],
  });

  const supabase = createClient();

  useEffect(() => {
    const fetchFilterOptions = async () => {
      const { data, error } = await supabase
        .from("items")
        .select("brand, color, condition")
        .eq("category", "Home & Kitchen");

      if (error) {
        console.error("Error fetching filter options:", error);
        return;
      }

      if (data) {
        const brands = [
          ...new Set(data.map((item) => item.brand).filter(Boolean)),
        ] as string[];
        const colors = [
          ...new Set(data.map((item) => item.color).filter(Boolean)),
        ] as string[];
        const conditions = [
          ...new Set(data.map((item) => item.condition).filter(Boolean)),
        ] as string[];

        setAvailableFilters({
          brands: brands.sort(),
          colors: colors.sort(),
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
      <Navbar />
      <div className="flex">
        <HomeKitchenFilters
          onFilterChange={handleFilterChange}
          availableFilters={availableFilters}
        />
        <div className="flex-1">
          <div className="px-4 py-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Home & Kitchen</h1>
            <MarketplaceGrid category="Home & Kitchen" homeKitchenFilters={filters} />
          </div>
        </div>
      </div>
    </main>
  );
}
