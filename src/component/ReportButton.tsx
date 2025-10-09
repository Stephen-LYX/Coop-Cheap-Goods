"use client";

import { createClient } from "@/utils/supabase/client";
import { FormEvent, useState } from "react";

export function ReportButton({ itemID }) {
  const [text, setText] = useState<string>("Report Item");
  const [disabled, setDisabled] = useState<boolean>(false);

  //report item
  async function reportItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setDisabled(true);
    setText("Reporting...");
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      //check if user already reported this item
      const { data: reports } = await supabase
        .from("reports")
        .select()
        .eq("item", itemID)
        .eq("profile", user.id);
      if (reports.length > 0) {
        setText("Item Already Reported");
      } else {
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
    } catch (error) {
      console.log(error);
      setText("Error Reporting Item, Try Again");
      setDisabled(false);
    }
  }

  return (
    <form onSubmit={reportItem}>
      <input type="text" value={itemID} hidden />
      <button
        disabled={disabled}
        className={
          disabled
            ? "w-full block py-2 my-4 border bg-red-300 text-center text-white w-auto  rounded"
            : "w-full block py-2 my-4 border bg-red-600 text-center text-white w-auto hover:bg-red-700 rounded"
        }
      >
        {text}
      </button>
    </form>
  );
}
