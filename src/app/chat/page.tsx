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


// "use client"
// import { RealtimeChat } from "@/components/realtime-chat";
// import { useSearchParams } from "next/navigation";
// import Image from "next/image";
// import { createClient } from "@/utils/supabase/client";
// import { useEffect, useState } from "react";

// export default function LiveChat() {
//     const searchParams = useSearchParams();
//     const buyerId = searchParams.get("buyerId");
//     const buyerName = searchParams.get("buyerName");
//     const buyerAvatar = searchParams.get("buyerAvatar");

//     const supabase = createClient();
//     const [username, setUsername] = useState<string>("");
//     const [userId, setUserId] = useState<string>("");
//     useEffect(() => {
//         const getUser = async () => {
//         const { data: { user } } = await supabase.auth.getUser();
//         if (user) {
//             setUserId(user.id);
//             setUsername(user.user_metadata.username || user.email || "Anonymous");
//         }
//         };
//         getUser();
//     }, [supabase]);

//     // if (!buyerId) {
//     //     return <div>No buyer selected.</div>;
//     // }
//     return (
        
//         <div className="h-screen w-screen">
//         {/* HEADER */}
//         <header className="h-1/12">HEADER</header>

//         <div className="flex h-11/12">
//             {/* side panel */}
//             <div className="border border-solid w-3/12 m-0 bg-[#FFFBDE]">
//             <div className="font-bold text-3xl h-1/12 pt-3 px-3">Inbox</div>
//             <div className="flex border rounded justify-center items-center m-3 p-1 bg-[#FFFFFF]">
//                 <input
//                 className="w-full focus:outline-none focus:border-none"
//                 type="text"
//                 placeholder="Search chats"
//                 />
//             </div>
//             <div className="w-full h-9.5/12 p-3">chat profiles</div>
//             </div>

//             {/* chat panel */}
//             <div className="w-10/12 m-0">
//             {/* Top bar showing buyer info */}
//             <div className="flex items-center border-b h-1/12 px-4">
//                 {buyerAvatar && (
//                 <Image
//                     src={buyerAvatar}
//                     alt={buyerName ?? "Buyer"}
//                     width={40}
//                     height={40}
//                     className="rounded-full"
//                 />
//                 )}
//                 <span className="ml-3 font-semibold">{buyerName}</span>
//             </div>

//             {/* Chat box */}
//             <div className="border-t border-l border-gray-200 h-11/12 p-2">
//                 {/* {buyerId ? (
//                     <RealtimeChat
//                         roomName={`chat-${buyerId}`}
//                         receiverId={buyerId}
//                     />
//                 ) : (
//                     <div className="p-4">No buyer selected.</div>
//                 )} */}
//                 <RealtimeChat 
//                     roomName={`chat-${buyerId}`} 
//                     username={username}   // probably from Supabase session
//                     senderId={userId}    // logged-in user id
//                     receiverId={buyerId as string} 
//                 />


//             </div>
//             </div>
//         </div>
//     </div>
//   );
// }
