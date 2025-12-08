import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="w-full h-full overflow-y-auto bg-background text-foreground">
      <div className="max-w-5xl mx-auto px-6 py-12 md:py-20 border-x border-border min-h-full">
        {/* Header Section */}
        <div className="text-center border-b-2 border-foreground pb-8 mb-12">
          <div className="text-xs font-sans uppercase tracking-[0.2em] text-muted-foreground mb-4">
            Vol. 1 &mdash; Issue 1
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Real-Time<br />Conversations
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto italic font-serif">
            "A seamless exchange of ideas, powered by the synchronicity of JazzDB and the security of Clerk."
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          
          {/* Main Column */}
          <div className="md:col-span-8">
            <div className="prose prose-lg prose-neutral dark:prose-invert max-w-none">
              <p className="lead text-xl">
                In an era of instant connectivity, the quality of our tools defines the quality of our discourse. 
                We present a platform designed not just for transmission, but for connection.
              </p>
              <div className="my-8 p-6 border border-border bg-secondary/20">
                <h3 className="text-2xl font-bold mb-4 font-serif">Start the Presses</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                   <SignedIn>
                    <Link
                      href="/chat"
                      className="inline-flex justify-center items-center px-8 py-3 bg-foreground text-background text-sm font-sans uppercase tracking-widest hover:opacity-90 transition-opacity"
                    >
                      Enter Newsroom
                    </Link>
                  </SignedIn>
                  <SignedOut>
                    <SignUpButton mode="modal">
                      <button className="px-8 py-3 bg-foreground text-background text-sm font-sans uppercase tracking-widest hover:opacity-90 transition-opacity">
                        Create Account
                      </button>
                    </SignUpButton>
                    <SignInButton mode="modal">
                      <button className="px-8 py-3 border border-foreground text-foreground text-sm font-sans uppercase tracking-widest hover:bg-secondary transition-colors">
                        Login
                      </button>
                    </SignInButton>
                  </SignedOut>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="md:col-span-4 space-y-8 md:border-l md:border-border md:pl-8">
            <div className="space-y-4">
              <h4 className="font-sans uppercase text-xs font-bold tracking-widest border-b border-border pb-2">
                Features
              </h4>
              <ul className="space-y-4">
                <li className="group">
                  <h5 className="font-bold text-lg group-hover:underline decoration-1 underline-offset-4 cursor-default">Synchronized State</h5>
                  <p className="text-sm text-muted-foreground font-serif mt-1">
                    Powered by JazzDB for conflict-free local-first data.
                  </p>
                </li>
                <li className="group">
                  <h5 className="font-bold text-lg group-hover:underline decoration-1 underline-offset-4 cursor-default">Identity</h5>
                  <p className="text-sm text-muted-foreground font-serif mt-1">
                    Secure authentication provided by Clerk.
                  </p>
                </li>
                <li className="group">
                  <h5 className="font-bold text-lg group-hover:underline decoration-1 underline-offset-4 cursor-default">Design</h5>
                  <p className="text-sm text-muted-foreground font-serif mt-1">
                    A minimal, typographic approach to digital chatting.
                  </p>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}