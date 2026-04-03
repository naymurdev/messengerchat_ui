"use client";

import { useChat } from "@/app/ChatContext";
import { getUsers } from "@/lib/chatStore";

export function UserSwitcher() {
  const { currentUser, switchUser } = useChat();
  const users = getUsers();

  return (
    <div className="absolute top-4 left-200 z-50 bg-card border border-border rounded-lg p-3 shadow-lg hidden">
      <p className="text-xs text-muted-foreground mb-2 font-semibold">
        YOU ARE:
      </p>
      <div className="space-y-2">
        {Object.values(users).map((user) => (
          <button
            key={user.id}
            onClick={() => switchUser(user.id)}
            className={`w-full text-left px-3 py-2 rounded-lg transition ${
              currentUser?.id === user.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-foreground hover:bg-secondary/80"
            }`}
          >
            <span className="text-sm font-medium">{user.name}</span>
          </button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border">
        💡 Open this link in another tab and switch user to simulate a real
        chat!
      </p>
    </div>
  );
}
