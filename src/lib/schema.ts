import { co, z } from "jazz-tools";

export const Message = co.map({
  text: z.string(),
  author: z.string(), // Clerk user ID
  authorName: z.string(), // Display name
  authorImage: z.string(), // Profile image URL
  timestamp: z.number(),
  edited: z.boolean(),
  attachmentURLs: co.list(z.string()),
});

export const ChatRoom = co.map({
  name: z.string(),
  description: z.string(),
  isPublic: z.boolean(),
  participants: co.list(z.string()), // Clerk user IDs
  messages: co.list(Message),
  createdBy: z.string(), // Clerk user ID of creator
  createdAt: z.number(),
  lastMessageAt: z.number(),
});

export const UserProfile = co.profile({
  chatRooms: co.list(ChatRoom),
});

export const ChatAccount = co
  .account({
    profile: UserProfile,
    root: co.map({}),
  })
  .withMigration((account) => {
    if (!account.$jazz.has("profile")) {
      account.$jazz.set("profile", {
        name: "Anonymous",
        inbox: undefined,
        inboxInvite: undefined,
        chatRooms: [],
      });
    } else if (
      account.profile?.$isLoaded &&
      !account.profile.$jazz.has("chatRooms")
    ) {
      account.profile.$jazz.set("chatRooms", []);
    }

    if (!account.$jazz.has("root")) {
      account.$jazz.set("root", {});
    }
  });
