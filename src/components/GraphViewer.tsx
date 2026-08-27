import { useEffect, useRef, useCallback, useState } from 'react'
import DOMPurify from 'dompurify'
import svgPanZoom from 'svg-pan-zoom'
import { Toolbar } from './Toolbar'

interface GraphViewerProps {
  svgContent: string
  filename: string
}

function tightenViewBoxToGraph(svgEl: SVGSVGElement) {
  const graph = svgEl.querySelector('#graph0, g.graph') as SVGGElement | null
  if (!graph) return

  const box = graph.getBBox()
  if (!isFinite(box.x) || !isFinite(box.y) || box.width <= 0 || box.height <= 0) return

  const pad = Math.max(8, Math.min(box.width, box.height) * 0.03)
  const x = box.x - pad
  const y = box.y - pad
  const w = box.width + pad * 2
  const h = box.height + pad * 2

  svgEl.setAttribute('viewBox', `${x} ${y} ${w} ${h}`)
  svgEl.setAttribute('preserveAspectRatio', 'xMidYMid meet')
}

export function GraphViewer({ svgContent, filename }: GraphViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const panZoomRef = useRef<ReturnType<typeof svgPanZoom> | null>(null)
  const [zoomPercent, setZoomPercent] = useState(100)

  const destroyPanZoom = () => {
    if (panZoomRef.current) {
      try { panZoomRef.current.destroy() } catch { /* ignore */ }
      panZoomRef.current = null
    }
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container || !svgContent) return

    // Sanitize before injecting
    const clean = DOMPurify.sanitize(svgContent, {
      USE_PROFILES: { svg: true, svgFilters: true },
    })
    container.innerHTML = clean

    const svgEl = container.querySelector('svg')
    if (!svgEl) return

    // svg-pan-zoom may remove viewBox during init; set explicit pixel size so
    // it measures the real viewport instead of falling back to 300x150.
    const { width: cw, height: ch } = container.getBoundingClientRect()
    svgEl.setAttribute('width', `${cw}`)
    svgEl.setAttribute('height', `${ch}`)
    svgEl.style.display = 'block'
    tightenViewBoxToGraph(svgEl)

    // Defer pan-zoom init to the next frame so the browser has laid out the
    // SVG at its final CSS size before svg-pan-zoom measures it.
    let rafId: number
    const initPanZoom = () => {
      destroyPanZoom()
      panZoomRef.current = svgPanZoom(svgEl, {
        zoomEnabled: true,
        controlIconsEnabled: false,
        fit: true,
        center: true,
        minZoom: 0.05,
        maxZoom: 40,
        mouseWheelZoomEnabled: true,
        onZoom: (scale) => setZoomPercent(Math.round(scale * 100)),
      })
      const pz = panZoomRef.current
      pz.resize()
      pz.fit()
      pz.center()
      setZoomPercent(Math.round(pz.getZoom() * 100))
    }
    rafId = requestAnimationFrame(initPanZoom)

    return () => {
      cancelAnimationFrame(rafId)
      destroyPanZoom()
    }
  }, [svgContent])

  const handleDownload = useCallback(() => {
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const base = filename.replace(/\.[^.]+$/, '')
    a.href = url
    a.download = `${base}.svg`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [svgContent, filename])

  const handleFit = () => {
    const pz = panZoomRef.current
    if (!pz) return
    pz.resize()
    pz.fit()
    pz.center()
    setZoomPercent(Math.round(pz.getZoom() * 100))
  }

  const handleZoomIn = () => {
    const pz = panZoomRef.current
    if (!pz) return
    pz.zoomIn()
    setZoomPercent(Math.round(pz.getZoom() * 100))
  }

  const handleZoomOut = () => {
    const pz = panZoomRef.current
    if (!pz) return
    pz.zoomOut()
    setZoomPercent(Math.round(pz.getZoom() * 100))
  }

  const handleReset = () => {
    const pz = panZoomRef.current
    if (!pz) return
    pz.resize()
    pz.fit()
    pz.center()
    setZoomPercent(Math.round(pz.getZoom() * 100))
  }

  return (
    <div className="flex flex-col w-full h-full border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <Toolbar
        filename={filename}
        onDownload={handleDownload}
        onFitScreen={handleFit}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onReset={handleReset}
        zoomPercent={zoomPercent}
      />
      <div
        id="svg-container"
        ref={containerRef}
        className="flex-1 bg-white min-h-0"
        style={{ minHeight: '70vh' }}
        aria-label="Graph SVG viewer"
      />
    </div>
  )
}
