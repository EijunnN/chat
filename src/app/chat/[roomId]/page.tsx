"use client";

import { useEffect, Suspense, use } from "react";
import { useAccount } from "jazz-tools/react";
import { ChatAccount, ChatRoom } from "@/lib/schema";
import type { InstanceOfSchema } from "jazz-tools";
import { useAuth } from "@clerk/nextjs";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { useRouter } from "next/navigation";

function ChatRoomContent({ roomId }: { roomId: string }) {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const account = useAccount(ChatAccount, {
    resolve: {
      profile: {
        chatRooms: {
          $each: {
            messages: { $each: true },
            participants: true,
          },
        },
      },
    },
  });

  const isProfileReady =
    account.$isLoaded &&
    account.profile?.$isLoaded &&
    account.profile.chatRooms?.$isLoaded;
  const chatRoom = isProfileReady
    ? (account.profile.chatRooms.find(
        (room) => room?.$isLoaded && room.$jazz.id === roomId
      ) as InstanceOfSchema<typeof ChatRoom> | undefined)
    : undefined;
  const loading = isSignedIn === undefined || !isProfileReady;

  useEffect(() => {
    // Redirect if not signed in
    if (isSignedIn === false) {
      router.push("/chat");
    }
  }, [isSignedIn, router]);

  useEffect(() => {
    if (!loading && !chatRoom) {
      router.push("/chat");
    }
  }, [chatRoom, loading, router]);

  if (!isSignedIn) {
    return null; // Will redirect
  }

  if (loading || !chatRoom) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex">
      {/* Sidebar with room list - simplified on mobile */}
      <div className="hidden md:block w-96 border-r">
        {/* You could include a mini room list here or navigation */}
      </div>

      {/* Main chat window */}
      <div className="flex-1 flex flex-col">
        <ChatWindow chatRoom={chatRoom} />
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
