"use client"
import { RealtimeChat } from "@/components/realtime-chat";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { IoIosSearch } from "react-icons/io";

export default function liveChat() {
    const [username, setUsername] = useState("");
    return (

        <div className="h-screen w-screen">
            {/* HEADER */}
            <header className="h-1/12">HEADER</header>

            <div className="flex h-11/12">
                {/* side panel that shows user chats */}
                <div className="border border-solid w-3/12 m-0 bg-[#FFFBDE]">

                    <div className="font-bold text-3xl h-1/12 pt-3 px-3">Inbox</div>

                    {/* Profile search */}
                    <div className="flex border rounded justify-center items-center m-3 p-1 bg-[#FFFFFF]">
                        <IoIosSearch/>
                        <input 
                            className="w-full focus:outline-none focus:border-none" 
                            type="text" 
                            placeholder="Search chats"
                        />
                    </div>
                    
                    {/* going to contain different chats */}
                    <div className="w-full h-9.5/12 p-3">chat profiles</div>

                </div>

                <div className="w-10/12 m-0">
                    {/* <div className="border rounded h-1/12">Username</div> */}
                    <Input 
                        className="w-12/12 h-1/12 focus:outline-none focus:border-none"
                        placeholder="Enter username"
                        value = {username}
                        onChange = {(e) => setUsername(e.target.value)}
                    />

                    <div className="border-t border-l border-gray-200  h-11/12 p-2">
                        <RealtimeChat roomName="my-chat-room" username={username} />
                        
                    </div>
                </div>
            </div>
        </div>
    ) 
}
