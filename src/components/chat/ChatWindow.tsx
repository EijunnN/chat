"use client";

import { ChatRoom } from "@/lib/schema";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { useUser } from "@clerk/nextjs";
import type { InstanceOfSchema } from "jazz-tools";

interface ChatWindowProps {
  chatRoom: InstanceOfSchema<typeof ChatRoom>;
}

export function ChatWindow({ chatRoom }: ChatWindowProps) {
  const { user } = useUser();

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">Please sign in to view messages</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Chat header */}
      <div className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              {chatRoom.name}
            </h2>
            {chatRoom.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {chatRoom.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{chatRoom.participants?.length ?? 0} participants</span>
            {!chatRoom.isPublic && (
              <span className="px-2 py-1 bg-accent text-accent-foreground rounded-full text-xs">
                Private
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <MessageList
        messages={chatRoom.messages.$isLoaded ? [...chatRoom.messages] : []}
        currentUserId={user.id}
      />

      {/* Message input */}
      <MessageInput chatRoom={chatRoom} />
    </div>
  );
}
