interface ToolbarProps {
  filename: string
  onDownload: () => void
  onFitScreen: () => void
  onZoomIn: () => void
  onZoomOut: () => void
  onReset: () => void
  zoomPercent: number
}

export function Toolbar({ filename, onDownload, onFitScreen, onZoomIn, onZoomOut, onReset, zoomPercent }: ToolbarProps) {
  const btnBase =
    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400'
  const btn = `${btnBase} bg-white border border-gray-200 text-gray-700 hover:bg-gray-50`
  const btnPrimary = `${btnBase} bg-indigo-600 text-white hover:bg-indigo-700`

  return (
    <div className="flex flex-wrap items-center gap-2 px-4 py-2 bg-gray-50 border-b border-gray-200">
      <span className="text-xs text-gray-500 mr-auto truncate max-w-xs" title={filename}>
        📄 {filename}
      </span>

      <button className={btn} onClick={onZoomIn} aria-label="Zoom in">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0zm-6-3v6m-3-3h6" /></svg>
        Zoom In
      </button>

      <button className={btn} onClick={onZoomOut} aria-label="Zoom out">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0zm-9-3h6" /></svg>
        Zoom Out
      </button>

      <button className={btn} onClick={onFitScreen} aria-label="Fit to screen">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4h4M4 16v4h4m12-12V4h-4m4 12v4h-4" /></svg>
        Fit
      </button>

      <button className={btn} onClick={onReset} aria-label="Reset view">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582M20 20v-5h-.581M4.582 9A8 8 0 1119.418 15" /></svg>
        Reset
      </button>

      <span className="text-xs text-gray-500 px-2" aria-label="Current zoom level">
        {zoomPercent}%
      </span>

      <button className={btnPrimary} onClick={onDownload} aria-label="Download SVG">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" /></svg>
        Download SVG
      </button>
    </div>
  )
}
