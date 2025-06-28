'use client'

import { useState } from 'react'
import { Send, Paperclip, Smile, Image, Mic } from 'lucide-react'
import { cn } from '@/lib/utils'

const MessageInput = () => {
  const [message, setMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)

  const handleSend = () => {
    if (message.trim()) {
      // TODO: Implement send functionality
      console.log('Sending message:', message)
      setMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording)
    // TODO: Implement voice recording
  }

  return (
    <div className="p-4 bg-white border-t border-gray-200">
      <div className="flex items-end gap-3">
        {/* Attachment Button */}
        <button className="p-2.5 rounded-full hover:bg-gray-100 transition-colors group">
          <Paperclip className="w-5 h-5 text-gray-500 group-hover:text-orange-500" />
        </button>

        {/* Image Button */}
        <button className="p-2.5 rounded-full hover:bg-gray-100 transition-colors group">
          <Image className="w-5 h-5 text-gray-500 group-hover:text-orange-500" />
        </button>

        {/* Message Input Container */}
        <div className="flex-1 relative">
          <div className="flex items-end bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500">
            <div className="flex-1 relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="w-full px-4 py-3 bg-transparent text-gray-900 placeholder-gray-500 resize-none focus:outline-none max-h-32 min-h-[48px]"
                rows={1}
                style={{
                  height: 'auto',
                  minHeight: '48px'
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement
                  target.style.height = 'auto'
                  target.style.height = Math.min(target.scrollHeight, 128) + 'px'
                }}
              />
            </div>

            {/* Emoji Button */}
            <button className="p-2.5 mr-2 rounded-full hover:bg-gray-100 transition-colors group">
              <Smile className="w-5 h-5 text-gray-500 group-hover:text-orange-500" />
            </button>
          </div>
        </div>

        {/* Voice/Send Button */}
        {message.trim() ? (
          <button
            onClick={handleSend}
            className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-full transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        ) : (
          <button
            onClick={handleVoiceRecord}
            className={cn(
              "p-3 rounded-full transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md",
              isRecording 
                ? "bg-red-500 hover:bg-red-600 animate-pulse" 
                : "bg-gray-200 hover:bg-gray-300"
            )}
          >
            <Mic className={cn(
              "w-5 h-5",
              isRecording ? "text-white" : "text-gray-600"
            )} />
          </button>
        )}
      </div>

      {/* Recording indicator */}
      {isRecording && (
        <div className="flex items-center gap-2 mt-3 px-4">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-sm text-red-500">Recording... Tap to stop</span>
        </div>
      )}
    </div>
  )
}

export default MessageInput 