"use client";

import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useState } from "react";

export function ReportButton({ itemID }) {
  const [text, setText] = useState<string>("Report Item");
  const [disabled, setDisabled] = useState<boolean>(false);
  const [redirect, setRedirect] = useState<boolean>(false);

  //report item
  async function reportItem() {
    setDisabled(true);

    setText("Reporting...");
    try {
      const supabase = await createClient();

      //check is user is logged in
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user == null) {
        setRedirect(true);
        setText("Login to Report");
        setDisabled(false);
      } else {
        //check if user already reported this item
        const { data: reports } = await supabase
          .from("reports")
          .select()
          .eq("item", itemID)
          .eq("profile", user.id);
        if (reports.length > 0) {
          setText("Item Already Reported");
        } else {
          //report item
          const { error } = await supabase.from("reports").insert({
            item: itemID,
            profile: user.id,
          });
          if (error) {
            console.log(error);
            setDisabled(false);
            setText("Error Reporting Item, Try Again");
          } else {
            setText("Item Reported");
          }
        }
      }
    } catch (error) {
      console.log(error);
      setText("Error Reporting Item, Try Again");
      setDisabled(false);
    }
  }

  if (redirect) {
    return (
      <Link
        href={"/login"}
        className={
          "w-full block py-2 my-4 border bg-red-600 text-center text-white w-auto hover:bg-red-700 rounded"
        }
      >
        {text}
      </Link>
    );
  } else {
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
  }
}
