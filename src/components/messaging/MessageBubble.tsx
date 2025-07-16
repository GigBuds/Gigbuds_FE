'use client'

import { Check, CheckCheck, Save, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import UserAvatar from './UserAvatar'
import { ChatHistory } from '@/types/messaging.types'
import { formatRelativeTime } from '@/utils'
import { useAppSelector } from '@/lib/redux/hooks'
import { selectUser } from '@/lib/redux/features/userSlice'
import MessageActions from './MessageActions'
import { useState, useRef, useEffect } from 'react'

interface MessageBubbleProps {
  message: ChatHistory
  isGrouped?: boolean
  onEdit?: (messageId: string, newContent: string) => void
  onDelete?: (messageId: string) => void
}

const MessageBubble = ({ message, isGrouped = false, onEdit, onDelete }: MessageBubbleProps) => {
  const { content, senderId, senderName, timestamp, deliveryStatus, senderAvatar, messageId, isDeleted } = message
  const convertedTimestamp = typeof timestamp === 'number' ? timestamp : new Date(timestamp!).getTime();
  const user = useAppSelector(selectUser);
  
  // Edit mode state
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(content)
  const [isSaving, setIsSaving] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  
  // Permission checks
  const isOwnMessage = senderId === user.id
  const canEdit = isOwnMessage && !isDeleted && !!onEdit
  const canDelete = isOwnMessage && !isDeleted && !!onDelete
  
  // Time limit for editing (24 hours)
  const messageTime = new Date(timestamp!).getTime()
  const now = Date.now()
  const hoursSinceMessage = (now - messageTime) / (1000 * 60 * 60)
  const canEditByTime = hoursSinceMessage < 24

  // Auto-resize textarea and focus
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      const textarea = textareaRef.current
      textarea.focus()
      textarea.style.height = 'auto'
      textarea.style.height = textarea.scrollHeight + 'px'
      // Select all text for easy editing
      textarea.setSelectionRange(0, textarea.value.length)
    }
  }, [isEditing])

  const handleStartEdit = () => {
    setEditContent(content)
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setEditContent(content)
    setIsEditing(false)
  }

  const handleSaveEdit = async () => {
    if (!onEdit || editContent.trim() === content.trim()) {
      setIsEditing(false)
      return
    }

    setIsSaving(true)
    try {
      await onEdit(messageId, editContent.trim())
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to edit message:', error)
      // Keep edit mode open on error
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete(messageId)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSaveEdit()
    } else if (e.key === 'Escape') {
      handleCancelEdit()
    }
  }

  const getStatusIcon = () => {
    switch (deliveryStatus) {
      case 'sending':
        return <Check className="w-4 h-4 text-gray-400" />
      case 'delivered':
        return <CheckCheck className="w-4 h-4 text-gray-400" />
      case 'read':
        return <CheckCheck className="w-4 h-4 text-orange-500" />
      default:
        return null
    }
  }

  // Show deleted message placeholder
  if (isDeleted) {
    return (
      <div className={cn(
        "flex gap-3",
        senderId === user.id ? "justify-end" : "justify-start",
        isGrouped && "mt-1"
      )}>
        {senderId !== user.id && !isGrouped && (
          <div className="flex-shrink-0 mt-1">
            <UserAvatar 
              src={senderAvatar}
              alt={senderName || "User avatar"}
              size="sm"
            />
          </div>
        )}
        {senderId !== user.id && isGrouped && (
          <div className="w-8 flex-shrink-0" />
        )}
        <div className={cn(
          "max-w-[70%] flex flex-col",
          senderId === user.id ? "items-end" : "items-start"
        )}>
          <div className="px-4 py-3 rounded-2xl bg-gray-100 border border-gray-200">
            <p className="text-sm text-gray-500 italic">Tin nhắn này đã bị xóa</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn(
      "flex gap-3 group",
      senderId === user.id ? "justify-end" : "justify-start",
      isGrouped && "mt-1"
    )}>
      {/* Avatar for other users */}
      {senderId !== user.id && !isGrouped && (
        <div className="flex-shrink-0 mt-1">
          <UserAvatar 
            src={senderAvatar}
            alt={senderName || "User avatar"}
            size="sm"
          />
        </div>
      )}

      {/* Spacer for grouped messages */}
      {senderId !== user.id && isGrouped && (
        <div className="w-8 flex-shrink-0" />
      )}

      {/* Message Content */}
      <div className={cn(
        "max-w-[70%] flex flex-col relative",
        senderId === user.id ? "items-end" : "items-start"
      )}>
        {/* Sender name for other users (only if not grouped) */}
        {senderId !== user.id && !isGrouped && (
          <span className="text-xs text-gray-500 mb-1 ml-3">
            {senderName}
          </span>
        )}

        {/* Message bubble container with actions */}
        <div className="relative">
          {/* Message Actions - show on hover for own messages */}
          {(canEdit && canEditByTime || canDelete) && !isEditing && (
            <div className={cn(
              "absolute -top-2 z-10",
              senderId === user.id ? "-left-16" : "-right-16"
            )}>
              <MessageActions
                messageId={messageId}
                canEdit={canEdit && canEditByTime}
                canDelete={canDelete}
                onEdit={handleStartEdit}
                onDelete={handleDelete}
              />
            </div>
          )}

          {/* Edit mode */}
          {isEditing ? (
            <div className={cn(
              "relative px-4 py-3 rounded-2xl break-words shadow-sm border-2 border-orange-300",
              senderId === user.id 
                ? "bg-orange-50 text-gray-900 rounded-br-sm" 
                : "bg-white text-gray-900 rounded-bl-sm",
              "max-w-full"
            )}>
              <textarea
                ref={textareaRef}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent resize-none outline-none text-sm leading-relaxed"
                disabled={isSaving}
                rows={1}
              />
              
              {/* Edit actions */}
              <div className="flex items-center justify-end gap-2 mt-2 pt-2 border-t border-gray-200">
                <button
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                  className="p-1 rounded hover:bg-gray-100 transition-colors disabled:opacity-50"
                  title="Hủy chỉnh sửa (Esc)"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={isSaving || editContent.trim() === content.trim()}
                  className="p-1 rounded hover:bg-green-100 transition-colors disabled:opacity-50"
                  title="Lưu thay đổi (Enter)"
                >
                  {isSaving ? (
                    <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 text-green-600" />
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Normal message bubble */
            <div className={cn(
              "relative px-4 py-3 rounded-2xl break-words shadow-sm",
              senderId === user.id 
                ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-br-sm" 
                : "bg-white text-gray-900 rounded-bl-sm border border-gray-200",
              "max-w-full"
            )}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {content}
              </p>
            </div>
          )}
        </div>

        {/* Timestamp, status, and edited indicator */}
        <div className={cn(
          "flex items-center gap-1 mt-1 px-2",
          senderId === user.id ? "flex-row-reverse" : "flex-row"
        )}>
          <span className="text-xs text-gray-400">
            {formatRelativeTime(convertedTimestamp)}
          </span>
          {senderId === user.id && getStatusIcon()}
        </div>
      </div>
    </div>
  )
}

export default MessageBubble 