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
import Image from "next/image";
import Link from "next/link";
import { Item } from "../ItemCard";

export function ItemPicturesDisplay({ item }: { item: Item }) {
  return (
    <div>
      <div className="aspect-square overflow-hidden">
        <Image
          src={`/uploaded/${item.image}`}
          alt={item.name}
          width={800}
          height={800}
          objectFit="cover"
          className="bg-gray-300"
        ></Image>
      </div>

      <p className="text-sm my-2 text-center">1 of 5</p>

      <div className="grid grid-cols-5 gap-4 mb-4">
        <div className="aspect-square overflow-hidden">
          <Image
            src={`/uploaded/${item.image}`}
            alt={item.name}
            width={180}
            height={180}
            className="bg-gray-300"
          ></Image>
        </div>
        <div className="aspect-square overflow-hidden">
          <Image
            src={`/uploaded/${item.image}`}
            alt={item.name}
            width={180}
            height={180}
            className="bg-gray-300"
          ></Image>
        </div>
        <div className="aspect-square overflow-hidden">
          <Image
            src={`/uploaded/${item.image}`}
            alt={item.name}
            width={180}
            height={180}
            className="bg-gray-300"
          ></Image>
        </div>
        <div className="aspect-square overflow-hidden">
          <Image
            src={`/uploaded/${item.image}`}
            alt={item.name}
            width={180}
            height={180}
            className="bg-gray-300"
          ></Image>
        </div>
        <div className="aspect-square overflow-hidden">
          <Image
            src={`/uploaded/${item.image}`}
            alt={item.name}
            width={180}
            height={180}
            className="bg-gray-300"
          ></Image>
        </div>
      </div>
    </div>
  );
}
