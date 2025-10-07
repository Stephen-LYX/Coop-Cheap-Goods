"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from 'next/navigation';
import { IoIosSearch, IoMdSend } from "react-icons/io";
import Navbar from "@/component/Navbar";

interface Conversation {
    id: string;
    buyer_id: string;
    seller_id: string;
    item_id?: string;
    last_message: string;
    last_message_at: string;
    other_user: {
        id: string;
        username: string;
        full_name: string;
        avatar_url?: string;
    };
    item?: {
        title: string;
        image_url: string;
    };
    unread_count: number;
}

interface Message {
    id: string;
    conversation_id: string;
    sender_id: string;
    receiver_id: string;
    content: string;
    message_type: string;
    is_read: boolean;
    created_at: string;
    sender_name: string;
}

export default function LiveChat() {
    const { user, supabase, loading } = useAuth();
    const router = useRouter();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [loadingConversations, setLoadingConversations] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/Login');
            return;
        }

        if (user) {
            fetchConversations();
        }
    }, [user, loading]);

    useEffect(() => {
        if (selectedConversation) {
            fetchMessages(selectedConversation.id);
            markMessagesAsRead(selectedConversation.id);
        }
    }, [selectedConversation]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Real-time subscription for new messages
    useEffect(() => {
        if (!user || !selectedConversation) return;

        const subscription = supabase
            .channel(`messages:conversation_id=eq.${selectedConversation.id}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `conversation_id=eq.${selectedConversation.id}`
            }, (payload) => {
                const newMessage = payload.new as Message;
                setMessages(prev => [...prev, newMessage]);
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [selectedConversation, user, supabase]);

    const fetchConversations = async () => {
        try {
            console.log("Current logged in user:", user);

            const { data, error } = await supabase
            .from('conversations')
            .select(`
                *,
                buyer:profiles!buyer_id(*),
                seller:profiles!seller_id(*),
                item:items(title, image_url)
            `)
            .or(`buyer_id.eq.${user?.id},seller_id.eq.${user?.id}`)
            .order('last_message_at', { ascending: false });

            if (error) throw error;

            const conversationsWithUnread = await Promise.all(
            (data || []).map(async (conv) => {
                const { count } = await supabase
                .from('messages')
                .select('*', { count: 'exact', head: true })
                .eq('conversation_id', conv.id)
                .eq('receiver_id', user?.id)
                .eq('is_read', false);

                const isCurrentUserBuyer = conv.buyer_id === user?.id;
                const otherUser = isCurrentUserBuyer ? conv.seller : conv.buyer;

                return {
                ...conv,
                other_user: otherUser,
                unread_count: count || 0,
                };
            })
        );

    setConversations(conversationsWithUnread);
  } catch (error) {
    console.error('Error fetching conversations:', error);
  } finally {
    setLoadingConversations(false);
  }
};


    const fetchMessages = async (conversationId: string) => {
        setLoadingMessages(true);
        try {
            const { data, error } = await supabase
                .from('messages')
                .select(`
                    *,
                    sender:profiles!sender_id(username, full_name)
                `)
                .eq('conversation_id', conversationId)
                .order('created_at', { ascending: true });

            if (error) throw error;

            const messagesWithSenderName = (data || []).map(msg => ({
                ...msg,
                sender_name: msg.sender?.username || msg.sender?.full_name || 'Unknown'
            }));

            setMessages(messagesWithSenderName);
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoadingMessages(false);
        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim() || !selectedConversation || !user) return;

        const receiverId = selectedConversation.buyer_id === user.id 
            ? selectedConversation.seller_id 
            : selectedConversation.buyer_id;

        try {
            // Insert new message
            const { data, error } = await supabase
                .from('messages')
                .insert({
                    conversation_id: selectedConversation.id,
                    sender_id: user.id,
                    receiver_id: receiverId,
                    content: newMessage.trim(),
                    message_type: 'text'
                })
                .select()
                .single();

            if (error) throw error;

            // Update conversation's last message
            await supabase
                .from('conversations')
                .update({
                    last_message: newMessage.trim(),
                    last_message_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .eq('id', selectedConversation.id);

            setNewMessage("");
            
            // Refresh conversations to update last message
            fetchConversations();

        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const markMessagesAsRead = async (conversationId: string) => {
        if (!user) return;

        try {
            await supabase
                .from('messages')
                .update({ is_read: true })
                .eq('conversation_id', conversationId)
                .eq('receiver_id', user.id)
                .eq('is_read', false);
        } catch (error) {
            console.error('Error marking messages as read:', error);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleConversationClick = (conversation: Conversation) => {
        setSelectedConversation(conversation);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const filteredConversations = conversations.filter(conv =>
        conv.other_user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.other_user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.item?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="h-screen w-screen">
            <Navbar />

            <div className="flex h-11/12">
                {/* Conversations Sidebar */}
                <div className="w-80 min-w-64 max-w-96 m-0 bg-[#FFFBDE] flex flex-col">
                    <div className="font-bold text-2xl lg:text-3xl pt-3 px-3 pb-2 shrink-0">
                        Inbox
                    </div>

                    {/* Search */}
                    <div className="flex rounded justify-center items-center mx-3 mb-3 p-2 bg-[#FFFFFF] shrink-0">
                        <IoIosSearch className="text-gray-500 mr-2 shrink-0"/>
                        <input 
                            className="w-full focus:outline-none focus:border-none text-sm" 
                            type="text" 
                            placeholder="Search chats"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    {/* Conversations List */}
                    <div className="flex-1 overflow-y-auto">
                        {loadingConversations ? (
                            <div className="p-4 text-center text-gray-500">Loading conversations...</div>
                        ) : filteredConversations.length > 0 ? (
                            filteredConversations.map((conversation) => (
                                <div 
                                    key={conversation.id}
                                    className={`flex items-center w-full hover:bg-gray-300 cursor-pointer transition duration-200 p-3 ${
                                        selectedConversation?.id === conversation.id ? 'bg-gray-200' : ''
                                    }`}
                                    onClick={() => handleConversationClick(conversation)}
                                >
                                    <div className="shrink-0 mr-3 relative">
                                        <img
                                            src={conversation.other_user.avatar_url || '/default-avatar.png'} 
                                            alt={conversation.other_user.username || 'User'} 
                                            className="w-10 h-10 rounded-full object-cover shadow-md"
                                        />
                                        {conversation.unread_count > 0 && (
                                            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                                {conversation.unread_count}
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-sm lg:text-base text-gray-900 truncate mb-1">
                                            {conversation.other_user.username || conversation.other_user.full_name}
                                        </div>
                                        <div className="text-xs lg:text-sm text-gray-600 truncate">
                                            {conversation.last_message || 'No messages yet'}
                                        </div>
                                        {conversation.item && (
                                            <div className="text-xs text-blue-600 truncate">
                                                About: {conversation.item.title}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-4 text-center text-gray-500">
                                No conversations found
                            </div>
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 m-0 flex flex-col">
                    {/* Chat Header */}
                    <div className="h-16 p-4 bg-gray-50 border-b border-gray-200 flex items-center shrink-0">
                        {selectedConversation ? (
                            <div className="flex items-center min-w-0">
                                <img
                                    src={selectedConversation.other_user.avatar_url || '/default-avatar.png'}
                                    alt={selectedConversation.other_user.username || 'User'}
                                    className="w-8 h-8 rounded-full object-cover shadow-md mr-3 shrink-0"
                                />
                                <div>
                                    <span className="font-semibold text-base lg:text-lg text-gray-900 block">
                                        {selectedConversation.other_user.username || selectedConversation.other_user.full_name}
                                    </span>
                                    {selectedConversation.item && (
                                        <span className="text-xs text-gray-500">
                                            About: {selectedConversation.item.title}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <span className="text-gray-500 text-sm lg:text-base">
                                Select a chat to start messaging
                            </span>
                        )}
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 bg-white">
                        {selectedConversation ? (
                            loadingMessages ? (
                                <div className="flex justify-center items-center h-full">
                                    <div className="text-gray-500">Loading messages...</div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {messages.map((message) => (
                                        <div 
                                            key={message.id}
                                            className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                                message.sender_id === user?.id 
                                                    ? 'bg-blue-600 text-white' 
                                                    : 'bg-gray-200 text-gray-800'
                                            }`}>
                                                <p className="text-sm">{message.content}</p>
                                                <p className={`text-xs mt-1 ${
                                                    message.sender_id === user?.id 
                                                        ? 'text-blue-100' 
                                                        : 'text-gray-500'
                                                }`}>
                                                    {new Date(message.created_at).toLocaleTimeString([], { 
                                                        hour: '2-digit', 
                                                        minute: '2-digit' 
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                            )
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                <p className="text-sm lg:text-base">
                                    Select a conversation to start chatting
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Message Input */}
                    {selectedConversation && (
                        <div className="p-4 border-t border-gray-200 bg-white">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Type a message..."
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <button
                                    onClick={sendMessage}
                                    disabled={!newMessage.trim()}
                                    className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <IoMdSend className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}