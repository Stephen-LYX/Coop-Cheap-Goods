// "use client"
// import { RealtimeChat } from "@/components/realtime-chat";
// import { Input } from "@/components/ui/input";
// import { useState } from "react";
// import { IoIosSearch } from "react-icons/io";
// import Navbar from "@/component/Navbar";
// import { useRouter } from 'next/navigation';

// export default function liveChat() {
//     const [username, setUsername] = useState("");
//     const router = useRouter();
//     return (

//         <div className="h-screen w-screen">
//             {/* HEADER */}
//             {/* <header className="h-1/12">HEADER</header> */}
//             <Navbar />

//             <div className="flex h-11/12">
//                 {/* side panel that shows user chats */}
//                 <div className="w-2/12 m-0 bg-[#FFFBDE]">

//                     <div className="font-bold text-3xl h-1/12 pt-3 px-3">Inbox</div>

//                     {/* Profile search */}
//                     <div className="flex rounded justify-center items-center m-3 p-1 bg-[#FFFFFF]">
//                         <IoIosSearch/>
//                         <input 
//                             className="w-full focus:outline-none focus:border-none" 
//                             type="text" 
//                             placeholder="Search chats"
//                         />
//                     </div>
                    
//                     {/* going to contain different chats */}
//                     <div className="w-full h-[80%] [&>div]:h-15 [&>div]:text-lg [&>div]:mb-2">
//                         <div className="flex items-center w-full hover:bg-gray-300 cursor-pointer transition duration-200">
//                             <img
//                                 src="/inbox_book.jpg" 
//                                 alt="book" 
//                                 className="w-10 h-10 rounded-full object-cover shadow-md  m-4"
//                             />
//                             <div className="p-3">
//                                 <div className="font-bold">Jordan Martinez</div>
//                                 <div className="max-w-full text-sm">Yes, this book is availabl...</div>
//                             </div>
//                         </div>

//                         {/* item 2 */}
//                         <div className="flex items-center w-full hover:bg-gray-300 cursor-pointer transition duration-200">
//                             <img
//                                 src="/inbox_lamp.png" 
//                                 alt="lamp" 
//                                 className="w-10 h-10 rounded-full object-cover shadow-md  m-4"
//                             />
//                             <div className="p-3">
//                                 <div className="font-bold">Jordan Martinez</div>
//                                 <div className="max-w-full text-sm">Yes, this book is availabl...</div>
//                             </div>
//                         </div>
//                         {/* item 3 */}
//                         <div className="flex items-center w-full hover:bg-gray-300 cursor-pointer transition duration-200">
//                             <img
//                                 src="/inbox_jeans.jpg" 
//                                 alt="jean" 
//                                 className="w-10 h-10 rounded-full object-cover shadow-md  m-4"
//                             />
//                             <div className="p-3">
//                                 <div className="font-bold">Madison Taylor</div>
//                                 <div className="max-w-full text-sm">Would you take it for 10...</div>
//                             </div>
//                         </div>

//                         {/* item 4 */}
//                         <div className="flex items-center w-full hover:bg-gray-300 cursor-pointer transition duration-200">
//                             <img
//                                 src="/inbox_tennisracket.jpg" 
//                                 alt="tennis" 
//                                 className="w-10 h-10 rounded-full object-cover shadow-md  m-4"
//                             />
//                             <div className="p-3">
//                                 <div className="font-bold">Emily Chen</div>
//                                 <div className="max-w-full text-sm">Hi, is this available?</div>
//                             </div>
//                         </div>
//                     </div>

//                 </div>

//                 <div className="w-10/12 m-0">
//                     {/* <div className="border rounded h-1/12">Username</div> */}
                    
//                     <input 
//                         className="w-12/12 h-1/12 focus:outline-none focus:border-none p-4" 
//                         type="text" 
//                         value={username}
//                         onChange={(e) => setUsername(e.target.value)}
//                         placeholder="Enter Username"
//                     />

//                     <div className=" border-gray-200  h-11/12 p-2">
//                         <RealtimeChat roomName="my-chat-room" username={username} />
                        
//                     </div>
//                 </div>
//             </div>
//         </div>
//     ) 
// }


// // "use client"
// // import { RealtimeChat } from "@/components/realtime-chat";
// // import { useSearchParams } from "next/navigation";
// // import Image from "next/image";
// // import { createClient } from "@/utils/supabase/client";
// // import { useEffect, useState } from "react";

// // export default function LiveChat() {
// //     const searchParams = useSearchParams();
// //     const buyerId = searchParams.get("buyerId");
// //     const buyerName = searchParams.get("buyerName");
// //     const buyerAvatar = searchParams.get("buyerAvatar");

// //     const supabase = createClient();
// //     const [username, setUsername] = useState<string>("");
// //     const [userId, setUserId] = useState<string>("");
// //     useEffect(() => {
// //         const getUser = async () => {
// //         const { data: { user } } = await supabase.auth.getUser();
// //         if (user) {
// //             setUserId(user.id);
// //             setUsername(user.user_metadata.username || user.email || "Anonymous");
// //         }
// //         };
// //         getUser();
// //     }, [supabase]);

