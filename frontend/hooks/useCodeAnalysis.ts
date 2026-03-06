import { useState, useCallback, useEffect } from 'react'

export type Complexity = 'O(1)' | 'O(n)' | 'O(n²)' | 'O(n³)' | 'O(log n)' | 'O(n log n)' | 'Unknown'
export type Severity = 'critical' | 'warning' | 'info'

export interface CodeIssue {
  id: string
  type: string
  lineNumber: number
  severity: Severity
  description: string
  suggestion: string
}

export interface AnalysisMetrics {
  readability: number
  efficiency: number
  maintainability: number
  bestPractices: number
  errorHandling: number
}

export interface ComplexityAnalysis {
  timeComplexity: Complexity
  spaceComplexity: Complexity
  nestingDepth: number
  loopCount: number
}

export interface CodeAnalysisResult {
  id: string
  code: string
  language: string
  complexity: ComplexityAnalysis
  metrics: AnalysisMetrics
  issues: CodeIssue[]
  finalScore: number
  explanation: string
  timestamp: number
}

interface UseCodeAnalysisState {
  result: CodeAnalysisResult | null
  loading: boolean
  error: string | null
  history: CodeAnalysisResult[]
}

export function useCodeAnalysis() {
  const [state, setState] = useState<UseCodeAnalysisState>({
    result: null,
    loading: false,
    error: null,
    history: [],
  })

  useEffect(() => {
    // Load history from backend
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'
      const response = await fetch(`${baseUrl}/history`)
      if (response.ok) {
        const history = await response.json()
        setState(prev => ({ ...prev, history }))
      }
    } catch (error) {
      console.error('Failed to fetch history:', error)
    }
  }

  const analyzeCode = useCallback(async (code: string, language: string = 'javascript') => {
    if (!code.trim()) {
      setState(prev => ({ ...prev, error: 'Please enter some code' }))
      return
    }

    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'
      const response = await fetch(`${baseUrl}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, language }),
      })

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      const result = await response.json()
      setState(prev => ({ ...prev, result, loading: false, history: [result, ...prev.history] }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Analysis failed',
        loading: false,
      }))
    }
  }, [])

  const clearHistory = useCallback(async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'
      await fetch(`${baseUrl}/history`, { method: 'DELETE' })
      setState(prev => ({ ...prev, history: [], result: null }))
    } catch (error) {
      console.error('Failed to clear history:', error)
    }
  }, [])

  return {
    ...state,
    analyzeCode,
    clearHistory,
  }
}
