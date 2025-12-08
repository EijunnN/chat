"use client";

import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { ChatRoomList } from "@/components/chat/ChatRoomList";
import { Button } from "@base-ui-components/react/button";

export default function ChatPage() {
  return (
    <div className="h-screen flex">
      <SignedIn>
        <div className="w-96 border-r border-border">
          <ChatRoomList />
        </div>
        <div className="flex-1 flex items-center justify-center bg-muted">
          <div className="text-center">
            <svg
              className="w-24 h-24 text-muted-foreground mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Select a chat room
            </h2>
            <p className="text-muted-foreground">
              Choose a chat room from the list to start messaging
            </p>
          </div>
        </div>
      </SignedIn>

      <SignedOut>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-8">
            <svg
              className="w-24 h-24 text-muted-foreground mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Sign in to chat
            </h2>
            <p className="text-muted-foreground mb-6">
              Connect with others in real-time. Sign in or create an account to
              get started.
            </p>
            <SignInButton mode="modal">
              <Button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors">
                Sign In
              </Button>
            </SignInButton>
          </div>
        </div>
      </SignedOut>
    </div>
  );
}
