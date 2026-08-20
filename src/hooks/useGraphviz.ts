import { useState, useCallback } from 'react'
import { renderDot } from '../services/graphviz'

export interface GraphvizState {
  svgContent: string
  loading: boolean
  error: string | null
}

export function useGraphviz() {
  const [state, setState] = useState<GraphvizState>({
    svgContent: '',
    loading: false,
    error: null,
  })

  const render = useCallback(async (dot: string) => {
    setState({ svgContent: '', loading: true, error: null })
    try {
      const { svg } = await renderDot(dot)
      setState({ svgContent: svg, loading: false, error: null })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      setState({ svgContent: '', loading: false, error: message })
    }
  }, [])

  return { ...state, render }
}
