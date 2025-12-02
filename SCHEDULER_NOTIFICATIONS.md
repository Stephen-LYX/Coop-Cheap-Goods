# Meeting Scheduler & Transaction Notifications

## Features Implemented

### 1. Meeting Scheduler ✅
Located in the inbox chat interface with a toggle button.

**Features:**
- Propose meeting time slots (date + time + optional notes)
- Accept/Decline proposals
- Real-time updates using Supabase subscriptions
- Visual status indicators (pending/confirmed/declined)
- Past meetings history (collapsible)

**How to use:**
1. Open a conversation in the inbox
2. Click the "Schedule" button in the chat header
3. Click "Propose Time" to suggest a meeting time
4. Other user can Accept or Decline
5. Confirmed meetings appear in green

### 2. Post-Meeting Notifications ✅
Automatic follow-up system that asks sellers if items were sold.

**Features:**
- Notifications trigger 2 hours after accepted meeting time
- Modal asks: "Did you sell the item?"
- Three response options:
  - ✅ "Yes, I Sold the Item" → Marks item as sold in database
  - 🔵 "No, Item Still Available" → Item remains available
  - ⏭️ "Ask Me Later" → Dismisses notification

**How it works:**
1. When a meeting is accepted, system creates a notification scheduled for 2 hours after meeting time
2. Notification appears automatically as a modal when seller logs in after scheduled time
3. Seller responds and item status updates accordingly

## Database Tables

### `meeting_schedules`
```sql
- id (uuid, primary key)
- conversation_id (uuid, references conversations)
- proposed_by (uuid, references profiles)
- proposed_to (uuid, references profiles)
- proposed_time_slot (timestamptz)
- status ('pending', 'accepted', 'declined', 'completed', 'cancelled')
- notes (text, optional)
- created_at, updated_at
```

### `transaction_notifications`
```sql
- id (uuid, primary key)
- meeting_schedule_id (uuid, references meeting_schedules)
- conversation_id (uuid, references conversations)
- item_id (bigint, references items)
- seller_id (uuid, references profiles)
- buyer_id (uuid, references profiles)
- notification_type ('post_meeting_followup', 'reminder', 'item_sold')
- status ('pending', 'item_sold', 'item_available', 'dismissed')
- scheduled_for (timestamptz)
- sent_at, responded_at (timestamptz)
- response_notes (text)
- created_at, updated_at
```

### Updated `items` table
Added `status` column:
- 'available' (default)
- 'pending'
- 'sold'

## Files Created/Modified

### New Components:
1. **`src/component/MeetingScheduler.tsx`**
   - Full scheduler UI with form, proposal list, accept/decline actions
   - Real-time subscriptions for live updates
   - Auto-creates notifications when meetings are accepted

2. **`src/component/NotificationModal.tsx`**
   - Modal for post-meeting follow-up
   - Handles seller responses
   - Updates item status when sold

3. **`src/lib/notificationUtils.ts`**
   - Utility functions for creating notifications
   - Checks if notification exists to avoid duplicates

### Modified Files:
1. **`src/app/inbox/page.tsx`**
   - Added scheduler toggle button in chat header
   - Integrated scheduler panel (slides in from right)
   - Added notification checking on page load
   - Displays notification modal when due

## Security Features

- **Row Level Security (RLS)** enabled on both tables
- Users can only see meetings/notifications they're part of
- Proper foreign key constraints with CASCADE deletes
- Indexed columns for performance

## Future Enhancements (Optional)

- [ ] Email/push notifications for meeting reminders
- [ ] Recurring meeting proposals
- [ ] Calendar integration (Google Calendar, iCal)
- [ ] Meeting location suggestions with maps
- [ ] Automatic meeting completion after scheduled time
- [ ] Rating system after completed transactions
- [ ] Batch notification handling for multiple items

## Testing Checklist

- [x] Propose a meeting time slot
- [x] Accept/decline proposals
- [x] Real-time updates work across users
- [x] Notification appears after meeting time (test with past date)
- [x] Item status updates when marked as sold
- [x] UI responsive and user-friendly
- [x] No TypeScript errors
- [x] Build compiles successfully

## Notes

- Notifications check happens on inbox page load
- Only sellers receive post-meeting notifications
- Notification scheduled for 2 hours after meeting by default (configurable in `notificationUtils.ts`)
- Multiple meetings can be scheduled for same conversation
- Past/declined meetings are collapsed by default to keep UI clean
