'use client'

import { AlertTriangle, X } from 'lucide-react'

interface DeleteMessageModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  messagePreview: string
  isDeleting?: boolean
}

const DeleteMessageModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  messagePreview,
  isDeleting = false 
}: DeleteMessageModalProps) => {
  if (!isOpen) return null

  const truncatedPreview = messagePreview.length > 50 
    ? messagePreview.substring(0, 50) + "..." 
    : messagePreview

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Xóa tin nhắn
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            disabled={isDeleting}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4">
            <p className="text-gray-700 mb-3">
              Bạn có chắc chắn muốn xóa tin nhắn này không? Hành động này không thể hoàn tác.
            </p>
            
            {/* Message preview */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-gray-600 font-medium mb-1">Tin nhắn:</p>
              <p className="text-sm text-gray-800 italic">&quot;{truncatedPreview}&quot;</p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-700">
                <strong>Cảnh báo:</strong> Khi đã xóa, tin nhắn này sẽ bị xóa vĩnh viễn cho tất cả những người tham gia cuộc trò chuyện.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Đang xóa...
              </>
            ) : (
              'Xóa tin nhắn'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteMessageModal 