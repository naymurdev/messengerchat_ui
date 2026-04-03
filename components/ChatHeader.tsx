"use client";

import { ArrowLeft, Phone, Video, MoreVertical } from "lucide-react";
import { useChat } from "@/app/ChatContext";

export function ChatHeader() {
  const { otherUser } = useChat();

  if (!otherUser) return null;

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-card border-b border-border">
      <div className="flex items-center gap-3">
        <button className="text-muted-foreground hover:text-foreground">
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-lg">
            {/* {otherUser.avatar} */}
            <img
              src={otherUser.avatar}
              alt={otherUser.name}
              className="w-full h-full rounded-full"
            />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">{otherUser.name}</h2>
            <p className="text-xs text-muted-foreground">{otherUser.status}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="p-2 hover:bg-secondary rounded-full transition">
          <Phone size={20} className="text-primary" />
        </button>
        <button className="p-2 hover:bg-secondary rounded-full transition">
          <Video size={20} className="text-primary" />
        </button>
        <button className="p-2 hover:bg-secondary rounded-full transition">
          <MoreVertical size={20} className="text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}
