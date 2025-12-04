"use client";

import { useState, useEffect } from "react";
import CategoryBar from "@/component/CategoryBar";
import Breadcrumb from "@/component/Breadcrumb";
import MarketplaceGrid from "../../../component/MarketplaceGrid";
import Navbar from "@/component/Navbar";
import ElectronicsFilters, {
  ElectronicsFilterState,
} from "@/component/ElectronicsFilters";
import { createClient } from "@/utils/supabase/client";

export default function ElectronicsPage() {
  const [filters, setFilters] = useState<ElectronicsFilterState>({
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
        .eq("category", "Electronics");

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

  const handleFilterChange = (newFilters: ElectronicsFilterState) => {
    setFilters(newFilters);
  };

  return (
    <main>
      <Navbar />
      <CategoryBar />
      <div className="flex">
        <ElectronicsFilters
          onFilterChange={handleFilterChange}
          availableFilters={availableFilters}
        />
        <div className="flex-1">
          <div className="px-4 py-6">
            <Breadcrumb items={[{ label: "Electronics" }]} />
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Electronics</h1>
            <MarketplaceGrid category="Electronics" electronicsFilters={filters} />
          </div>
        </div>
      </div>
    </main>
  );
}
