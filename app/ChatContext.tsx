'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { Message, User } from '@/lib/types'
import { 
  setCurrentUserId as storeSetCurrentUserId,
  getCurrentUserId as storeGetCurrentUserId,
  getCurrentUser as storeGetCurrentUser,
  getOtherUser as storeGetOtherUser,
  getMessages as storeGetMessages,
  addMessage as storeAddMessage,
  removeLoadingMessage as storeRemoveLoadingMessage
} from '@/lib/chatStore'

interface ChatContextType {
  messages: Message[]
  currentUser: User | null
  otherUser: User | null
  sendMessage: (text: string) => void
  switchUser: (userId: string) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [otherUser, setOtherUser] = useState<User | null>(null)
  const [broadcastChannel, setBroadcastChannel] = useState<BroadcastChannel | null>(null)

  // Initialize BroadcastChannel for cross-tab communication
  useEffect(() => {
    try {
      const channel = new BroadcastChannel('chat_channel')
      setBroadcastChannel(channel)

      channel.onmessage = (event) => {
        const { type, data } = event.data
        if (type === 'message') {
          storeAddMessage(data)
          setMessages([...storeGetMessages()])
        } else if (type === 'user_switch') {
          storeSetCurrentUserId(data.userId)
          setCurrentUser(storeGetCurrentUser())
          setOtherUser(storeGetOtherUser())
          setMessages([...storeGetMessages()])
        }
      }

      return () => channel.close()
    } catch (e) {
      console.warn('BroadcastChannel not supported, using single-tab mode')
    }
  }, [])

  // Initialize user
  useEffect(() => {
    const currentUserId = storeGetCurrentUserId()
    if (!currentUserId) {
      storeSetCurrentUserId('user1')
    }
    setCurrentUser(storeGetCurrentUser())
    setOtherUser(storeGetOtherUser())
    setMessages([...storeGetMessages()])
  }, [])

  const sendMessage = (text: string) => {
    if (!currentUser) return

    // Add loading message
    const loadingId = `loading-${Date.now()}`
    const loadingMessage: Message = {
      id: loadingId,
      senderId: currentUser.id,
      text: text,
      timestamp: Date.now(),
      isLoading: true
    }

    storeAddMessage(loadingMessage)
    setMessages([...storeGetMessages()])
    broadcastChannel?.postMessage({ type: 'message', data: loadingMessage })

    // Simulate send delay and remove loading
    setTimeout(() => {
      storeRemoveLoadingMessage(loadingId)
      const finalMessage: Message = {
        id: `msg-${Date.now()}`,
        senderId: currentUser.id,
        text: text,
        timestamp: Date.now(),
        isLoading: false
      }
      storeAddMessage(finalMessage)
      setMessages([...storeGetMessages()])
      broadcastChannel?.postMessage({ type: 'message', data: finalMessage })
    }, 1500)
  }

  const switchUser = (userId: string) => {
    storeSetCurrentUserId(userId)
    setCurrentUser(storeGetCurrentUser())
    setOtherUser(storeGetOtherUser())
    broadcastChannel?.postMessage({ type: 'user_switch', data: { userId } })
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
