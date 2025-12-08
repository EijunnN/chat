"use client";

import {
  JazzReactProvider,
  type JazzProviderProps,
  useAccount,
} from "jazz-tools/react";
import { ChatAccount, UserProfile, Message, ChatRoom } from "@/lib/schema";
import { useAuth, useUser } from "@clerk/nextjs";
import { useEffect } from "react";


// Jazz provider wrapper that integrates with Clerk authentication
export function JazzProvider({ children }: { children: React.ReactNode }) {
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  // Get API key from environment
  const apiKey = process.env.NEXT_PUBLIC_JAZZ_API_KEY || "you@example.com";

  // Sync configuration
  const syncConfig: JazzProviderProps<typeof ChatAccount>["sync"] = {
    peer: `wss://cloud.jazz.tools/?key=${apiKey}` as `wss://${string}`,
    when: "always",
  };

  // Show loading state while auth is initializing
  if (isSignedIn === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Only provide Jazz context when user is authenticated
  if (!isSignedIn) {
    return <>{children}</>;
  }

  return (
    <JazzReactProvider sync={syncConfig} AccountSchema={ChatAccount}>
      <JazzAuthProvider clerkUser={user}>{children}</JazzAuthProvider>
    </JazzReactProvider>
  );
}

// Internal component to sync user profile with Jazz
function JazzAuthProvider({
  children,
  clerkUser,
}: {
  children: React.ReactNode;
  clerkUser: ReturnType<typeof useUser>["user"];
}) {
  const account = useAccount(ChatAccount, {
    resolve: { profile: { chatRooms: { $each: true } } },
  });

  useEffect(() => {
    if (!account.$isLoaded || !clerkUser) {
      return;
    }

    if (!account.profile?.$isLoaded) {
      account.$jazz.set("profile", {
        name: clerkUser.fullName || clerkUser.username || "Anonymous",
        inbox: undefined,
        inboxInvite: undefined,
        chatRooms: [],
      });
      return;
    }

    if (!account.profile.$jazz.has("chatRooms")) {
      account.profile.$jazz.set("chatRooms", []);
    }

    const newName = clerkUser.fullName || clerkUser.username || "Anonymous";
    if (account.profile.name !== newName) {
      account.profile.$jazz.set("name", newName);
    }
  }, [account, clerkUser]);

  return <>{children}</>;
}

// Hook to get current user's Jazz profile
export function useUserProfile() {
  const account = useAccount(ChatAccount, {
    resolve: { profile: { chatRooms: { $each: true } } },
  });
  return account.$isLoaded && account.profile?.$isLoaded
    ? account.profile
    : undefined;
}

// Hook to check if user is in a specific chat room
export function useIsInChatRoom(chatRoomId: string) {
  const profile = useUserProfile();

  return (
    profile?.chatRooms?.some(
      (room) => room?.$isLoaded && room.$jazz.id === chatRoomId
    ) || false
  );
}

// Export schemas for use in components
export { Message, ChatRoom };
