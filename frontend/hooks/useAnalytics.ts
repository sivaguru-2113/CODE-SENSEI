/**
 * useAnalytics Hook
 * Custom hook for tracking analytics events
 */

import { useCallback, useEffect } from 'react'

/** Lightweight analytics helpers (no external dependency) */
const analytics = {
  trackEvent: (name: string, properties?: Record<string, any>) => {
    if (typeof window !== 'undefined') {
      console.debug(`[Analytics] Event: ${name}`, properties);
    }
  },
  trackPageView: (page: string) => {
    if (typeof window !== 'undefined') {
      console.debug(`[Analytics] PageView: ${page}`);
    }
  },
  trackClick: (element: string) => {
    if (typeof window !== 'undefined') {
      console.debug(`[Analytics] Click: ${element}`);
    }
  },
  trackFormSubmit: (form: string) => {
    if (typeof window !== 'undefined') {
      console.debug(`[Analytics] FormSubmit: ${form}`);
    }
  },
};

export const useAnalytics = () => {
  const trackEvent = useCallback(
    (name: string, properties?: Record<string, any>) => {
      analytics.trackEvent(name, properties)
    },
    []
  )

  useEffect(() => {
    const pageName = window.location.pathname
    analytics.trackPageView(pageName)
  }, [])

  const trackClick = useCallback((elementName: string) => {
    analytics.trackClick(elementName)
  }, [])

  const trackFormSubmit = useCallback((formName: string) => {
    analytics.trackFormSubmit(formName)
  }, [])

  return {
    trackEvent,
    trackClick,
    trackFormSubmit,
  }
}
