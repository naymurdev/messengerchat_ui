'use client'

import { useState } from 'react'
import { Send, Smile, Paperclip } from 'lucide-react'
import { useChat } from '@/app/ChatContext'

export function ChatInput() {
  const [message, setMessage] = useState('')
  const { sendMessage } = useChat()

  const handleSend = () => {
    if (message.trim()) {
      sendMessage(message)
      setMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="px-4 py-3 bg-card border-t border-border">
      <div className="flex items-end gap-2">
        <button className="p-2 hover:bg-secondary rounded-full transition">
          <Smile size={20} className="text-primary" />
        </button>
        <button className="p-2 hover:bg-secondary rounded-full transition">
          <Paperclip size={20} className="text-primary" />
        </button>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Aa"
          className="flex-1 px-4 py-2 bg-secondary text-foreground rounded-full outline-none focus:ring-2 focus:ring-primary transition placeholder:text-muted-foreground"
        />
        <button
          onClick={handleSend}
          disabled={!message.trim()}
          className="p-2 hover:bg-secondary rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={20} className="text-primary" />
        </button>
      </div>
    </div>
  )
}
