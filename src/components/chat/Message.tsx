"use client";

import { Message as MessageType } from "@/lib/schema";
import { useAuth } from "@clerk/nextjs";
import { formatDistanceToNow } from "date-fns";
import type { InstanceOfSchema } from "jazz-tools";

interface MessageProps {
  message: InstanceOfSchema<typeof MessageType>;
  isOwn?: boolean;
}

export function Message({ message, isOwn }: MessageProps) {
  const { user } = useAuth();

  const formatTime = (value: number | Date | undefined) => {
    if (value === undefined || value === null) return "";
    const ms = typeof value === "number" ? value : typeof value.getTime === "function" ? value.getTime() : NaN;
    if (!Number.isFinite(ms)) return "";
    return formatDistanceToNow(new Date(ms), { addSuffix: true });
  };

  return (
    <div
      className={`flex gap-3 p-4 rounded-lg transition-colors hover:bg-muted ${
        isOwn ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <div className="flex-shrink-0">
        {message.authorImage ? (
          <img
            src={message.authorImage}
            alt={message.authorName}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground font-medium">
              {message.authorName?.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      <div className={`flex-1 min-w-0 ${isOwn ? "text-right" : "text-left"}`}>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-medium text-foreground">{message.authorName}</span>
          <span className="text-xs text-muted-foreground">
            {formatTime(message.timestamp)}
          </span>
          {message.edited && (
            <span className="text-xs text-muted-foreground italic">(edited)</span>
          )}
        </div>

        <div
          className={`inline-block max-w-lg ${
            isOwn ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
          } rounded-lg px-4 py-2`}
        >
          <p className="text-sm break-words">{message.text}</p>
        </div>

        {message.attachmentURLs && message.attachmentURLs.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {message.attachmentURLs.map((attachment, index) => (
              <img
                key={index}
                src={attachment}
                alt="Attachment"
                className="max-w-xs rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => window.open(attachment, "_blank")}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}