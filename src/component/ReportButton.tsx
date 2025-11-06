/*
Title: Report Button component
Author: Miles Paleveda
Date: 10/28/2025

Credits: This file includes the following third party and open source softwares:
  -Next.js: license in /credits/nextjs/LICENSE
  -React: license in /credits/react/LICENSE
  -Supabase: license in /credits/supabase/LICENSE
  -Tailwind CSS: license in /credits/tailwindcss/LICENSE
*/

"use client";

import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useState } from "react";

export function ReportButton({ reported, userID, itemID }) {
  const [text, setText] = useState<string>(
    reported ? "Item Already Reported" : "Report Item"
  );
  const [disabled, setDisabled] = useState<boolean>(reported ? true : false);

  //report item
  async function reportItem() {
    setDisabled(true);
    setText("Reporting...");
    try {
      const supabase = await createClient();

      const { error } = await supabase
        .from("reports")
        .insert({
          item: itemID,
          profile: userID,
        })
        .throwOnError();

      setText("Item Reported");
    } catch (error) {
      console.log(error);
      setText("Error Reporting Item, Try Again");
      setDisabled(false);
    }
  }

  if (userID) {
    return (
      <button
        onClick={reportItem}
        disabled={disabled}
        className={
          disabled
            ? "w-full block py-2 my-4 border bg-red-300 text-center text-white w-auto  rounded"
            : "w-full block py-2 my-4 border bg-red-600 text-center text-white w-auto hover:bg-red-700 rounded"
        }
      >
        {text}
      </button>
    );
  } else {
    return (
      <Link
        href={"/login"}
        className={
          "w-full block py-2 my-4 border bg-red-600 text-center text-white w-auto hover:bg-red-700 rounded"
        }
      >
        Login to Report
      </Link>
    );
  }
}
