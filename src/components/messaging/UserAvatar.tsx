'use client'

import { cn } from '@/lib/utils'
import Image from 'next/image'

interface UserAvatarProps {
  src: string
  alt: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const UserAvatar = ({ src, alt, size = 'md', className }: UserAvatarProps) => {
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  return (
    <div className={cn(
      "relative rounded-full overflow-hidden bg-gradient-to-br from-orange-400 to-orange-600 p-0.5",
      sizeClasses[size],
      className
    )}>
      <div className="w-full h-full rounded-full overflow-hidden bg-white">
        <Image
          src={src}
          alt={alt}
          width={64}
          height={64}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  )
}

export default UserAvatar 