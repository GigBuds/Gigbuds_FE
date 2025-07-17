'use client'

import LoadingComponent from '../LoadingComponent/LoadingComponent'

interface LoadMoreButtonProps {
  onLoadMore: () => void
  isLoading: boolean
  hasMore: boolean
  className?: string
}

const LoadMoreButton = ({ 
  onLoadMore, 
  isLoading, 
  hasMore, 
  className = "" 
}: LoadMoreButtonProps) => {
  if (!hasMore) {
    return null
  }

  return (
    <div className={`flex justify-center py-4 ${className}`}>
      <button
        onClick={onLoadMore}
        disabled={isLoading}
        className="px-6 py-2 text-sm bg-white hover:bg-gray-50 border border-gray-200 rounded-full shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <LoadingComponent size={16} animationType="outline" />
            <span>Loading...</span>
          </div>
        ) : (
          "Load older messages"
        )}
      </button>
    </div>
  )
}

export default LoadMoreButton 