"use client";

import { useState } from "react";
import { Group } from "jazz-tools";
import { ChatRoom, Message, PublicChatRegistry } from "@/lib/schema";
import { useUserProfile } from "@/lib/jazz";
import { useUser } from "@clerk/nextjs";
import { Dialog } from "@base-ui-components/react/dialog";
import { Input } from "@base-ui-components/react/input";
import { Button } from "@base-ui-components/react/button";
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
      // Create a new group for the chat room
      const chatGroup = Group.create();
      chatGroup.makePublic("writer");

      // Create the chat room
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

      // Add welcome message
      const welcomeMessage = Message.create(
        {
          text: `Welcome to "${name.trim()}!" This is the beginning of your conversation.`,
          author: "system",
          authorName: "System",
          authorImage: user.imageUrl || "",
          timestamp: Date.now(),
          edited: false,
          attachmentURLs: [],
        },
        chatGroup
      );

      chatRoom.messages.$jazz.push(welcomeMessage);
      chatRoom.$jazz.set("lastMessageAt", Date.now());

      // Add chat room to user's profile
      profile.chatRooms.$jazz.push(chatRoom);

      // If public, publish into the public registry (best effort)
      if (!isPrivate && publicRegistry?.$isLoaded) {
        publicRegistry.$jazz.push(chatRoom);
      }

      // Callback with the created chat room
      onChatCreated(chatRoom);

      // Reset form and close modal
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
        <Dialog.Backdrop className="fixed inset-0 bg-black bg-opacity-50 z-40" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-card text-foreground rounded-lg max-w-md w-full p-6 z-50 border border-border shadow-md">
          <Dialog.Title className="text-xl font-semibold mb-4">
            Create New Chat Room
          </Dialog.Title>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-foreground mb-1"
              >
                Name *
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter chat room name"
                maxLength={100}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-card text-foreground"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-foreground mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What's this chat about?"
                rows={3}
                maxLength={300}
                className="w-full px-3 py-2 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-card text-foreground"
              />
            </div>

            <div className="flex items-center">
              <input
                id="private"
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="private" className="text-sm text-foreground">
                Private chat room (only invited users can join)
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              type="button"
              onClick={onClose}
              disabled={isCreating}
              className="px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleCreate}
              disabled={!name.trim() || isCreating}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isCreating ? "Creating..." : "Create"}
            </Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
