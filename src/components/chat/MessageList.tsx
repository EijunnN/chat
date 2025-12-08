"use client";

import { useEffect, useRef } from "react";
import { Message as MessageType } from "@/lib/schema";
import { Message } from "./Message";
import type { InstanceOfSchema } from "jazz-tools";

interface MessageListProps {
  messages: InstanceOfSchema<typeof MessageType>[] | undefined;
  currentUserId: string;
}

export function MessageList({ messages, currentUserId }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!messages || messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 opacity-50">
        <div className="text-center font-serif italic">
          <p>The page is blank.</p>
          <p className="text-sm mt-1">Be the first to write.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 md:pr-12 space-y-8">
      {messages.map((message) => (
        <Message
          key={message.$jazz.id}
          message={message}
          isOwn={message.author === currentUserId}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}