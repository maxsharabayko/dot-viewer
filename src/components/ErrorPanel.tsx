interface ErrorPanelProps {
  message: string
}

export function ErrorPanel({ message }: ErrorPanelProps) {
  // Try to extract a line number hint from the Graphviz error string.
  const lineMatch = message.match(/line[:\s]+(\d+)/i)
  const lineNum = lineMatch ? lineMatch[1] : null

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="w-full max-w-2xl mx-auto bg-red-50 border border-red-300 rounded-xl p-5 text-red-800"
    >
      <h2 className="font-bold text-base mb-2 flex items-center gap-2">
        <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
        DOT parsing / rendering failed
      </h2>
      {lineNum && (
        <p className="text-sm mb-1">
          <span className="font-medium">Line:</span> {lineNum}
        </p>
      )}
      <pre className="text-xs whitespace-pre-wrap break-all font-mono bg-red-100 rounded p-3 mt-2">
        {message}
      </pre>
    </div>
  )
}
