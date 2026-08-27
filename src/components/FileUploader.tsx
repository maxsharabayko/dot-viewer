import React, { useCallback, useRef, useState } from 'react'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB
const ACCEPTED_EXTENSIONS = ['.dot', '.gv']
const ACCEPTED_MIME = [
  'text/plain',
  'application/octet-stream',
  'application/msword',
  'text/vnd.graphviz',
  'application/msword-template',
  '',
]

interface FileUploaderProps {
  onDotLoaded: (dot: string, filename: string) => void
}

function validateFile(file: File): string | null {
  if (file.size > MAX_FILE_SIZE) {
    return `File is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum allowed size is 5 MB.`
  }
  const ext = '.' + file.name.split('.').pop()?.toLowerCase()
  if (!ACCEPTED_EXTENSIONS.includes(ext)) {
    return `Unsupported file type "${ext}". Please upload a .dot or .gv file.`
  }
  if (file.type && !ACCEPTED_MIME.includes(file.type)) {
    return `Unexpected MIME type "${file.type}".`
  }
  return null
}

async function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Failed to read file.'))
    reader.readAsText(file, 'utf-8')
  })
}

export function FileUploader({ onDotLoaded }: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [fileError, setFileError] = useState<string | null>(null)

  const handleFile = useCallback(
    async (file: File) => {
      setFileError(null)
      const err = validateFile(file)
      if (err) {
        setFileError(err)
        return
      }
      try {
        const text = await readFileAsText(file)
        onDotLoaded(text, file.name)
      } catch {
        setFileError('Could not read file contents.')
      }
    },
    [onDotLoaded],
  )

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ''
  }

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div
        role="button"
        tabIndex={0}
        aria-label="Drop zone: drag and drop a .dot or .gv file here, or click to browse"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`
          w-full max-w-lg border-2 border-dashed rounded-xl p-10 text-center cursor-pointer
          transition-colors select-none
          ${dragOver
            ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
            : 'border-gray-300 bg-white hover:border-indigo-400 hover:bg-indigo-50 text-gray-500'}
        `}
      >
        <svg
          className="mx-auto mb-3 w-12 h-12 text-indigo-400"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M3 7a4 4 0 014-4h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M12 11v6m0 0l-2-2m2 2l2-2" />
        </svg>
        <p className="font-semibold text-lg">Drag &amp; drop a .dot or .gv file</p>
        <p className="text-sm mt-1">or <span className="text-indigo-600 underline">click to browse</span></p>
        <p className="text-xs mt-2 text-gray-400">Maximum file size: 5 MB</p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".dot,.gv,text/plain"
        className="hidden"
        onChange={onInputChange}
        aria-hidden="true"
      />

      {fileError && (
        <p role="alert" className="text-red-600 text-sm bg-red-50 border border-red-200 rounded px-4 py-2 w-full max-w-lg">
          {fileError}
        </p>
      )}
    </div>
  )
}
