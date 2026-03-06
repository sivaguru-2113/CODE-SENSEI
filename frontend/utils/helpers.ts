/**
 * Helper Utilities
 * General utility functions
 */

/**
 * Debounce function execution
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void => {
  let timeout: NodeJS.Timeout

  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Throttle function execution
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void => {
  let inThrottle: boolean

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

/**
 * Deep clone object
 */
export const deepClone = <T extends Record<string, any>>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Merge objects deeply
 */
export const deepMerge = <T extends Record<string, any>>(
  target: T,
  source: Partial<T>
): T => {
  const result = { ...target }

  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      const sourceValue = source[key]
      const targetValue = result[key]

      if (
        sourceValue &&
        typeof sourceValue === 'object' &&
        !Array.isArray(sourceValue)
      ) {
        result[key] = deepMerge(
          targetValue as Record<string, any>,
          sourceValue
        ) as any
      } else {
        result[key] = sourceValue as any
      }
    }
  }

  return result
}

/**
 * Sleep/delay execution
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Get unique array elements
 */
export const unique = <T>(array: T[]): T[] => {
  return Array.from(new Set(array))
}

/**
 * Group array by key
 */
export const groupBy = <T extends Record<string, any>>(
  array: T[],
  key: keyof T
): Record<string, T[]> => {
  return array.reduce(
    (result, item) => {
      const group = String(item[key])
      if (!result[group]) {
        result[group] = []
      }
      result[group].push(item)
      return result
    },
    {} as Record<string, T[]>
  )
}

/**
 * Sort array of objects
 */
export const sortBy = <T extends Record<string, any>>(
  array: T[],
  key: keyof T,
  order: 'asc' | 'desc' = 'asc'
): T[] => {
  return [...array].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]

    if (aVal < bVal) return order === 'asc' ? -1 : 1
    if (aVal > bVal) return order === 'asc' ? 1 : -1
    return 0
  })
}

/**
 * Filter array of objects by multiple keys
 */
export const filterBy = <T extends Record<string, any>>(
  array: T[],
  filters: Partial<T>
): T[] => {
  return array.filter((item) => {
    for (const key in filters) {
      if (item[key] !== filters[key]) {
        return false
      }
    }
    return true
  })
}

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // Fallback for older browsers
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      return true
    }
  } catch {
    return false
  }
}

/**
 * Generate UUID v4
 */
export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Get query parameter from URL
 */
export const getQueryParam = (param: string): string | null => {
  if (typeof window === 'undefined') return null

  const searchParams = new URLSearchParams(window.location.search)
  return searchParams.get(param)
}

/**
 * Build query string from object
 */
export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams()

  for (const key in params) {
    if (params.hasOwnProperty(key) && params[key] !== null) {
      searchParams.append(key, String(params[key]))
    }
  }

  return searchParams.toString()
}
/**
 * Code Analysis Utilities
 */

export function formatScore(score: number): string {
  return score.toFixed(0)
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-400'
  if (score >= 60) return 'text-yellow-400'
  if (score >= 40) return 'text-orange-400'
  return 'text-red-400'
}

export function getScoreBgColor(score: number): string {
  if (score >= 80) return 'bg-green-900/20'
  if (score >= 60) return 'bg-yellow-900/20'
  if (score >= 40) return 'bg-orange-900/20'
  return 'bg-red-900/20'
}

export function getSeverityColor(severity: 'critical' | 'warning' | 'info'): string {
  switch (severity) {
    case 'critical':
      return 'text-red-400'
    case 'warning':
      return 'text-yellow-400'
    case 'info':
      return 'text-blue-400'
  }
}

export function getSeverityBgColor(severity: 'critical' | 'warning' | 'info'): string {
  switch (severity) {
    case 'critical':
      return 'bg-red-900/20 border-l-red-500'
    case 'warning':
      return 'bg-yellow-900/20 border-l-yellow-500'
    case 'info':
      return 'bg-blue-900/20 border-l-blue-500'
  }
}

export function truncateCode(code: string, maxLength: number = 100): string {
  if (code.length <= maxLength) return code
  return code.substring(0, maxLength) + '...'
}

export function highlightCodeLine(code: string, lineNumber: number): string {
  const lines = code.split('\n')
  if (lineNumber < 1 || lineNumber > lines.length) return code

  const highlightedLines = lines.map((line, index) =>
    index === lineNumber - 1 ? `>>> ${line}` : `    ${line}`
  )

  return highlightedLines.join('\n')
}

export function calculateReadability(score: number): string {
  if (score >= 80) return 'Excellent'
  if (score >= 60) return 'Good'
  if (score >= 40) return 'Fair'
  return 'Poor'
}

export function calculateComplexityDescription(complexity: string): string {
  switch (complexity) {
    case 'O(1)':
      return 'Constant time - excellent performance'
    case 'O(log n)':
      return 'Logarithmic time - very efficient'
    case 'O(n)':
      return 'Linear time - good for most cases'
    case 'O(n log n)':
      return 'Linearithmic time - common in sorting'
    case 'O(n²)':
      return 'Quadratic time - may have performance issues'
    case 'O(n³)':
      return 'Cubic time - likely inefficient'
    default:
      return 'Unknown complexity'
  }
}