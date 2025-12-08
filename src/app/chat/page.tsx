"use client";

import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { ChatRoomList } from "@/components/chat/ChatRoomList";

export default function ChatPage() {
  return (
    <div className="h-full flex w-full">
      <SignedIn>
        <div className="w-80 md:w-96 border-r border-border h-full bg-background flex-shrink-0">
          <ChatRoomList />
        </div>
        <div className="flex-1 hidden md:flex items-center justify-center bg-secondary/30">
          <div className="text-center p-8 max-w-md border border-border bg-background shadow-[4px_4px_0px_0px_var(--color-border)]">
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">
              Select a Frequency
            </h2>
            <p className="text-muted-foreground font-serif italic">
              Choose a channel from the directory on the left to begin transmission.
            </p>
          </div>
        </div>
      </SignedIn>

      <SignedOut>
        <div className="flex-1 flex items-center justify-center bg-secondary/30">
          <div className="text-center max-w-md mx-auto p-12 border border-border bg-background shadow-[4px_4px_0px_0px_var(--color-border)]">
            <h2 className="text-3xl font-serif font-bold text-foreground mb-4">
              Restricted Area
            </h2>
            <p className="text-muted-foreground mb-8 font-serif italic">
              Credentials are required to access the communication logs.
            </p>
            <SignInButton mode="modal">
              <button className="px-8 py-3 bg-foreground text-background text-sm font-sans uppercase tracking-widest hover:opacity-90">
                Present Credentials
              </button>
            </SignInButton>
          </div>
        </div>
      </SignedOut>
    </div>
  );
}