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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!messages || messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground text-center">
          No messages yet. Start the conversation!
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2">
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