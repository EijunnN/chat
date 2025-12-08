import type { Metadata } from "next";
import { Geist, Geist_Mono, Libre_Baskerville } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { JazzProvider } from "@/lib/jazz";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const libreBaskerville = Libre_Baskerville({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "The Chat Chronicle",
  description: "A real-time text exchange powered by JazzDB",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${libreBaskerville.variable} font-serif antialiased bg-background text-foreground`}
      >
        <ClerkProvider
          appearance={{
            variables: {
              fontFamily: "var(--font-sans)",
              borderRadius: "0",
              colorPrimary: "black",
            },
            elements: {
              card: "border border-border shadow-none rounded-none",
              formButtonPrimary: "bg-foreground text-background rounded-none hover:opacity-80",
            }
          }}
        >
          <JazzProvider>
            <div className="flex flex-col h-screen overflow-hidden">
              <header className="flex justify-between items-center px-6 py-4 border-b border-border bg-background z-10 shrink-0">
                <Link href="/" className="text-xl font-bold tracking-tight">
                  The Chronicle.
                </Link>
                <div className="flex items-center gap-4 font-sans">
                  <SignedOut>
                    <SignInButton mode="modal">
                      <button className="text-sm uppercase tracking-widest hover:underline underline-offset-4">
                        Sign In
                      </button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <button className="bg-foreground text-background text-sm px-5 py-2 hover:opacity-90 transition-opacity">
                        Subscribe
                      </button>
                    </SignUpButton>
                  </SignedOut>
                  <SignedIn>
                    <UserButton />
                  </SignedIn>
                </div>
              </header>
              <main className="flex-1 flex overflow-hidden">
                {children}
              </main>
            </div>
          </JazzProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}