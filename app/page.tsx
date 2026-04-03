'use client'

import { ChatProvider, useChat } from './ChatContext'
import { ChatHeader } from '@/components/ChatHeader'
import { MessagesView } from '@/components/MessagesView'
import { ChatInput } from '@/components/ChatInput'
import { UserSwitcher } from '@/components/UserSwitcher'

function ChatContent() {
  const { currentUser } = useChat()

  if (!currentUser) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-muted-foreground">Initializing chat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-screen flex flex-col bg-background">
      <UserSwitcher />
      <ChatHeader />
      <MessagesView />
      <ChatInput />
    </div>
  )
}

export default function Home() {
  return (
    <ChatProvider>
      <ChatContent />
    </ChatProvider>
  )
}
