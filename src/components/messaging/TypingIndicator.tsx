'use client'

import { cn } from '@/lib/utils'

interface TypingIndicatorProps {
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
  variant?: 'dots' | 'bubble'
}

const TypingIndicator = ({ 
  size = 'sm', 
  className,
  variant = 'dots'
}: TypingIndicatorProps) => {
  const dotSizes = {
    xs: 'w-1 h-1',
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-3 h-3'
  }

  if (variant === 'bubble') {
    return (
      <div className={cn(
        "flex items-center gap-2 p-3 bg-white rounded-2xl rounded-bl-sm max-w-[60px] border border-gray-200 shadow-sm",
        className
      )}>
        <div className="flex items-center gap-1">
          <div className={cn(
            "rounded-full bg-gray-400 animate-pulse",
            dotSizes[size]
          )} style={{ animationDelay: '0ms' }} />
          <div className={cn(
            "rounded-full bg-gray-400 animate-pulse",
            dotSizes[size]
          )} style={{ animationDelay: '150ms' }} />
          <div className={cn(
            "rounded-full bg-gray-400 animate-pulse",
            dotSizes[size]
          )} style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    )
  }

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className={cn(
        "rounded-full bg-orange-500 animate-bounce",
        dotSizes[size]
      )} style={{ animationDelay: '0ms' }} />
      <div className={cn(
        "rounded-full bg-orange-500 animate-bounce",
        dotSizes[size]
      )} style={{ animationDelay: '150ms' }} />
      <div className={cn(
        "rounded-full bg-orange-500 animate-bounce",
        dotSizes[size]
      )} style={{ animationDelay: '300ms' }} />
    </div>
  )
}

export default TypingIndicator 