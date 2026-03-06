/**
 * useIsMobile Hook
 * Custom hook for detecting mobile viewport
 */

import { useState, useEffect } from 'react'

/**
 * Mobile breakpoint in pixels (default: Tailwind md breakpoint)
 */
const MOBILE_BREAKPOINT = 768

export const useIsMobile = (breakpoint: number = MOBILE_BREAKPOINT) => {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined)
  
  useEffect(() => {
    // Check initial state
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < breakpoint)
    }
    
    checkIsMobile()
    
    // Create media query
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
    
    // Handle changes
    const handleChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches)
    }
    
    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    } else {
      // Legacy browsers
      mediaQuery.addListener(handleChange)
      return () => mediaQuery.removeListener(handleChange)
    }
  }, [breakpoint])
  
  return isMobile
}
