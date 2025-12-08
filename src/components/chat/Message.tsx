"use client";

import { Message as MessageType } from "@/lib/schema";
import { formatDistanceToNow } from "date-fns";
import type { InstanceOfSchema } from "jazz-tools";

interface MessageProps {
  message: InstanceOfSchema<typeof MessageType>;
  isOwn?: boolean;
}

export function Message({ message, isOwn }: MessageProps) {
  const formatTime = (value: number | Date | undefined) => {
    if (value === undefined || value === null) return "";
    const ms = typeof value === "number" ? value : typeof value.getTime === "function" ? value.getTime() : NaN;
    if (!Number.isFinite(ms)) return "";
    return formatDistanceToNow(new Date(ms), { addSuffix: true });
  };

  return (
    <div className={`group flex flex-col ${isOwn ? "items-end text-right" : "items-start text-left"}`}>
      
      {/* Meta Data Line */}
      <div className="flex items-baseline gap-3 mb-1 opacity-60 transition-opacity group-hover:opacity-100">
         {!isOwn && (
            <span className="text-xs font-bold font-sans uppercase tracking-wider text-foreground">
               {message.authorName}
            </span>
         )}
         <span className="text-[10px] font-sans uppercase tracking-widest text-muted-foreground">
            {formatTime(message.timestamp)}
         </span>
         {isOwn && (
            <span className="text-xs font-bold font-sans uppercase tracking-wider text-foreground">
               You
            </span>
         )}
      </div>

      {/* Content */}
      <div className={`max-w-2xl font-serif text-lg leading-relaxed ${isOwn ? "pl-8" : "pr-8"}`}>
        <p className="text-foreground whitespace-pre-wrap">{message.text}</p>
        
        {message.attachmentURLs && message.attachmentURLs.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-4">
            {message.attachmentURLs.map((attachment, index) => (
              <div key={index} className="border border-border p-1 bg-white shadow-sm">
                 <img
                   src={attachment}
                   alt="Figure"
                   className="max-w-xs block cursor-zoom-in"
                   onClick={() => window.open(attachment, "_blank")}
                 />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}