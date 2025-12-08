"use client";

import { useState, useRef } from "react";
import { ChatRoom, Message } from "@/lib/schema";
import { useAuth, useUser } from "@clerk/nextjs";
import type { InstanceOfSchema } from "jazz-tools";

interface MessageInputProps {
  chatRoom: InstanceOfSchema<typeof ChatRoom>;
}

export function MessageInput({ chatRoom }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useUser();
  
  // Verificamos si la lista de mensajes está cargada antes de permitir enviar
  const messagesLoaded = chatRoom.messages?.$isLoaded;

  const handleSend = async () => {
    // 🟢 CORRECCIÓN: Usamos explícitamente el 'owner' (Grupo) de la sala de chat.
    // Esto asegura que el mensaje se cree en el mismo grupo compartido que la sala.
    const chatGroup = chatRoom.$jazz.owner;

    if (!message.trim() || !user || !chatGroup) return;
    if (!messagesLoaded) return;

    setIsSending(true);

    try {
      // Create new message
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
        // 🟢 FORZAMOS el grupo aquí. Si esto falla, el mensaje no se envía,
        // evitando que se creen mensajes "fantasmas" privados.
        chatGroup
      );

      // Add message to chat room
      // Usamos push directamente si es una lista CoValue
      chatRoom.messages.$jazz.push(newMessage);

      // Update last message timestamp
      // Usamos el setter de Jazz para actualizar la propiedad
      chatRoom.$jazz.set("lastMessageAt", Date.now());

      // Clear input
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

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !user) return;

    for (const file of files) {
      // TODO: Implement file upload to storage service
      console.log("File upload not implemented yet:", file);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="border-t border-border p-4">
      <div className="flex gap-2 items-end">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx"
          className="hidden"
          onChange={handleFileSelect}
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          title="Attach file"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
            />
          </svg>
        </button>

        <div className="flex-1">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="w-full px-4 py-2 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-card text-foreground"
            rows={1}
            disabled={isSending || !messagesLoaded}
          />
        </div>

        <button
          type="button"
          onClick={handleSend}
          disabled={!message.trim() || isSending || !messagesLoaded}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSending ? (
            <svg
              className="animate-spin h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}