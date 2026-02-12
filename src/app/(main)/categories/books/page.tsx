"use client";

import { useState, useEffect } from "react";
import MarketplaceGrid from "@/components/MarketplaceGrid";
import BooksFilters, {
  BooksFilterState,
} from "@/components/filters/BooksFilters";
import { createClient } from "@/utils/supabase/client";
import { BreadCrumbs } from "@/components/BreadCrumbs";

export default function BooksPage() {
  const [filters, setFilters] = useState<BooksFilterState>({
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
        .from("items_books")
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

  const handleFilterChange = (newFilters: BooksFilterState) => {
    setFilters(newFilters);
  };

  return (
    <main>
      <div className="flex">
        <BooksFilters
          onFilterChange={handleFilterChange}
          availableFilters={availableFilters}
        />
        <div className="flex-1">
          <div className="px-4 py-6">
            <BreadCrumbs />
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Books</h1>
            <MarketplaceGrid category="Books" booksFilters={filters} />
          </div>
        </div>
      </div>
    </main>
  );
}
