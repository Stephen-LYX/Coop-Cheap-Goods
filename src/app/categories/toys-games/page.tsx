"use client";

import { useState, useEffect } from "react";
import CategoryBar from "@/component/CategoryBar";
import Breadcrumb from "@/component/Breadcrumb";
import MarketplaceGrid from "../../../component/MarketplaceGrid";
import Navbar from "@/component/Navbar";
import ToysFilters, {
  ToysFilterState,
} from "@/component/ToysFilters";
import { createClient } from "@/utils/supabase/client";

export default function ToysGamesPage() {
  const [filters, setFilters] = useState<ToysFilterState>({
    brands: [],
    priceRange: { min: 0, max: 1000 },
    conditions: [],
  });

  const [availableFilters, setAvailableFilters] = useState({
    brands: [] as string[],
    conditions: [] as string[],
  });

  const supabase = createClient();

  useEffect(() => {
    const fetchFilterOptions = async () => {
      const { data, error } = await supabase
        .from("items")
        .select("brand, condition")
        .eq("category", "Toys & Games");

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
          brands: brands.sort(),
          conditions: conditions.sort(),
        });
      }
    };

    fetchFilterOptions();
  }, []);

  const handleFilterChange = (newFilters: ToysFilterState) => {
    setFilters(newFilters);
  };

  return (
    <main>
      <Navbar />
      <CategoryBar />
      <div className="flex">
        <ToysFilters
          onFilterChange={handleFilterChange}
          availableFilters={availableFilters}
        />
        <div className="flex-1">
          <div className="px-4 py-6">
            <Breadcrumb items={[{ label: "Toys & Games" }]} />
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Toys & Games</h1>
            <MarketplaceGrid category="Toys & Games" toysFilters={filters} />
          </div>
        </div>
      </div>
    </main>
  );
}
