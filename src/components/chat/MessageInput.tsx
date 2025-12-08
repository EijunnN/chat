"use client";

import { useState, useRef } from "react";
import { ChatRoom, Message } from "@/lib/schema";
import { useUser } from "@clerk/nextjs";
import type { InstanceOfSchema } from "jazz-tools";

interface MessageInputProps {
  chatRoom: InstanceOfSchema<typeof ChatRoom>;
}

export function MessageInput({ chatRoom }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useUser();
  
  const messagesLoaded = chatRoom.messages?.$isLoaded;

  const handleSend = async () => {
    const chatGroup = chatRoom.$jazz.owner;

    if (!message.trim() || !user || !chatGroup) return;
    if (!messagesLoaded) return;

    setIsSending(true);

    try {
      const newMessage = Message.create(
        {
          text: message.trim(),
          author: user.id,
          authorName: user.fullName || user.username || "Anonymous",
          authorImage: user.imageUrl || "",
          attachmentURLs: [],
          timestamp: Date.now(),
          edited: false,
        },
        chatGroup
      );

      chatRoom.messages.$jazz.push(newMessage);
      chatRoom.$jazz.set("lastMessageAt", Date.now());
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-6 border-t border-border bg-background">
      <div className="flex gap-4 items-start max-w-4xl mx-auto">
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
        />
        
        {/* Input Area */}
        <div className="flex-1 relative">
           <textarea
             value={message}
             onChange={(e) => setMessage(e.target.value)}
             onKeyDown={handleKeyPress}
             placeholder="Type your correspondence..."
             className="w-full bg-transparent border-b border-border focus:border-foreground py-2 px-0 resize-none outline-none font-serif text-lg min-h-[3rem] transition-colors placeholder:text-muted-foreground/50"
             rows={1}
             disabled={isSending || !messagesLoaded}
           />
        </div>

        {/* Send Button */}
        <button
          type="button"
          onClick={handleSend}
          disabled={!message.trim() || isSending || !messagesLoaded}
          className="px-6 py-2 bg-foreground text-background font-sans uppercase text-xs font-bold tracking-widest hover:opacity-90 disabled:opacity-50 transition-all h-10 flex items-center justify-center min-w-[100px]"
        >
          {isSending ? "Sending..." : "Publish"}
        </button>
      </div>
    </div>
  );
}