"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ChatRoom, PublicChatRegistry } from "@/lib/schema";
import { useUserProfile } from "@/lib/jazz";
import { CreateChatModal } from "./CreateChatModal";
import type { InstanceOfSchema } from "jazz-tools";
import { useCoState } from "jazz-tools/react";
import { Group } from "jazz-tools";

export function ChatRoomList() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"my" | "public">("my");
  const profile = useUserProfile();
  const router = useRouter();
  const params = useParams();
  const currentRoomId = params?.roomId as string;
  
  const registryId = process.env.NEXT_PUBLIC_JAZZ_PUBLIC_REGISTRY_ID;
  const publicRegistry = registryId
    ? useCoState(PublicChatRegistry, registryId, { resolve: { $each: true } })
    : undefined;
  const registryAvailable = publicRegistry?.$isLoaded === true;

  const handleChatCreated = (chatRoom: InstanceOfSchema<typeof ChatRoom>) => {
    router.push(`/chat/${chatRoom.$jazz.id}`);
  };

  if (!profile) return null;

  const myRooms = profile.chatRooms?.filter(
    (room): room is InstanceOfSchema<typeof ChatRoom> => Boolean(room?.$isLoaded)
  ) || [];
  
  const publicRooms = registryAvailable && Array.isArray(publicRegistry)
    ? publicRegistry.filter((room): room is InstanceOfSchema<typeof ChatRoom> => Boolean(room?.$isLoaded))
    : [];

  const roomsToShow = activeTab === "my" ? myRooms : publicRooms;

  return (
    <>
      <div className="h-full flex flex-col bg-background">
        {/* Header / Tabs */}
        <div className="p-6 pb-2 border-b-2 border-foreground">
          <h2 className="text-2xl font-bold font-serif mb-4">Directory</h2>
          <div className="flex gap-4 border-b border-border pb-px">
             <button
                onClick={() => setActiveTab("my")}
                className={`text-xs font-sans uppercase tracking-widest pb-2 -mb-[1px] transition-colors ${
                   activeTab === "my" 
                   ? "border-b-2 border-foreground text-foreground" 
                   : "text-muted-foreground hover:text-foreground"
                }`}
             >
                My Channels
             </button>
             <button
                onClick={() => setActiveTab("public")}
                className={`text-xs font-sans uppercase tracking-widest pb-2 -mb-[1px] transition-colors ${
                   activeTab === "public" 
                   ? "border-b-2 border-foreground text-foreground" 
                   : "text-muted-foreground hover:text-foreground"
                }`}
             >
                Public Wire
             </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-6 pt-4">
           {roomsToShow.length === 0 ? (
              <div className="text-center py-10">
                 <p className="text-muted-foreground font-serif italic text-sm">No records found.</p>
              </div>
           ) : (
              <ul className="space-y-4">
                 {roomsToShow.map((room) => {
                    const isActive = room.$jazz.id === currentRoomId;
                    return (
                       <li key={room.$jazz.id}>
                          <button
                             onClick={() => router.push(`/chat/${room.$jazz.id}`)}
                             className={`w-full text-left group`}
                          >
                             <div className={`flex items-baseline justify-between border-b ${isActive ? 'border-foreground' : 'border-border group-hover:border-foreground'} pb-1 transition-colors`}>
                                <span className={`font-serif font-bold text-lg ${isActive ? 'text-foreground' : 'text-foreground/80'}`}>
                                   {room.name}
                                </span>
                                {room.isPublic ? (
                                   <span className="text-[10px] font-sans uppercase tracking-widest text-muted-foreground">PUB</span>
                                ) : (
                                   <span className="text-[10px] font-sans uppercase tracking-widest text-muted-foreground">PVT</span>
                                )}
                             </div>
                             {room.description && (
                                <p className="text-sm text-muted-foreground font-serif mt-1 line-clamp-1 italic">
                                   {room.description}
                                </p>
                             )}
                          </button>
                       </li>
                    );
                 })}
              </ul>
           )}
        </div>

        {/* Footer Action */}
        <div className="p-6 border-t border-border">
           <button
              onClick={() => setIsCreateModalOpen(true)}
              className="w-full py-3 bg-foreground text-background text-xs font-sans uppercase tracking-widest hover:opacity-90 transition-opacity"
           >
              Compose New Channel
           </button>
        </div>
      </div>

      <CreateChatModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onChatCreated={handleChatCreated}
      />
    </>
  );
}