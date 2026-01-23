"use client";

import { useState } from "react";
import supabase from "@/lib/supabaseClient";
import { IoMdClose, IoMdCheckmark } from "react-icons/io";

type TransactionNotification = {
  id: string;
  meeting_schedule_id?: string;
  conversation_id: string;
  item_id?: number;
  seller_id: string;
  buyer_id: string;
  notification_type: string;
  status: "pending" | "item_sold" | "item_available" | "dismissed";
  scheduled_for: string;
  item?: { title?: string; id: number };
  buyer?: { username?: string; full_name?: string };
};

interface NotificationModalProps {
  notification: TransactionNotification;
  onClose: () => void;
}

export default function NotificationModal({
  notification,
  onClose,
}: NotificationModalProps) {
  const [responding, setResponding] = useState(false);

  async function handleResponse(response: "item_sold" | "item_available" | "dismissed") {
    setResponding(true);
    try {
      // Update notification status
      const { error: notifError } = await supabase
        .from("transaction_notifications")
        .update({
          status: response,
          responded_at: new Date().toISOString(),
        })
        .eq("id", notification.id);

      if (notifError) throw notifError;

      // If item was sold, update the item status
      if (response === "item_sold" && notification.item_id) {
        const { error: itemError } = await supabase
          .from("items")
          .update({ status: "sold" })
          .eq("id", notification.item_id);

        if (itemError) {
          console.error("Error updating item status:", itemError);
          // Continue anyway, notification was updated
        }
      }

      onClose();
    } catch (err) {
      console.error("Error responding to notification:", err);
      alert("Failed to update. Please try again.");
    } finally {
      setResponding(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-fade-in">
        <button
          onClick={() => handleResponse("dismissed")}
          disabled={responding}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <IoMdClose className="text-2xl" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">💰</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Transaction Follow-up
          </h2>
          <p className="text-gray-600 text-sm">
            How did your meeting go?
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-500 mb-1">Item</p>
          <p className="font-semibold text-gray-900 mb-3">
            {notification.item?.title || "Unknown Item"}
          </p>
          
          <p className="text-sm text-gray-500 mb-1">Buyer</p>
          <p className="font-medium text-gray-700">
            {notification.buyer?.username || notification.buyer?.full_name || "Unknown User"}
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => handleResponse("item_sold")}
            disabled={responding}
            className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            <IoMdCheckmark className="text-xl" />
            Yes, I Sold the Item
          </button>

          <button
            onClick={() => handleResponse("item_available")}
            disabled={responding}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg"
          >
            No, Item Still Available
          </button>

          <button
            onClick={() => handleResponse("dismissed")}
            disabled={responding}
            className="w-full py-2 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-700 rounded-lg font-medium transition-colors"
          >
            Ask Me Later
          </button>
        </div>

        {responding && (
          <div className="absolute inset-0 bg-white bg-opacity-90 rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600 text-sm">Updating...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
