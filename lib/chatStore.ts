import { Message, User } from "./types";

// In-memory store
let messages: Message[] = [];
let currentUserId: string | null = null;

const USERS: Record<string, User> = {
  user1: {
    id: "user1",
    name: "Sanjida Akter",
    status: "Active now",
    avatar: "/sanjida.png",
  },
  user2: {
    id: "user2",
    name: "Monir Hossain",
    status: "Active now",
    avatar: "/monir.png",
  },
};

export function getUsers() {
  return USERS;
}

export function setCurrentUserId(userId: string) {
  currentUserId = userId;
}

export function getCurrentUserId() {
  return currentUserId;
}

export function getCurrentUser(): User | null {
  if (!currentUserId) return null;
  return USERS[currentUserId] || null;
}

export function getOtherUser(): User | null {
  if (!currentUserId) return null;
  const otherId = currentUserId === "user1" ? "user2" : "user1";
  return USERS[otherId] || null;
}

export function getMessages() {
  return [...messages];
}

export function addMessage(message: Message) {
  messages.push(message);
}

export function removeLoadingMessage(id: string) {
  messages = messages.filter((m) => m.id !== id);
}

export function clearMessages() {
  messages = [];
}
