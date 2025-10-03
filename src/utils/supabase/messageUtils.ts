// utils/messageUtils.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export interface StartConversationParams {
  buyerId: string;
  sellerId: string;
  itemId?: string;
  initialMessage?: string;
}

export const startConversation = async ({
  buyerId,
  sellerId,
  itemId,
  initialMessage
}: StartConversationParams) => {
  const supabase = createClientComponentClient();

  try {
    // Check if conversation already exists
    let { data: existingConversation, error: fetchError } = await supabase
      .from('conversations')
      .select('id')
      .eq('buyer_id', buyerId)
      .eq('seller_id', sellerId)
      .eq('item_id', itemId || null)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows found
      throw fetchError;
    }

    let conversationId: string;

    if (existingConversation) {
      // Use existing conversation
      conversationId = existingConversation.id;
    } else {
      // Create new conversation
      const { data: newConversation, error: createError } = await supabase
        .from('conversations')
        .insert({
          buyer_id: buyerId,
          seller_id: sellerId,
          item_id: itemId || null,
          last_message: initialMessage || '',
          last_message_at: new Date().toISOString()
        })
        .select('id')
        .single();

      if (createError) throw createError;
      conversationId = newConversation.id;
    }

    // Send initial message if provided
    if (initialMessage) {
      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: buyerId,
          receiver_id: sellerId,
          content: initialMessage,
          message_type: 'text'
        });

      if (messageError) throw messageError;

      // Update conversation's last message
      await supabase
        .from('conversations')
        .update({
          last_message: initialMessage,
          last_message_at: new Date().toISOString()
        })
        .eq('id', conversationId);
    }

    return { conversationId, success: true };
  } catch (error) {
    console.error('Error starting conversation:', error);
    return { success: false, error };
  }
};

// Function to use in your marketplace item pages
export const contactSeller = async (
  currentUserId: string,
  sellerId: string,
  itemId: string,
  itemTitle: string
) => {
  const initialMessage = `Hi! I'm interested in your item: ${itemTitle}`;
  
  const result = await startConversation({
    buyerId: currentUserId,
    sellerId: sellerId,
    itemId: itemId,
    initialMessage: initialMessage
  });

  return result;
};