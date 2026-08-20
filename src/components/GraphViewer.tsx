import { useEffect, useRef, useCallback, useState } from 'react'
import DOMPurify from 'dompurify'
import svgPanZoom from 'svg-pan-zoom'
import { Toolbar } from './Toolbar'

interface GraphViewerProps {
  svgContent: string
  filename: string
}

function fitToGraph(pz: ReturnType<typeof svgPanZoom>, svgEl: SVGSVGElement) {
  const graph = (svgEl.querySelector('#graph0') ||
    svgEl.querySelector('g.graph')) as SVGGElement | null
  if (!graph) {
    pz.resize()
    pz.fit()
    pz.center()
    return
  }

  const sizes = pz.getSizes()
  const box = graph.getBBox()

  if (!isFinite(box.x) || !isFinite(box.y) || box.width <= 0 || box.height <= 0) {
    pz.resize()
    pz.fit()
    pz.center()
    return
  }

  const pad = 24
  const scale = Math.min(
    (sizes.width - pad * 2) / box.width,
    (sizes.height - pad * 2) / box.height,
  )

  pz.zoom(scale)
  pz.pan({
    x: (sizes.width - box.width * scale) / 2 - box.x * scale,
    y: (sizes.height - box.height * scale) / 2 - box.y * scale,
  })
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

    // Ensure viewBox exists so svg-pan-zoom can determine dimensions.
    if (!svgEl.getAttribute('viewBox')) {
      const w = svgEl.viewBox.baseVal.width || svgEl.width.baseVal.value || 1
      const h = svgEl.viewBox.baseVal.height || svgEl.height.baseVal.value || 1
      svgEl.setAttribute('viewBox', `0 0 ${w} ${h}`)
    }
    // Preserve the viewBox origin — graphviz may emit negative x/y values that
    // place content correctly; stripping them crops the rendered graph.
    svgEl.style.display = 'block'

    destroyPanZoom()
    panZoomRef.current = svgPanZoom(svgEl, {
      zoomEnabled: true,
      controlIconsEnabled: false,
      fit: false,
      center: false,
      minZoom: 0.05,
      maxZoom: 40,
      mouseWheelZoomEnabled: true,
      onZoom: (scale) => setZoomPercent(Math.round(scale * 100)),
    })
    const pz = panZoomRef.current
    fitToGraph(pz, svgEl)
    setZoomPercent(Math.round(pz.getZoom() * 100))

    return () => { destroyPanZoom() }
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
    const container = containerRef.current
    if (!pz || !container) return
    const svgEl = container.querySelector('svg')
    if (!svgEl) return
    fitToGraph(pz, svgEl)
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
    pz.resetZoom()
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
