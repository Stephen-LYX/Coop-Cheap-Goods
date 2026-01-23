/*
Title: BreadCrumbs Component for Product Listing Pages
Author: Miles Paleveda
Date: 1/16/2026

Credits: This file includes the following third party and open source softwares:
  -Next.js: license in /credits/nextjs/LICENSE
  -React: license in /credits/react/LICENSE
  -Tailwind CSS: license in /credits/tailwindcss/LICENSE
  -Flowbite: license in /credits/flowbite/LICENSE
  -Flowbite Icons: license in /credits/flowbite-icons/LICENSE
  -Flowbite docs code: attribution in /credits/flowbite docs code/attribution.txt
*/

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function BreadCrumbs({ title }: { title: string }) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter((segment) => segment);

  return (
    <nav className="flex mb-2" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 rtl:space-x-reverse">
        <li className="inline-flex items-center">
          <Link
            href="/home"
            className="inline-flex items-center text-sm font-medium text-body hover:text-blue-700"
          >
            <svg
              className="w-4 h-4 me-1.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"
              />
            </svg>
            Home
          </Link>
        </li>
        {segments.map((path, index) => {
          const name = path
            .split("-")
            .map((pathPart) => {
              if (pathPart == "and") {
                return pathPart;
              }
              return pathPart.charAt(0).toUpperCase() + pathPart.substring(1);
            })
            .join(" ");
          const link = "/" + segments.slice(0, index + 1).join("/");
          return (
            <li key={index}>
              <div className="flex items-center space-x-1.5">
                <svg
                  className="w-3.5 h-3.5 rtl:rotate-180 text-body"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m9 5 7 7-7 7"
                  />
                </svg>
                <Link
                  href={link}
                  className="inline-flex items-center text-sm font-medium text-body hover:text-blue-700"
                >
                  {index == segments.length - 1 ? title : name}
                </Link>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
