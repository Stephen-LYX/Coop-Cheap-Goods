// src/app/inbox/page.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabaseClient";
import Navbar from "@/component/Navbar";
import { IoIosSearch, IoMdSend } from "react-icons/io";

type Conversation = {
  id: string;
  buyer_id: string;
  seller_id: string;
  item_id?: string | number;
  last_message?: string | null;
  last_message_at?: string | null;
  buyer?: any;
  seller?: any;
  item?: { title?: string; image_url?: string };
  other_user?: { id: string; username?: string; full_name?: string; avatar_url?: string };
  unread_count?: number;
};

type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  message_type: string;
  is_read: boolean;
  created_at: string;
  sender_name?: string;
};

export default function InboxPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Wait until AuthContext finished loading (prevents premature redirect)
  useEffect(() => {
    if (!loading && !user) {
      router.push("/Login"); // match your route casing
      return;
    }
    if (user) fetchConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  useEffect(() => {
    if (!selectedConversation) return;
    fetchMessages(selectedConversation.id);
    markMessagesAsRead(selectedConversation.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Realtime subscription for new messages for the selected conversation
  useEffect(() => {
    if (!selectedConversation) return;
    const channel = supabase
      .channel(`messages:conversation_id=eq.${selectedConversation.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${selectedConversation.id}`,
        },
        (payload: { new: Message }) => {
          const newMsg = payload.new;
          setMessages((prev) => [...prev, newMsg]);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [selectedConversation?.id]);

  async function fetchConversations() {
    setLoadingConversations(true);
    try {
      const { data, error } = await supabase
        .from("conversations")
        .select(`
          *,
          buyer:profiles!buyer_id(*),
          seller:profiles!seller_id(*),
          item:items(title, image_url)
        `)
        .or(`buyer_id.eq.${user?.id},seller_id.eq.${user?.id}`)
        .order("last_message_at", { ascending: false });

      if (error) throw error;

      const convs = (data || []) as any[];

      const annotated = await Promise.all(
        convs.map(async (conv) => {
          const convId: string = conv.id;
          const { count } = await supabase
            .from("messages")
            .select("*", { count: "exact", head: true })
            .eq("conversation_id", convId)
            .eq("receiver_id", user?.id)
            .eq("is_read", false);

          const isCurrentBuyer = conv.buyer_id === user?.id;
          const otherUser = isCurrentBuyer ? conv.seller : conv.buyer;

          return {
            ...conv,
            other_user: otherUser,
            unread_count: count ?? 0,
          } as Conversation;
        })
      );

      setConversations(annotated);
    } catch (err) {
      console.error("Error fetching conversations:", err);
    } finally {
      setLoadingConversations(false);
    }
  }

  async function fetchMessages(conversationId: string) {
    setLoadingMessages(true);
    try {
      const { data, error } = await supabase
        .from("messages")
        .select(`
          *,
          sender:profiles!sender_id(username, full_name)
        `)
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      const mapped: Message[] = (data || []).map((m: any) => ({
        ...m,
        sender_name: m.sender?.username || m.sender?.full_name || "Unknown",
      }));

      setMessages(mapped);
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      setLoadingMessages(false);
    }
  }

  async function sendMessage() {
    if (!newMessage.trim() || !selectedConversation || !user) return;

    const receiverId = selectedConversation.buyer_id === user.id ? selectedConversation.seller_id : selectedConversation.buyer_id;

    try {
      const { data, error } = await supabase
        .from("messages")
        .insert({
          conversation_id: selectedConversation.id,
          sender_id: user.id,
          receiver_id: receiverId,
          content: newMessage.trim(),
          message_type: "text",
        })
        .select()
        .single();

      if (error) throw error;

      // update conversation
      await supabase
        .from("conversations")
        .update({
          last_message: newMessage.trim(),
          last_message_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedConversation.id);

      setNewMessage("");
      fetchConversations(); // refresh overview
    } catch (err) {
      console.error("Error sending message:", err);
    }
  }

  async function markMessagesAsRead(conversationId: string) {
    if (!user) return;
    try {
      await supabase.from("messages").update({ is_read: true }).eq("conversation_id", conversationId).eq("receiver_id", user.id).eq("is_read", false);
    } catch (err) {
      console.error("Error marking messages as read:", err);
    }
  }

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function selectConversation(conv: Conversation) {
    setSelectedConversation(conv);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  const filtered = conversations.filter((conv) => {
    const term = searchTerm.toLowerCase();
    const username = conv.other_user?.username ?? "";
    const full = conv.other_user?.full_name ?? "";
    const title = conv.item?.title ?? "";
    return username.toLowerCase().includes(term) || full.toLowerCase().includes(term) || title.toLowerCase().includes(term);
  });

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="h-screen w-screen">
      <Navbar />
      <div className="flex h-11/12">
        {/* Sidebar */}
        <div className="w-80 bg-[#FFFBDE] flex flex-col">
          <div className="font-bold text-2xl pt-3 px-3 pb-2 shrink-0">Inbox</div>
          <div className="mx-3 mb-3 p-2 bg-white flex items-center rounded">
            <IoIosSearch className="text-gray-500 mr-2" />
            <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search chats" className="w-full focus:outline-none text-sm" />
          </div>

          <div className="flex-1 overflow-y-auto">
            {loadingConversations ? (
              <div className="p-4 text-center text-gray-500">Loading conversations...</div>
            ) : filtered.length ? (
              filtered.map((conv) => (
                <div key={conv.id} className={`flex items-center p-3 hover:bg-gray-100 cursor-pointer ${selectedConversation?.id === conv.id ? "bg-gray-200" : ""}`} onClick={() => selectConversation(conv)}>
                  <img src={conv.other_user?.avatar_url ?? "/default-avatar.png"} alt={conv.other_user?.username ?? "User"} className="w-10 h-10 rounded-full mr-3" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">{conv.other_user?.username ?? conv.other_user?.full_name}</div>
                    <div className="text-xs text-gray-600 truncate">{conv.last_message ?? "No messages yet"}</div>
                    {conv.item && <div className="text-xs text-blue-600 truncate">About: {conv.item.title}</div>}
                  </div>
                  {conv.unread_count && conv.unread_count > 0 && <div className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{conv.unread_count}</div>}
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">No conversations found</div>
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          <div className="h-16 p-4 bg-gray-50 border-b">
            {selectedConversation ? (
              <div className="flex items-center">
                <img src={selectedConversation.other_user?.avatar_url ?? "/default-avatar.png"} className="w-8 h-8 rounded-full mr-3" />
                <div>
                  <div className="font-semibold">{selectedConversation.other_user?.username ?? selectedConversation.other_user?.full_name}</div>
                  {selectedConversation.item && <div className="text-xs text-gray-500">About: {selectedConversation.item.title}</div>}
                </div>
              </div>
            ) : (
              <div className="text-gray-500">Select a chat to start messaging</div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-white">
            {selectedConversation ? (
              loadingMessages ? <div className="text-gray-500">Loading messages...</div> : (
                <>
                  {messages.map((m) => (
                    <div key={m.id} className={`flex ${m.sender_id === user?.id ? "justify-end" : "justify-start"}`}>
                      <div className={`px-4 py-2 rounded-lg max-w-xs ${m.sender_id === user?.id ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"}`}>
                        <div className="text-sm">{m.content}</div>
                        <div className="text-xs mt-1">{new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef}></div>
                </>
              )
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">Select a conversation to start chatting</div>
            )}
          </div>

          {selectedConversation && (
            <div className="p-4 border-t bg-white">
              <div className="flex items-center">
                <input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={handleKeyDown} placeholder="Type a message..." className="flex-1 px-4 py-2 border rounded-full" />
                <button onClick={sendMessage} disabled={!newMessage.trim()} className="ml-2 p-2 rounded-full bg-blue-600 text-white">
                  <IoMdSend />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
