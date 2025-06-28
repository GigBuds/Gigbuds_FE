'use client'

import { cn } from '@/lib/utils'

interface OnlineStatusProps {
  status: 'online' | 'offline' | 'away' | 'busy'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
  showPulse?: boolean
}

const OnlineStatus = ({ 
  status, 
  size = 'sm', 
  className, 
  showPulse = true 
}: OnlineStatusProps) => {
  const sizeClasses = {
    xs: 'w-2 h-2',
    sm: 'w-3 h-3', 
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }

  const statusClasses = {
    online: 'bg-green-500',
    offline: 'bg-gray-500',
    away: 'bg-yellow-500',
    busy: 'bg-red-500'
  }

  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "rounded-full border-2 border-black",
          sizeClasses[size],
          statusClasses[status]
        )}
      />
      {status === 'online' && showPulse && (
        <div
          className={cn(
            "absolute inset-0 rounded-full animate-ping",
            sizeClasses[size],
            "bg-green-500 opacity-75"
          )}
        />
      )}
    </div>
  )
}

export default OnlineStatus 