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
import { FormEvent, useState } from "react";

export function ReportButton({
  reported,
  userID,
  itemID,
}: {
  reported: boolean;
  userID: string | undefined;
  itemID: string | number;
}) {
  const [text, setText] = useState<string>(
    reported ? "Item Already Reported" : "Report Item",
  );
  const [disabled, setDisabled] = useState<boolean>(reported || !userID);
  const [reason, setReason] = useState("");

  //report item
  async function reportItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!userID) {
      setText("Please log in to report items");
      return;
    }
    setDisabled(true);
    setText("Reporting...");
    try {
      const supabase = await createClient();

      const { error } = await supabase
        .from("reports")
        .insert({
          item: itemID,
          profile: userID,
          reason: reason,
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
      <>
        <button
          data-modal-target="popup-modal"
          data-modal-toggle="popup-modal"
          disabled={disabled}
          className={
            disabled
              ? "block text-center text-white bg-red-300 box-border border border-transparent focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded px-4 py-2.5 my-4 focus:outline-none w-full"
              : "block text-center text-white bg-red-600 box-border border border-transparent hover:bg-red-700 focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded px-4 py-2.5 my-4 focus:outline-none w-full"
          }
        >
          {text}
        </button>
        <div
          id="popup-modal"
          tabIndex={-1}
          className="hidden fixed top-0 right-0 left-0 z-50 w-full h-full bg-gray-900/75"
        >
          <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative bg-white rounded shadow-sm p-4 md:p-6">
              <button
                type="button"
                className="absolute top-3 end-2.5 text-body rounded hover:bg-gray-300 rounded-base text-sm w-9 h-9 ms-auto inline-flex justify-center items-center"
                data-modal-hide="popup-modal"
              >
                <svg
                  className="w-5 h-5"
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
                    d="M6 18 17.94 6M18 18 6.06 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
              <div className="p-4 md:p-5 text-center">
                <svg
                  className="mx-auto mb-4 text-fg-disabled w-12 h-12"
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
                    d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                <h3 className="mb-6">
                  Are you sure you want to report this item?
                </h3>
                <form onSubmit={reportItem}>
                  <div className="text-left mb-2">
                    <label htmlFor="reason" className="block text-sm">
                      Reason for reporting (optional):
                    </label>
                    <textarea
                      id="reason"
                      rows={4}
                      className="bg-gray-200 border-none rounded text-sm w-full p-3.5 placeholder:text-gray-500"
                      placeholder="Write reason for report here"
                      onChange={(event) => setReason(event.target.value)}
                    ></textarea>
                  </div>
                  <div className="flex items-center space-x-4 justify-center">
                    <button
                      data-modal-hide="popup-modal"
                      type="submit"
                      className="text-white bg-red-600 rounded hover:bg-red-700 text-sm px-4 py-2.5"
                    >
                      Yes, I&apos;m sure
                    </button>
                    <button
                      data-modal-hide="popup-modal"
                      type="button"
                      className="bg-gray-200 rounded hover:bg-gray-300 text-sm px-4 py-2.5"
                    >
                      No, cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <Link
        href={"/login"}
        className={
          "block text-center text-white bg-red-600 box-border border border-transparent hover:bg-red-700 focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded px-4 py-2.5 my-4 focus:outline-none"
        }
      >
        Login to Report
      </Link>
    );
  }
}
