"use client";

import { useEffect, Suspense, use } from "react";
import { useAccount, useCoState } from "jazz-tools/react";
import { ChatAccount, ChatRoom } from "@/lib/schema";
import { ID } from "jazz-tools";
import type { InstanceOfSchema } from "jazz-tools";
import { useAuth } from "@clerk/nextjs";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { ChatRoomList } from "@/components/chat/ChatRoomList";
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

  useEffect(() => {
    if (isSignedIn === false) {
      router.push("/chat");
    }
  }, [isSignedIn, router]);

  // AUTO-JOIN logic
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

  if (!isSignedIn) return null;

  return (
    <div className="h-full flex w-full overflow-hidden">
      {/* Sidebar hidden on mobile when in chat */}
      <div className="hidden md:block w-80 lg:w-96 border-r border-border h-full bg-background flex-shrink-0">
         <ChatRoomList />
      </div>

      <div className="flex-1 flex flex-col h-full relative bg-background">
         {(!isRoomLoaded || !chatRoom) ? (
            <div className="h-full flex items-center justify-center flex-col gap-4">
              <div className="font-serif italic text-muted-foreground">Retrieving archives...</div>
            </div>
         ) : (
            <ChatWindow chatRoom={chatRoom as InstanceOfSchema<typeof ChatRoom>} />
         )}
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
        <div className="h-full flex items-center justify-center">
          <div className="animate-pulse bg-muted h-4 w-32"></div>
        </div>
      }
    >
      <ChatRoomContent roomId={roomId} />
    </Suspense>
  );
}