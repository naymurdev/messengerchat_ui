"use client";

import { useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBubble";
import { useChat } from "@/app/ChatContext";

export function MessagesView() {
  const { messages } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto px-4 py-4 space-y-2"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(91, 91, 255, 0.03) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      {messages.length === 0 ? (
        <div className=" items-center justify-center h-full text-center hidden">
          <div>
            <div className="text-3xl mb-2">👋</div>
            <p className="text-muted-foreground">Start a conversation!</p>
          </div>
        </div>
      ) : (
        messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))
      )}
    </div>
  );
}
