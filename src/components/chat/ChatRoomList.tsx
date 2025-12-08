"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChatRoom, PublicChatRegistry } from "@/lib/schema";
import { useUserProfile } from "@/lib/jazz";
import { CreateChatModal } from "./CreateChatModal";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@base-ui-components/react/button";
import type { InstanceOfSchema } from "jazz-tools";
import { useCoState } from "jazz-tools/react";
import { Group } from "jazz-tools";

export function ChatRoomList() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"my" | "public">("my");
  const [creatingRegistry, setCreatingRegistry] = useState(false);
  const [newRegistryId, setNewRegistryId] = useState<string | null>(null);
  const profile = useUserProfile();
  const router = useRouter();
  const registryId = process.env.NEXT_PUBLIC_JAZZ_PUBLIC_REGISTRY_ID;
  const publicRegistry = registryId
    ? useCoState(PublicChatRegistry, registryId, { resolve: { $each: true } })
    : undefined;
  const registryState = publicRegistry?.$jazz.loadingState;
  const registryAvailable = publicRegistry?.$isLoaded === true;

  const handleChatCreated = (chatRoom: InstanceOfSchema<typeof ChatRoom>) => {
    // Navigate to the newly created chat room
    router.push(`/chat/${chatRoom.$jazz.id}`);
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading your chat rooms...</p>
      </div>
    );
  }

  const myRooms = profile.chatRooms?.filter(
    (room): room is InstanceOfSchema<typeof ChatRoom> =>
      Boolean(room?.$isLoaded)
  );
  const publicRooms =
    registryAvailable && Array.isArray(publicRegistry)
      ? publicRegistry.filter(
          (room): room is InstanceOfSchema<typeof ChatRoom> =>
            Boolean(room?.$isLoaded)
        )
      : [];

  const isMyTab = activeTab === "my";
  const roomsToShow = isMyTab ? myRooms : publicRooms;

  const handleJoinPublic = (room: InstanceOfSchema<typeof ChatRoom>) => {
    if (profile.chatRooms.$isLoaded) {
      const already = profile.chatRooms.some(
        (r) => r?.$isLoaded && r.$jazz.id === room.$jazz.id
      );
      if (!already) {
        profile.chatRooms.$jazz.push(room);
      }
    }
    router.push(`/chat/${room.$jazz.id}`);
  };

  const handleCreateRegistry = async () => {
    try {
      setCreatingRegistry(true);
      const group = Group.create();
      group.makePublic("writer");
      const reg = PublicChatRegistry.create([], group);
      setNewRegistryId(reg.$jazz.id);
      console.info(
        "New public registry created. Set NEXT_PUBLIC_JAZZ_PUBLIC_REGISTRY_ID=",
        reg.$jazz.id
      );
    } catch (err) {
      console.error("Failed to create public registry", err);
    } finally {
      setCreatingRegistry(false);
    }
  };

  return (
    <>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="border-b border-border p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold text-foreground">
                Chat Rooms
              </h1>
              <div className="flex gap-1 rounded-md bg-muted p-1">
                <button
                  className={`px-3 py-1 rounded-md text-sm ${
                    isMyTab
                      ? "bg-card text-foreground shadow"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => setActiveTab("my")}
                >
                  My rooms
                </button>
                <button
                  className={`px-3 py-1 rounded-md text-sm ${
                    !isMyTab
                      ? "bg-card text-foreground shadow"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => setActiveTab("public")}
                >
                  Public
                </button>
              </div>
            </div>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-3 py-1 bg-primary text-primary-foreground text-sm rounded-lg hover:opacity-90 transition-colors"
            >
              New Room
            </Button>
          </div>
        </div>

        {/* Chat rooms list */}
        <div className="flex-1 overflow-y-auto">
          {!registryId && activeTab === "public" ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <p className="text-muted-foreground mb-2">
                Set NEXT_PUBLIC_JAZZ_PUBLIC_REGISTRY_ID to a public registry ID
                to list rooms.
              </p>
              {newRegistryId && (
                <p className="text-xs text-foreground">
                  Nuevo registry creado: <code>{newRegistryId}</code>
                </p>
              )}
            </div>
          ) : registryState === "unavailable" && activeTab === "public" ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 gap-3">
              <p className="text-muted-foreground">
                Public rooms unavailable (registry not found or inaccessible).
              </p>
              <Button
                onClick={handleCreateRegistry}
                disabled={creatingRegistry}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50"
              >
                {creatingRegistry ? "Creating..." : "Create public registry"}
              </Button>
              {newRegistryId && (
                <p className="text-xs text-foreground">
                  Nuevo registry: <code>{newRegistryId}</code> — añade a .env y
                  recarga.
                </p>
              )}
            </div>
          ) : roomsToShow && roomsToShow.length > 0 ? (
            <div className="divide-y">
              {roomsToShow.map((room) => (
                <a
                  key={room.$jazz.id}
                  href={`/chat/${room.$jazz.id}`}
                  className="block p-4 hover:bg-muted transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-foreground truncate">
                          {room.name}
                        </h3>
                        {!room.isPublic && (
                          <span className="px-2 py-0.5 bg-accent text-accent-foreground rounded-full text-xs">
                            Private
                          </span>
                        )}
                      </div>
                      {room.description && (
                        <p className="text-sm text-muted-foreground truncate mt-1">
                          {room.description}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end ml-2 gap-2">
                      <span className="text-xs text-muted-foreground mt-1">
                        {room.participants?.length ?? 0} participants
                      </span>
                      {!isMyTab && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            handleJoinPublic(room);
                          }}
                          className="text-xs px-3 py-1 rounded-md bg-primary text-primary-foreground hover:opacity-90"
                        >
                          Join
                        </button>
                      )}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <svg
                className="w-16 h-16 text-muted-foreground mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <h3 className="text-lg font-medium text-foreground mb-2">
                No chat rooms yet
              </h3>
              <p className="text-muted-foreground mb-4">
                Create your first chat room to start talking with others
              </p>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors"
              >
                Create Chat Room
              </Button>
            </div>
          )}
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
