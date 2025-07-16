'use client'

import { cn } from '@/lib/utils'
import Image from 'next/image'
import { useState } from 'react'

interface UserAvatarProps {
  src: string
  alt: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const UserAvatar = ({ src, alt, size = 'md', className }: UserAvatarProps) => {
  const [imageError, setImageError] = useState(false)

  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  const textSizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }

  // Generate initials from alt text
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className={cn(
      "relative rounded-full overflow-hidden bg-gradient-to-br from-orange-400 to-orange-600 p-0.5",
      sizeClasses[size],
      className
    )}>
      <div className="w-full h-full rounded-full overflow-hidden bg-white">
        {!imageError && src ? (
          <Image
            src={src}
            alt={alt}
            width={64}
            height={64}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-400 to-orange-600 text-white font-semibold">
            <span className={textSizeClasses[size]}>
              {getInitials(alt)}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserAvatar 