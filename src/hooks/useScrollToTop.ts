import { useEffect, useRef, useCallback } from 'react'

interface UseScrollToTopOptions {
  threshold?: number // Distance from top to trigger (default: 50px)
  throttleMs?: number // Throttle delay (default: 300ms)
  onScrollToTop: () => void // Callback when scroll reaches top
  enabled?: boolean // Whether the detection is enabled (default: true)
  onMiddleZoneChange?: (inZone: boolean) => void // Callback when trigger enters/exits middle zone
}

export const useScrollToTop = ({
  threshold = 50,
  throttleMs = 300,
  onScrollToTop,
  enabled = true,
  onMiddleZoneChange
}: UseScrollToTopOptions) => {
  const scrollElementRef = useRef<HTMLDivElement>(null)
  const triggerElementRef = useRef<HTMLDivElement>(null)
  const lastCallTime = useRef<number>(0)
  const isThrottled = useRef<boolean>(false)

  const handleTrigger = useCallback(() => {
    if (!enabled) return

    const now = Date.now()
    
    // Throttle check with longer delay to prevent rapid re-triggering
    if (isThrottled.current || (now - lastCallTime.current) < throttleMs) {
      return
    }

    lastCallTime.current = now
    isThrottled.current = true
    
    console.log('Scroll to top triggered!')
    onScrollToTop()
    
    // Extended throttle period after triggering to allow scroll position to settle
    setTimeout(() => {
      isThrottled.current = false
    }, throttleMs + 1000) // Add extra 1 second cooldown
  }, [throttleMs, onScrollToTop, enabled])

  // Intersection Observer for when trigger element reaches middle of screen
  useEffect(() => {
    const triggerElement = triggerElementRef.current
    const scrollElement = scrollElementRef.current
    if (!triggerElement || !scrollElement) return

          const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Additional check: only trigger when element is in the middle portion of viewport
              const rect = entry.boundingClientRect
              const scrollRect = scrollElement.getBoundingClientRect()
              
              // Calculate middle zone (40% to 60% of container height)
              const containerHeight = scrollRect.height
              const middleZoneStart = scrollRect.top + (containerHeight * 0.4)
              const middleZoneEnd = scrollRect.top + (containerHeight * 0.6)
              
              // Check if trigger element center is in the middle zone
              const elementCenter = rect.top + (rect.height / 2)
              const inMiddleZone = elementCenter >= middleZoneStart && elementCenter <= middleZoneEnd
              
              // Notify about middle zone state change
              if (onMiddleZoneChange) {
                onMiddleZoneChange(inMiddleZone)
              }
              
              if (inMiddleZone) {
                console.log('Trigger element reached middle of screen!')
                handleTrigger()
              }
            } else {
              // Element is not intersecting, so not in middle zone
              if (onMiddleZoneChange) {
                onMiddleZoneChange(false)
              }
            }
          })
        },
      {
        root: scrollElementRef.current,
        rootMargin: '0px', // No margin, detect any intersection first
        threshold: [0, 0.5, 1] // Multiple thresholds for better detection
      }
    )

    observer.observe(triggerElement)
    
    return () => {
      observer.unobserve(triggerElement)
      observer.disconnect()
    }
  }, [handleTrigger, threshold])

  // Fallback scroll detection for cases where intersection observer might not work
  const handleScroll = useCallback(() => {
    const element = scrollElementRef.current
    if (!element || !enabled) return

    const { scrollTop } = element
    
    // Check if scrolled to top (within threshold)
    if (scrollTop <= threshold) {
      handleTrigger()
    }
  }, [threshold, handleTrigger, enabled])

  useEffect(() => {
    const element = scrollElementRef.current
    if (!element) return

    element.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      element.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  return { scrollElementRef, triggerElementRef }
} 