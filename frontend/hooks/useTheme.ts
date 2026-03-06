/**
 * useTheme Hook
 * Custom hook for managing theme
 */

import { useState, useEffect, useCallback } from 'react'
import { themeService } from '@/services/theme'

type Theme = 'light' | 'dark' | 'system'

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>('system')
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light')
  const [isLoaded, setIsLoaded] = useState(false)
  
  useEffect(() => {
    // Initialize theme
    const currentTheme = themeService.getTheme()
    setTheme(currentTheme)
    setEffectiveTheme(themeService.getEffectiveTheme())
    setIsLoaded(true)
    
    // Subscribe to theme changes
    const unsubscribe = themeService.subscribe((newTheme: Theme) => {
      setTheme(newTheme)
      setEffectiveTheme(themeService.getEffectiveTheme())
    })
    
    return unsubscribe
  }, [])
  
  const toggleTheme = useCallback(() => {
    const newTheme = effectiveTheme === 'light' ? 'dark' : 'light'
    themeService.setTheme(newTheme)
  }, [effectiveTheme])
  
  const setThemeValue = useCallback((newTheme: Theme) => {
    themeService.setTheme(newTheme)
  }, [])
  
  return {
    theme,
    effectiveTheme,
    toggleTheme,
    setTheme: setThemeValue,
    isLoaded,
  }
}
