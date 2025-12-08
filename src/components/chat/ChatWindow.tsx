"use client";

import { ChatRoom } from "@/lib/schema";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { useUser } from "@clerk/nextjs";
import type { InstanceOfSchema } from "jazz-tools";
import { useRouter } from "next/navigation";

interface ChatWindowProps {
  chatRoom: InstanceOfSchema<typeof ChatRoom>;
}

export function ChatWindow({ chatRoom }: ChatWindowProps) {
  const { user } = useUser();
  const router = useRouter();

  if (!user) return null;

  return (
    <div className="flex-1 flex flex-col h-full bg-background">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border flex justify-between items-start bg-background z-10">
         <div>
            <button 
               onClick={() => router.push('/chat')}
               className="md:hidden text-xs font-sans uppercase tracking-widest text-muted-foreground mb-2"
            >
               &larr; Back to Directory
            </button>
            <h1 className="text-3xl font-serif font-bold text-foreground">
               {chatRoom.name}
            </h1>
            <div className="flex gap-4 mt-2 text-xs font-sans uppercase tracking-widest text-muted-foreground">
               <span>{chatRoom.participants?.length ?? 0} Voices</span>
               <span>&bull;</span>
               <span>{chatRoom.isPublic ? "Public Domain" : "Private Session"}</span>
            </div>
            {chatRoom.description && (
               <p className="mt-4 text-sm font-serif italic text-foreground/80 max-w-2xl">
                  {chatRoom.description}
               </p>
            )}
         </div>
      </div>

      {/* Messages */}
      <MessageList
        messages={chatRoom.messages.$isLoaded ? [...chatRoom.messages] : []}
        currentUserId={user.id}
      />

      {/* Input */}
      <MessageInput chatRoom={chatRoom} />
    </div>
  );
}