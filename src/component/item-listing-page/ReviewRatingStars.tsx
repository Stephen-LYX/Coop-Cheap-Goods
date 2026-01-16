/*
Title: Report Button component
Author: Miles Paleveda
Date: 11/13/2025

Credits: This file includes the following third party and open source softwares:
  -Next.js: license in /credits/nextjs/LICENSE
  -React: license in /credits/react/LICENSE
  -Supabase: license in /credits/supabase/LICENSE
  -Tailwind CSS: license in /credits/tailwindcss/LICENSE
  -Flowbite: license in /credits/flowbite/LICENSE
  -Flowbite Icons: license in /credits/flowbite-icons/LICENSE
  -Flowbite docs code: attribution in /credits/flowbite docs code/attribution.txt
*/

"use client";

import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

export function ReviewRatingStars({ rating }) {
  //build array for rating stars
  function buildRatingArray(rating) {
    const arr = Array(5);
    for (let i = 0; i < arr.length; i++) {
      let value;
      if (rating >= 1) {
        value = 1;
      } else {
        value = 0;
      }
      arr[i] = { value: value };
      rating--;
    }
    return arr;
  }

  const ratingArray = buildRatingArray(rating);

  return (
    <div className="flex">
      {ratingArray.map((star, index) => {
        return (
          <svg
            key={index}
            className={
              star.value
                ? "w-6 h-6 text-yellow-300"
                : "w-6 h-6 text-gray-300 dark:text-gray-500"
            }
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
          </svg>
        );
      })}
    </div>
  );
}
