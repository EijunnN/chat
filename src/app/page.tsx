import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-foreground sm:text-5xl md:text-6xl">
            <span className="block">Real-Time Chat</span>
            <span className="block text-primary">Powered by JazzDB</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-muted-foreground sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Connect with others instantly. Experience seamless real-time
            messaging with our modern chat application built on Next.js and
            JazzDB.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link
                href="/chat"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-foreground bg-primary hover:opacity-90 md:py-4 md:text-lg md:px-10 transition-colors"
              >
                Get Started
              </Link>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <SignedOut>
                <SignUpButton mode="modal">
                  <button className="w-full flex items-center justify-center px-8 py-3 border border-border text-base font-medium rounded-md text-primary bg-card hover:bg-muted md:py-4 md:text-lg md:px-10 transition-colors">
                    Sign Up
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <Link
                  href="/chat"
                  className="w-full flex items-center justify-center px-8 py-3 border border-border text-base font-medium rounded-md text-primary bg-card hover:bg-muted md:py-4 md:text-lg md:px-10 transition-colors"
                >
                  Go to Chat
                </Link>
              </SignedIn>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="pt-6">
              <div className="flow-root bg-card text-foreground rounded-lg px-6 pb-8 shadow-lg border border-border">
                <div className="-mt-6">
                  <div>
                    <span className="inline-flex items-center justify-center p-3 bg-primary text-primary-foreground rounded-md shadow-lg">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </span>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-foreground tracking-tight">
                    Real-Time Messaging
                  </h3>
                  <p className="mt-5 text-base text-muted-foreground">
                    Messages appear instantly across all connected devices with
                    JazzDB's powerful real-time synchronization.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <div className="flow-root bg-card text-foreground rounded-lg px-6 pb-8 shadow-lg border border-border">
                <div className="-mt-6">
                  <div>
                    <span className="inline-flex items-center justify-center p-3 bg-primary text-primary-foreground rounded-md shadow-lg">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </span>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-foreground tracking-tight">
                    Secure Authentication
                  </h3>
                  <p className="mt-5 text-base text-muted-foreground">
                    Built with Clerk for enterprise-grade authentication and
                    security. Your conversations stay private.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <div className="flow-root bg-card text-foreground rounded-lg px-6 pb-8 shadow-lg border border-border">
                <div className="-mt-6">
                  <div>
                    <span className="inline-flex items-center justify-center p-3 bg-primary text-primary-foreground rounded-md shadow-lg">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                        />
                      </svg>
                    </span>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-foreground tracking-tight">
                    Chat Rooms
                  </h3>
                  <p className="mt-5 text-base text-muted-foreground">
                    Create public or private chat rooms. Invite friends and
                    start conversations on any topic.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
