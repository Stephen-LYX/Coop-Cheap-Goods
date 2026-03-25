"use client";

import { useState, useEffect } from "react";
import supabase from "@/lib/supabaseClient";
import { IoMdCalendar, IoMdTime, IoMdCheckmark, IoMdClose } from "react-icons/io";
import { createPostMeetingNotification, notificationExistsForMeeting } from "@/lib/notificationUtils";

type MeetingSchedule = {
  id: string;
  conversation_id: string;
  proposed_by: string;
  proposed_to: string;
  proposed_time_slot: string;
  status: "pending" | "accepted" | "declined" | "completed" | "cancelled";
  notes?: string;
  created_at: string;
  proposer?: { username?: string; full_name?: string };
};

interface MeetingSchedulerProps {
  conversationId: string;
  currentUserId: string;
  otherUserId: string;
  itemId?: number | null;
  sellerId?: string;
  buyerId?: string;
  onClose?: () => void;
}

export default function MeetingScheduler({
  conversationId,
  currentUserId,
  otherUserId,
  itemId,
  sellerId,
  buyerId,
  onClose,
}: MeetingSchedulerProps) {
  const [schedules, setSchedules] = useState<MeetingSchedule[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSchedules();
  }, [conversationId]);

  // Real-time subscription for schedule updates
  useEffect(() => {
    const channel = supabase
      .channel(`schedules:conversation_id=eq.${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "meeting_schedules",
          filter: `conversation_id=eq.${conversationId}`,
        },
        () => {
          fetchSchedules();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [conversationId]);

  async function fetchSchedules() {
    try {
      const { data, error } = await supabase
        .from("meeting_schedules")
        .select(`
          *,
          proposer:profiles!proposed_by(username, full_name)
        `)
        .eq("conversation_id", conversationId)
        .order("proposed_time_slot", { ascending: true });

      if (error) throw error;
      setSchedules((data || []) as MeetingSchedule[]);
    } catch (err) {
      console.error("Error fetching schedules:", err);
    }
  }

  async function proposeTimeSlot() {
    if (!selectedDate || !selectedTime) {
      alert("Please select both date and time");
      return;
    }

    setLoading(true);
    try {
      const timeSlot = new Date(`${selectedDate}T${selectedTime}`).toISOString();

      const { error } = await supabase.from("meeting_schedules").insert({
        conversation_id: conversationId,
        proposed_by: currentUserId,
        proposed_to: otherUserId,
        proposed_time_slot: timeSlot,
        notes: notes.trim() || null,
        status: "pending",
      });

      if (error) throw error;

      // Reset form
      setSelectedDate("");
      setSelectedTime("");
      setNotes("");
      setShowForm(false);
      fetchSchedules();
    } catch (err) {
      console.error("Error proposing time slot:", err);
      alert("Failed to propose time slot");
    } finally {
      setLoading(false);
    }
  }

  async function respondToSchedule(scheduleId: string, status: "accepted" | "declined") {
    try {
      const { data: scheduleData, error: fetchError } = await supabase
        .from("meeting_schedules")
        .select("*")
        .eq("id", scheduleId)
        .single();

      if (fetchError) throw fetchError;

      const { error } = await supabase
        .from("meeting_schedules")
        .update({ status })
        .eq("id", scheduleId);

      if (error) throw error;

      // If accepted, create a post-meeting notification (if not already exists)
      if (status === "accepted" && scheduleData && itemId && sellerId && buyerId) {
        const exists = await notificationExistsForMeeting(scheduleId);
        if (!exists) {
          await createPostMeetingNotification(
            scheduleId,
            conversationId,
            itemId,
            sellerId,
            buyerId,
            scheduleData.proposed_time_slot,
            2 // 2 hours after meeting
          );
        }
      }

      fetchSchedules();
    } catch (err) {
      console.error("Error responding to schedule:", err);
      alert("Failed to update schedule");
    }
  }

  function formatDateTime(isoString: string) {
    const date = new Date(isoString);
    return {
      date: date.toLocaleDateString("en-US", { 
        weekday: "short", 
        month: "short", 
        day: "numeric", 
        year: "numeric" 
      }),
      time: date.toLocaleTimeString("en-US", { 
        hour: "numeric", 
        minute: "2-digit", 
        hour12: true 
      }),
    };
  }

  const pendingSchedules = schedules.filter((s) => s.status === "pending");
  const acceptedSchedules = schedules.filter((s) => s.status === "accepted");
  const pastSchedules = schedules.filter((s) => 
    s.status === "declined" || s.status === "completed" || s.status === "cancelled"
  );

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="relative px-6 py-5 bg-white border-b-2 border-gray-300">
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close meeting scheduler"
            className="absolute right-4 top-4 p-2 rounded-full border border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300 bg-white shadow-sm transition-colors"
          >
            <IoMdClose className="text-lg" />
          </button>
        )}
        <div className="flex items-center justify-between mb-4 pr-12">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <IoMdCalendar className="text-blue-600" />
            Meeting Scheduler
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              {showForm ? "Cancel" : "Propose Time"}
            </button>
          </div>
        </div>

        {/* Propose Time Form */}
        {showForm && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g., Meet at campus library entrance"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black resize-none"
                />
              </div>
              <button
                onClick={proposeTimeSlot}
                disabled={loading || !selectedDate || !selectedTime}
                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {loading ? "Proposing..." : "Send Proposal"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Schedules List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Pending Proposals */}
        {pendingSchedules.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2 px-2">
              PENDING PROPOSALS
            </h3>
            {pendingSchedules.map((schedule) => {
              const { date, time } = formatDateTime(schedule.proposed_time_slot);
              const isProposedByMe = schedule.proposed_by === currentUserId;

              return (
                <div
                  key={schedule.id}
                  className="bg-white rounded-lg border-2 border-yellow-200 p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <IoMdTime className="text-yellow-500 text-xl" />
                      <div>
                        <p className="font-semibold text-gray-900">{date}</p>
                        <p className="text-sm text-gray-600">{time}</p>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full font-medium">
                      Pending
                    </span>
                  </div>

                  {schedule.notes && (
                    <p className="text-sm text-gray-600 mb-3 pl-7">
                      📝 {schedule.notes}
                    </p>
                  )}

                  <p className="text-xs text-gray-500 mb-3 pl-7">
                    Proposed by{" "}
                    {isProposedByMe
                      ? "you"
                      : schedule.proposer?.username || schedule.proposer?.full_name || "other user"}
                  </p>

                  {!isProposedByMe && (
                    <div className="flex gap-2 pl-7">
                      <button
                        onClick={() => respondToSchedule(schedule.id, "accepted")}
                        className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                      >
                        <IoMdCheckmark className="text-lg" />
                        Accept
                      </button>
                      <button
                        onClick={() => respondToSchedule(schedule.id, "declined")}
                        className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                      >
                        <IoMdClose className="text-lg" />
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Accepted Meetings */}
        {acceptedSchedules.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2 px-2">
              CONFIRMED MEETINGS
            </h3>
            {acceptedSchedules.map((schedule) => {
              const { date, time } = formatDateTime(schedule.proposed_time_slot);

              return (
                <div
                  key={schedule.id}
                  className="bg-white rounded-lg border-2 border-green-200 p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <IoMdCheckmark className="text-green-600 text-xl" />
                      <div>
                        <p className="font-semibold text-gray-900">{date}</p>
                        <p className="text-sm text-gray-600">{time}</p>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                      Confirmed
                    </span>
                  </div>

                  {schedule.notes && (
                    <p className="text-sm text-gray-600 pl-7">
                      📝 {schedule.notes}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {schedules.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <IoMdCalendar className="text-6xl mb-3" />
            <p className="text-sm font-medium">No meetings scheduled</p>
            <p className="text-xs mt-1">Propose a time to meet up</p>
          </div>
        )}

        {/* Past Schedules (collapsed) */}
        {pastSchedules.length > 0 && (
          <details className="text-sm">
            <summary className="cursor-pointer text-gray-500 hover:text-gray-700 px-2 py-1">
              Past/Declined ({pastSchedules.length})
            </summary>
            <div className="mt-2 space-y-2">
              {pastSchedules.map((schedule) => {
                const { date, time } = formatDateTime(schedule.proposed_time_slot);
                return (
                  <div
                    key={schedule.id}
                    className="bg-gray-100 rounded-lg p-3 text-xs opacity-60"
                  >
                    <p className="font-medium text-gray-700">{date} at {time}</p>
                    <p className="text-gray-500 capitalize">{schedule.status}</p>
                  </div>
                );
              })}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}
