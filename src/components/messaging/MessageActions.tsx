'use client'

import { Edit2, Trash2, MoreHorizontal } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface MessageActionsProps {
  messageId: string
  canEdit: boolean
  canDelete: boolean
  onEdit: () => void
  onDelete: () => void
  className?: string
}

const MessageActions = ({ 
  canEdit, 
  canDelete, 
  onEdit, 
  onDelete, 
  className 
}: MessageActionsProps) => {
  const [showActions, setShowActions] = useState(false)

  if (!canEdit && !canDelete) return null

  return (
    <div className={cn("relative", className)}>
      {/* Mobile dropdown button */}
      <button
        onClick={() => setShowActions(!showActions)}
        className="sm:hidden p-1.5 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Tùy chọn tin nhắn"
      >
        <MoreHorizontal className="w-4 h-4 text-gray-500" />
      </button>

      {/* Desktop hover actions */}
      <div className="hidden sm:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {canEdit && (
          <button
            onClick={onEdit}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            title="Chỉnh sửa tin nhắn"
            aria-label="Chỉnh sửa tin nhắn"
          >
            <Edit2 className="w-4 h-4 text-gray-500 hover:text-gray-700" />
          </button>
        )}
        {canDelete && (
          <button
            onClick={onDelete}
            className="p-1.5 rounded-full hover:bg-red-50 transition-colors"
            title="Xóa tin nhắn"
            aria-label="Xóa tin nhắn"
          >
            <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-600" />
          </button>
        )}
      </div>

      {/* Mobile dropdown menu */}
      {showActions && (
        <>
          {/* Backdrop */}
          <div 
            className="sm:hidden fixed inset-0 z-10" 
            onClick={() => setShowActions(false)}
          />
          
          {/* Menu */}
          <div className="sm:hidden absolute right-0 top-8 z-20 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[120px]">
            {canEdit && (
              <button
                onClick={() => {
                  onEdit()
                  setShowActions(false)
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Chỉnh sửa
              </button>
            )}
            {canDelete && (
              <button
                onClick={() => {
                  onDelete()
                  setShowActions(false)
                }}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Xóa
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default MessageActions 