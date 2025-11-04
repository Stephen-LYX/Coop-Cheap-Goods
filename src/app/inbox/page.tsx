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

type User = {
  id: string;
  username?: string;
  full_name?: string;
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
  const { user, loading } = useAuth() as { user: User | null; loading: boolean };
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/Login");
      return;
    }
    if (user) fetchConversations();
  }, [user, loading]);

  useEffect(() => {
    if (!selectedConversation) return;
    fetchMessages(selectedConversation.id);
    markMessagesAsRead(selectedConversation.id);
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

    const receiverId =
      selectedConversation.buyer_id === user.id
        ? selectedConversation.seller_id
        : selectedConversation.buyer_id;

    try {
      const messageContent = newMessage.trim();

      const { data, error } = await supabase
        .from("messages")
        .insert({
          conversation_id: selectedConversation.id,
          sender_id: user.id,
          receiver_id: receiverId,
          content: messageContent,
          message_type: "text",
        })
        .select()
        .single();

      if (error) throw error;

      const newMsg: Message = {
        ...data,
        sender_name: user.username || user.full_name || "You",
      };
      setMessages((prev) => [...prev, newMsg]);

      await supabase
        .from("conversations")
        .update({
          last_message: messageContent,
          last_message_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedConversation.id);

      setNewMessage("");
      fetchConversations();
    } catch (err) {
      console.error("Error sending message:", err);
    }
  }

  async function markMessagesAsRead(conversationId: string) {
    if (!user) return;
    try {
      await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("conversation_id", conversationId)
        .eq("receiver_id", user.id)
        .eq("is_read", false);
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

  if (loading) return <div className="flex justify-center items-center h-screen bg-gray-50">Loading...</div>;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Conversations List */}
        <div className="w-96 bg-white border-r-2 border-gray-300 flex flex-col shadow-md">
          <div className="px-6 py-5 border-b-2 border-gray-300 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Messages</h1>
            
            <div className="relative">
              <IoIosSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black text-xl" />
              <input 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                placeholder="Search conversations..." 
                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-black shadow-sm"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loadingConversations ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-gray-400 text-sm">Loading conversations...</div>
              </div>
            ) : filtered.length ? (
              <div className="divide-y divide-gray-100">
                {filtered.map((conv) => (
                  <div 
                    key={conv.id} 
                    className={`flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                      selectedConversation?.id === conv.id ? "bg-blue-50 border-l-4 border-blue-600" : "border-l-4 border-transparent"
                    }`} 
                    onClick={() => selectConversation(conv)}
                  >
                    <div className="relative flex-shrink-0">
                      <img 
                        src={conv.other_user?.avatar_url ?? "/default-avatar.png"} 
                        alt={conv.other_user?.username ?? "User"} 
                        className="w-14 h-14 rounded-full object-cover ring-2 ring-gray-100"
                      />
                      {conv.unread_count && conv.unread_count > 0 && (
                        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                          {conv.unread_count}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 truncate text-sm">
                          {conv.other_user?.username ?? conv.other_user?.full_name ?? "Unknown User"}
                        </h3>
                        {conv.last_message_at && (
                          <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
                            {new Date(conv.last_message_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 truncate mb-1">
                        {conv.last_message ?? "No messages yet"}
                      </p>
                      
                      {conv.item && (
                        <div className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-md inline-block">
                          <span className="truncate">📦 {conv.item.title}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                <p className="text-sm">No conversations found</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-gray-50">
          <div className="h-20 px-6 bg-white border-b border-gray-200 flex items-center shadow-sm">
            {selectedConversation ? (
              <div className="flex items-center gap-4">
                <img 
                  src={selectedConversation.other_user?.avatar_url ?? "/default-avatar.png"} 
                  alt="User avatar"
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100"
                />
                <div>
                  <h2 className="font-semibold text-gray-900 text-lg">
                    {selectedConversation.other_user?.username ?? selectedConversation.other_user?.full_name ?? "Unknown User"}
                  </h2>
                  {selectedConversation.item && (
                    <p className="text-sm text-gray-500">
                      About: <span className="text-blue-600 font-medium">{selectedConversation.item.title}</span>
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-gray-400 text-sm">Select a conversation to start messaging</div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {selectedConversation ? (
              loadingMessages ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-black text-sm">Loading messages...</div>
                </div>
              ) : (
                <>
                  {messages.map((m) => (
                    <div 
                      key={m.id} 
                      className={`flex ${m.sender_id === user?.id ? "justify-end" : "justify-start"} mb-4`}
                    >
                      <div className={`flex flex-col max-w-md ${m.sender_id === user?.id ? "items-end" : "items-start"}`}>
                        <div 
                          className={`px-5 py-3 rounded-2xl shadow-sm ${
                            m.sender_id === user?.id 
                              ? "bg-blue-600 text-white rounded-br-sm" 
                              : "bg-white text-black border border-gray-200 rounded-bl-sm"
                          }`}
                        >
                          <p className="text-sm leading-relaxed break-words">{m.content}</p>
                        </div>
                        <span className={`text-xs mt-1 px-2 ${
                          m.sender_id === user?.id ? "text-gray-500" : "text-gray-400"
                        }`}>
                          {new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef}></div>
                </>
              )
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <svg className="w-24 h-24 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-base font-medium">Select a conversation to start chatting</p>
                <p className="text-sm mt-1">Choose from your existing conversations or start a new one</p>
              </div>
            )}
          </div>

          {selectedConversation && (
            <div className="p-6 bg-white border-t-2 border-gray-300 shadow-lg">
              <div className="flex items-center gap-3">
                <input 
                  value={newMessage} 
                  onChange={(e) => setNewMessage(e.target.value)} 
                  onKeyDown={handleKeyDown} 
                  placeholder="Type your message..." 
                  className="flex-1 px-5 py-3 bg-white border-2 border-gray-400 rounded-full 
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                            transition-all text-sm text-black placeholder:text-gray-400"
                />
                <button 
                  onClick={sendMessage} 
                  disabled={!newMessage.trim()} 
                  className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors shadow-lg hover:shadow-xl disabled:shadow-none"
                >
                  <IoMdSend className="text-xl" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}