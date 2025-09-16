"use client"
import { RealtimeChat } from "@/components/realtime-chat";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { IoIosSearch } from "react-icons/io";
import Navbar from "@/component/Navbar";
import { useRouter } from 'next/navigation';

// Define the ChatItem type
interface ChatItem {
    id: number;
    name: string;
    message: string;
    image: string;
    alt: string;
}

export default function LiveChat() {
    const [username, setUsername] = useState<string>("");
    const [selectedUser, setSelectedUser] = useState<ChatItem | null>(null);
    const router = useRouter();

    // Sample chat data - you can replace this with your actual data
    const chatItems: ChatItem[] = [
        {
            id: 1,
            name: "Jordan Martinez",
            message: "Yes, this book is available for pickup tomorrow",
            image: "/inbox_book.jpg",
            alt: "book"
        },
        {
            id: 2,
            name: "Donald Duck", 
            message: "The vintage lamp is still in great condition",
            image: "/inbox_lamp.png",
            alt: "lamp"
        },
        {
            id: 3,
            name: "Madison Taylor",
            message: "Would you take it for 10 dollars instead?",
            image: "/inbox_jeans.jpg",
            alt: "jean"
        },
        {
            id: 4,
            name: "Emily Chen",
            message: "Hi, is this tennis racket still available?",
            image: "/inbox_tennisracket.jpg",
            alt: "tennis racket"
        }
    ];

    const handleChatItemClick = (chatItem: ChatItem) => {
        setSelectedUser(chatItem);
    };

    return (
        <div className="h-screen w-screen">
            {/* HEADER */}
            <Navbar />

            <div className="flex h-11/12">
                {/* side panel that shows user chats */}
                <div className="w-80 min-w-64 max-w-96 m-0 bg-[#FFFBDE] flex flex-col">
                    <div className="font-bold text-2xl lg:text-3xl pt-3 px-3 pb-2 shrink-0">
                        Inbox
                    </div>

                    {/* Profile search */}
                    <div className="flex rounded justify-center items-center mx-3 mb-3 p-2 bg-[#FFFFFF] shrink-0">
                        <IoIosSearch className="text-gray-500 mr-2 shrink-0"/>
                        <input 
                            className="w-full focus:outline-none focus:border-none text-sm" 
                            type="text" 
                            placeholder="Search chats"
                        />
                    </div>
                    
                    {/* Chat items container with proper scrolling */}
                    <div className="flex-1 overflow-y-auto">
                        {chatItems.map((item) => (
                            <div 
                                key={item.id}
                                className={`flex items-center w-full hover:bg-gray-300 cursor-pointer transition duration-200 p-3 ${
                                    selectedUser?.id === item.id ? 'bg-gray-200' : ''
                                }`}
                                onClick={() => handleChatItemClick(item)}
                            >
                                {/* Avatar - fixed size */}
                                <div className="shrink-0 mr-3">
                                    <img
                                        src={item.image} 
                                        alt={item.alt} 
                                        className="w-10 h-10 rounded-full object-cover shadow-md"
                                    />
                                </div>
                                
                                {/* Text content - flexible with proper overflow handling */}
                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-sm lg:text-base text-gray-900 truncate mb-1">
                                        {item.name}
                                    </div>
                                    <div className="text-xs lg:text-sm text-gray-600 truncate">
                                        {item.message}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex-1 m-0 flex flex-col">
                    {/* Display selected user's name instead of input */}
                    <div className="h-16 p-4 bg-gray-50 border-b border-gray-200 flex items-center shrink-0">
                        {selectedUser ? (
                            <div className="flex items-center min-w-0">
                                <img
                                    src={selectedUser.image}
                                    alt={selectedUser.alt}
                                    className="w-8 h-8 rounded-full object-cover shadow-md mr-3 shrink-0"
                                />
                                <span className="font-semibold text-base lg:text-lg text-gray-900 truncate">
                                    {selectedUser.name}
                                </span>
                            </div>
                        ) : (
                            <span className="text-gray-500 text-sm lg:text-base">
                                Select a chat to start messaging
                            </span>
                        )}
                    </div>

                    <div className="flex-1 border-gray-200 p-2">
                        {selectedUser ? (
                            <RealtimeChat 
                                roomName={`chat-${selectedUser.id}`} 
                                username={username || "Anonymous"} 
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                <p className="text-sm lg:text-base">
                                    Select a conversation to start chatting
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    ) 
}