// //     // if (!buyerId) {
// //     //     return <div>No buyer selected.</div>;
// //     // }
// //     return (
        
// //         <div className="h-screen w-screen">
// //         {/* HEADER */}
// //         <header className="h-1/12">HEADER</header>

// //         <div className="flex h-11/12">
// //             {/* side panel */}
// //             <div className="border border-solid w-3/12 m-0 bg-[#FFFBDE]">
// //             <div className="font-bold text-3xl h-1/12 pt-3 px-3">Inbox</div>
// //             <div className="flex border rounded justify-center items-center m-3 p-1 bg-[#FFFFFF]">
// //                 <input
// //                 className="w-full focus:outline-none focus:border-none"
// //                 type="text"
// //                 placeholder="Search chats"
// //                 />
// //             </div>
// //             <div className="w-full h-9.5/12 p-3">chat profiles</div>
// //             </div>

// //             {/* chat panel */}
// //             <div className="w-10/12 m-0">
// //             {/* Top bar showing buyer info */}
// //             <div className="flex items-center border-b h-1/12 px-4">
// //                 {buyerAvatar && (
// //                 <Image
// //                     src={buyerAvatar}
// //                     alt={buyerName ?? "Buyer"}
// //                     width={40}
// //                     height={40}
// //                     className="rounded-full"
// //                 />
// //                 )}
// //                 <span className="ml-3 font-semibold">{buyerName}</span>
// //             </div>

// //             {/* Chat box */}
// //             <div className="border-t border-l border-gray-200 h-11/12 p-2">
// //                 {/* {buyerId ? (
// //                     <RealtimeChat
// //                         roomName={`chat-${buyerId}`}
// //                         receiverId={buyerId}
// //                     />
// //                 ) : (
// //                     <div className="p-4">No buyer selected.</div>
// //                 )} */}
// //                 <RealtimeChat 
// //                     roomName={`chat-${buyerId}`} 
// //                     username={username}   // probably from Supabase session
// //                     senderId={userId}    // logged-in user id
// //                     receiverId={buyerId as string} 
// //                 />


// //             </div>
// //             </div>
// //         </div>
// //     </div>
// //   );
// // }

// code below is hard code
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

export default function liveChat() {
    const [username, setUsername] = useState<string>("");
    const [selectedUser, setSelectedUser] = useState<ChatItem | null>(null);
    const router = useRouter();

    // Sample chat data - you can replace this with your actual data
    const chatItems: ChatItem[] = [
        {
            id: 1,
            name: "Jordan Martinez",
            message: "Yes, this book is availabl...",
            image: "/inbox_book.jpg",
            alt: "book"
        },
        {
            id: 2,
            name: "Donald Duck", 
            message: "Yes, this book is availabl...",
            image: "/inbox_lamp.png",
            alt: "lamp"
        },
        {
            id: 3,
            name: "Madison Taylor",
            message: "Would you take it for 10...",
            image: "/inbox_jeans.jpg",
            alt: "jean"
        },
        {
            id: 4,
            name: "Emily Chen",
            message: "Hi, is this available?",
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
                <div className="w-2/12 m-0 bg-[#FFFBDE]">
                    <div className="font-bold text-3xl h-1/12 pt-3 px-3">Inbox</div>

                    {/* Profile search */}
                    <div className="flex rounded justify-center items-center m-3 p-1 bg-[#FFFFFF]">
                        <IoIosSearch/>
                        <input 
                            className="w-full focus:outline-none focus:border-none" 
                            type="text" 
                            placeholder="Search chats"
                        />
                    </div>
                    
                    {/* going to contain different chats */}
                    <div className="w-full h-[80%] [&>div]:h-15 [&>div]:text-lg [&>div]:mb-2">
                        {chatItems.map((item) => (
                            <div 
                                key={item.id}
                                className={`flex items-center w-full hover:bg-gray-300 cursor-pointer transition duration-200 ${
                                    selectedUser?.id === item.id ? 'bg-gray-200' : ''
                                }`}
                                onClick={() => handleChatItemClick(item)}
                            >
                                <img
                                    src={item.image} 
                                    alt={item.alt} 
                                    className="w-10 h-10 rounded-full object-cover shadow-md m-4"
                                />
                                <div className="p-3">
                                    <div className="font-bold">{item.name}</div>
                                    <div className="max-w-full text-sm">{item.message}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="w-10/12 m-0">
                    {/* Display selected user's name instead of input */}
                    <div className="w-full h-1/12 p-4 bg-gray-50 border-b border-gray-200 flex items-center">
                        {selectedUser ? (
                            <div className="flex items-center">
                                <img
                                    src={selectedUser.image}
                                    alt={selectedUser.alt}
                                    className="w-8 h-8 rounded-full object-cover shadow-md mr-3"
                                />
                                <span className="font-semibold text-lg">{selectedUser.name}</span>
                            </div>
                        ) : (
                            <span className="text-gray-500">Select a chat to start messaging</span>
                        )}
                    </div>

                    <div className="border-gray-200 h-11/12 p-2">
                        {selectedUser ? (
                            <RealtimeChat 
                                roomName={`chat-${selectedUser.id}`} 
                                username={username || "Anonymous"} 
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                <p>Select a conversation to start chatting</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    ) 
}