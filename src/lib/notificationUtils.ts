// Utility function to create post-meeting notifications
// This should be called after a meeting is accepted or when checking for completed meetings

import supabase from "@/lib/supabaseClient";

export async function createPostMeetingNotification(
  meetingScheduleId: string,
  conversationId: string,
  itemId: number | null,
  sellerId: string,
  buyerId: string,
  meetingTimeSlot: string,
  hoursAfterMeeting: number = 2
) {
  try {
    // Calculate notification time (X hours after meeting)
    const meetingTime = new Date(meetingTimeSlot);
    const notificationTime = new Date(meetingTime.getTime() + hoursAfterMeeting * 60 * 60 * 1000);

    const { data, error } = await supabase
      .from("transaction_notifications")
      .insert({
        meeting_schedule_id: meetingScheduleId,
        conversation_id: conversationId,
        item_id: itemId,
        seller_id: sellerId,
        buyer_id: buyerId,
        notification_type: "post_meeting_followup",
        status: "pending",
        scheduled_for: notificationTime.toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error("Error creating post-meeting notification:", err);
    return { success: false, error: err };
  }
}

// Function to check if notification already exists for a meeting
export async function notificationExistsForMeeting(meetingScheduleId: string) {
  try {
    const { data, error } = await supabase
      .from("transaction_notifications")
      .select("id")
      .eq("meeting_schedule_id", meetingScheduleId)
      .limit(1);

    if (error) throw error;
    return data && data.length > 0;
  } catch (err) {
    console.error("Error checking notification existence:", err);
    return false;
  }
}
