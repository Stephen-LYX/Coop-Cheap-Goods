"use client";

import { Star } from "lucide-react";

export default function ProfileReviewsTab() {
  return (
    <div className="text-center py-16">
      <Star className="w-12 h-12 text-gray-300 mx-auto" />
      <h3 className="mt-4 text-lg font-medium text-gray-900">No reviews yet</h3>
      <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
        Reviews from buyers and sellers will appear here once transactions are completed.
      </p>
    </div>
  );
}
