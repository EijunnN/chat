"use client";

import { useEffect, Suspense, use } from "react";
import { useAccount, useCoState } from "jazz-tools/react";
import { ChatAccount, ChatRoom } from "@/lib/schema";
import { ID } from "jazz-tools";
import type { InstanceOfSchema } from "jazz-tools";
import { useAuth } from "@clerk/nextjs";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { useRouter } from "next/navigation";

function ChatRoomContent({ roomId }: { roomId: string }) {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const account = useAccount(ChatAccount, {
    resolve: { profile: { chatRooms: { $each: true } } },
  });

  const chatRoom = useCoState(
    ChatRoom,
    roomId as ID<InstanceOfSchema<typeof ChatRoom>>,
    {
      resolve: {
        messages: { $each: true },
        participants: true,
      },
    }
  );

  const profile = account && "profile" in account ? account.profile : undefined;
  const chatRooms = profile?.chatRooms;
  const roomsLoaded = chatRooms?.$isLoaded === true;
  const isAccountReady = Boolean(profile?.$isLoaded && roomsLoaded);
  const isRoomLoaded = Boolean(chatRoom?.$isLoaded);
  const isRoomUnavailable = isAccountReady && chatRoom === null;

  useEffect(() => {
    if (isSignedIn === false) {
      router.push("/chat");
    }
  }, [isSignedIn, router]);

  useEffect(() => {
    if (isRoomUnavailable) {
      console.warn("Room not found or no access, redirecting...");
      router.push("/chat");
    }
  }, [isRoomUnavailable, router]);

  // AUTO-JOIN
  useEffect(() => {
    if (
      isRoomLoaded &&
      isAccountReady &&
      chatRoom &&
      roomsLoaded &&
      chatRooms
    ) {
      const loadedRoom = chatRoom as InstanceOfSchema<typeof ChatRoom>;
      const loadedRooms = chatRooms.filter(
        (r): r is InstanceOfSchema<typeof ChatRoom> => Boolean(r?.$isLoaded)
      );

      const alreadyJoined = loadedRooms.some(
        (r) => r.$jazz.id === loadedRoom.$jazz.id
      );

      if (!alreadyJoined) {
        chatRooms.$jazz.push(loadedRoom);
      }
    }
  }, [isRoomLoaded, isAccountReady, chatRoom, roomsLoaded, chatRooms]);

  if (!isSignedIn) {
    return null;
  }

  if (!isRoomLoaded || !chatRoom) {
    return (
      <div className="h-screen flex items-center justify-center flex-col gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="text-muted-foreground text-sm">Joining room...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex">
      <div className="hidden md:block w-96 border-r">
        {/* Sidebar placeholder */}
      </div>

      <div className="flex-1 flex flex-col">
        <ChatWindow chatRoom={chatRoom as InstanceOfSchema<typeof ChatRoom>} />
      </div>
    </div>
  );
}

export default function ChatRoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = use(params);

  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      }
    >
      <ChatRoomContent roomId={roomId} />
    </Suspense>
  );
}
