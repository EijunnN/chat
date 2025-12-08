"use client";

import { useState } from "react";
import { Group } from "jazz-tools";
import { ChatRoom, Message, PublicChatRegistry } from "@/lib/schema";
import { useUserProfile } from "@/lib/jazz";
import { useUser } from "@clerk/nextjs";
import { Dialog } from "@base-ui-components/react/dialog";
import type { InstanceOfSchema } from "jazz-tools";
import { useCoState } from "jazz-tools/react";

interface CreateChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChatCreated: (chatRoom: InstanceOfSchema<typeof ChatRoom>) => void;
}

export function CreateChatModal({
  isOpen,
  onClose,
  onChatCreated,
}: CreateChatModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const profile = useUserProfile();
  const { user } = useUser();
  const registryId = process.env.NEXT_PUBLIC_JAZZ_PUBLIC_REGISTRY_ID;
  const publicRegistry = registryId
    ? useCoState(PublicChatRegistry, registryId, { resolve: { $each: true } })
    : undefined;

  const handleCreate = async () => {
    if (!name.trim() || !profile || !user) return;
    setIsCreating(true);

    try {
      const chatGroup = Group.create();
      chatGroup.makePublic("writer");

      const chatRoom = ChatRoom.create(
        {
          name: name.trim(),
          description: description.trim(),
          createdAt: Date.now(),
          createdBy: user.id,
          participants: [user.id],
          messages: [],
          isPublic: !isPrivate,
          lastMessageAt: Date.now(),
        },
        chatGroup
      );

      const welcomeMessage = Message.create(
        {
          text: `The session "${name.trim()}" has commenced.`,
          author: "system",
          authorName: "System",
          authorImage: "",
          timestamp: Date.now(),
          edited: false,
          attachmentURLs: [],
        },
        chatGroup
      );

      chatRoom.messages.$jazz.push(welcomeMessage);
      chatRoom.$jazz.set("lastMessageAt", Date.now());
      profile.chatRooms.$jazz.push(chatRoom);

      if (!isPrivate && publicRegistry?.$isLoaded) {
        publicRegistry.$jazz.push(chatRoom);
      }

      onChatCreated(chatRoom);
      setName("");
      setDescription("");
      setIsPrivate(false);
      onClose();
    } catch (error) {
      console.error("Failed to create chat room:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 transition-all duration-200" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background border-2 border-foreground w-full max-w-lg p-8 z-50 shadow-[8px_8px_0px_0px_var(--color-foreground)] outline-none">
          
          <Dialog.Title className="text-2xl font-serif font-bold mb-6 pb-2 border-b border-border">
            Establish New Channel
          </Dialog.Title>

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-sans uppercase tracking-widest mb-2 font-bold">
                Channel Designation
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Literary Discussion"
                className="w-full bg-secondary/30 border border-border px-4 py-3 focus:border-foreground outline-none font-serif transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-sans uppercase tracking-widest mb-2 font-bold">
                Brief
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Purpose of this channel..."
                rows={3}
                className="w-full bg-secondary/30 border border-border px-4 py-3 resize-none focus:border-foreground outline-none font-serif transition-colors"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                id="private"
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="w-4 h-4 border border-foreground rounded-none accent-foreground"
              />
              <label htmlFor="private" className="text-sm font-serif italic text-muted-foreground select-none">
                Make this a private session
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8 pt-4 border-t border-border">
            <button
              onClick={onClose}
              disabled={isCreating}
              className="px-6 py-2 text-xs font-sans uppercase tracking-widest hover:underline underline-offset-4"
            >
              Discard
            </button>
            <button
              onClick={handleCreate}
              disabled={!name.trim() || isCreating}
              className="px-6 py-2 bg-foreground text-background text-xs font-sans uppercase tracking-widest hover:opacity-90 disabled:opacity-50"
            >
              {isCreating ? "Processing..." : "Confirm"}
            </button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}