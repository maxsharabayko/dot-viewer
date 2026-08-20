import { useState } from 'react'
import { FileUploader } from './components/FileUploader'
import { GraphViewer } from './components/GraphViewer'
import { ErrorPanel } from './components/ErrorPanel'
import { useGraphviz } from './hooks/useGraphviz'

export default function App() {
  const [filename, setFilename] = useState('graph')
  const { svgContent, loading, error, render } = useGraphviz()

  const handleDotLoaded = (dot: string, name: string) => {
    setFilename(name)
    render(dot)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-indigo-700 text-white px-6 py-4 shadow-md flex items-center gap-3">
        <svg className="w-7 h-7 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
            d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
        </svg>
        <div>
          <h1 className="text-xl font-bold leading-none">DOT Graph Viewer</h1>
          <p className="text-indigo-200 text-xs mt-0.5">Render Graphviz .dot files entirely in your browser</p>
        </div>
      </header>

      <main className="flex-1 min-h-0 flex flex-col items-center gap-6 p-6">
        {/* Upload area — always visible so user can load another file */}
        <section aria-label="File upload" className="w-full max-w-2xl">
          <FileUploader onDotLoaded={handleDotLoaded} />
        </section>

        {/* Loading spinner */}
        {loading && (
          <div role="status" aria-live="polite" className="flex items-center gap-3 text-indigo-600">
            <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <span className="font-medium">Rendering graph…</span>
          </div>
        )}

        {/* Error */}
        {!loading && error && <ErrorPanel message={error} />}

        {/* SVG viewer */}
        {!loading && !error && svgContent && (
          <section
            aria-label="Graph viewer"
            className="w-full flex-1 min-h-0"
            style={{ minHeight: '70vh' }}
          >
            <GraphViewer svgContent={svgContent} filename={filename} />
          </section>
        )}

        {/* Empty state */}
        {!loading && !error && !svgContent && (
          <p className="text-gray-400 text-sm mt-4">
            Upload a <code className="bg-gray-100 px-1 rounded">.dot</code> or{' '}
            <code className="bg-gray-100 px-1 rounded">.gv</code> file to get started.
          </p>
        )}
      </main>

      <footer className="text-center text-xs text-gray-400 py-3">
        Rendering powered by{' '}
        <a href="https://github.com/nicolo-ribaudo/graphviz-wasm" target="_blank" rel="noopener noreferrer" className="underline">
          @hpcc-js/wasm
        </a>{' '}
        · No data leaves your browser
      </footer>
    </div>
  )
}
