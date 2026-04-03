'use client'

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Message, User } from '@/lib/types'
import { getUsers } from '@/lib/chatStore'

interface ChatContextType {
  messages: Message[]
  currentUser: User | null
  otherUser: User | null
  sendMessage: (text: string) => void
  switchUser: (userId: string) => void
}

const CHAT_MESSAGES_KEY = 'messenger_chat_messages_v1'
const CHAT_USER_KEY = 'messenger_chat_user_v1'

const ChatContext = createContext<ChatContextType | undefined>(undefined)

function readMessagesFromStorage(): Message[] {
  if (typeof window === 'undefined') return []

  const raw = window.localStorage.getItem(CHAT_MESSAGES_KEY)
  if (!raw) return []

  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed as Message[]
  } catch {
    return []
  }
}

function persistMessages(messages: Message[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(CHAT_MESSAGES_KEY, JSON.stringify(messages))
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const users = useMemo(() => getUsers(), [])
  const [messages, setMessages] = useState<Message[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const channelRef = useRef<BroadcastChannel | null>(null)

  const currentUser = currentUserId ? users[currentUserId] ?? null : null
  const otherUser = currentUserId
    ? users[currentUserId === 'user1' ? 'user2' : 'user1'] ?? null
    : null

  useEffect(() => {
    const savedMessages = readMessagesFromStorage()
    setMessages(savedMessages)

    const savedUserId = window.sessionStorage.getItem(CHAT_USER_KEY)
    const fallbackUserId = users.user1?.id ?? null
    const nextUserId = savedUserId && users[savedUserId] ? savedUserId : fallbackUserId
    setCurrentUserId(nextUserId)

    if (nextUserId) {
      window.sessionStorage.setItem(CHAT_USER_KEY, nextUserId)
    }

    try {
      const channel = new BroadcastChannel('chat_channel')
      channelRef.current = channel

      channel.onmessage = (event) => {
        const { type, data } = event.data ?? {}

        if (type === 'message_loading') {
          setMessages((prev) => {
            if (prev.some((m) => m.id === data.id)) return prev
            const next = [...prev, data as Message]
            persistMessages(next)
            return next
          })
        }

        if (type === 'message_final') {
          setMessages((prev) => {
            const withoutLoading = prev.filter((m) => m.id !== data.loadingId)
            if (withoutLoading.some((m) => m.id === data.message.id)) return withoutLoading
            const next = [...withoutLoading, data.message as Message]
            persistMessages(next)
            return next
          })
        }
      }
    } catch {
      // BroadcastChannel is optional; localStorage synchronization still works.
    }

    const onStorage = (event: StorageEvent) => {
      if (event.key === CHAT_MESSAGES_KEY) {
        setMessages(readMessagesFromStorage())
      }
    }

    window.addEventListener('storage', onStorage)

    return () => {
      channelRef.current?.close()
      window.removeEventListener('storage', onStorage)
    }
  }, [users])

  const sendMessage = (text: string) => {
    if (!currentUserId) return

    const loadingId = `loading-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    const loadingMessage: Message = {
      id: loadingId,
      senderId: currentUserId,
      text,
      timestamp: Date.now(),
      isLoading: true
    }

    setMessages((prev) => {
      const next = [...prev, loadingMessage]
      persistMessages(next)
      return next
    })

    channelRef.current?.postMessage({ type: 'message_loading', data: loadingMessage })

    window.setTimeout(() => {
      const finalMessage: Message = {
        id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        senderId: currentUserId,
        text,
        timestamp: Date.now(),
        isLoading: false
      }

      setMessages((prev) => {
        const withoutLoading = prev.filter((m) => m.id !== loadingId)
        const next = [...withoutLoading, finalMessage]
        persistMessages(next)
        return next
      })

      channelRef.current?.postMessage({
        type: 'message_final',
        data: { loadingId, message: finalMessage }
      })
    }, 1500)
  }

  const switchUser = (userId: string) => {
    if (!users[userId]) return

    setCurrentUserId(userId)
    window.sessionStorage.setItem(CHAT_USER_KEY, userId)
  }

  return (
    <ChatContext.Provider value={{ messages, currentUser, otherUser, sendMessage, switchUser }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChat must be used within ChatProvider')
  }
  return context
}
