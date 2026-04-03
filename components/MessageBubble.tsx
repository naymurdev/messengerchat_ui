'use client'

import { Message } from '@/lib/types'
import { BouncingBalls } from './BouncingBalls'
import { useChat } from '@/app/ChatContext'

interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const { currentUser } = useChat()
  const isOwn = message.senderId === currentUser?.id

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-3`}>
      <div
        className={`max-w-xs px-4 py-2 rounded-2xl ${
          isOwn
            ? 'bg-primary text-primary-foreground rounded-br-none'
            : 'bg-secondary text-secondary-foreground rounded-bl-none'
        }`}
      >
        {message.isLoading ? (
          <BouncingBalls />
        ) : (
          <>
            <p className="break-words">{message.text}</p>
            <p className={`text-xs mt-1 ${isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </>
        )}
      </div>
    </div>
  )
}
