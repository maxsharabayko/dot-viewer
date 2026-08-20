import { Graphviz } from '@hpcc-js/wasm'

type GraphvizInstance = Awaited<ReturnType<typeof Graphviz.load>>

let instance: GraphvizInstance | null = null

/** Lazily initialise the Graphviz WASM singleton. */
async function getInstance(): Promise<GraphvizInstance> {
  if (!instance) {
    instance = await Graphviz.load()
  }
  return instance
}

export interface RenderResult {
  svg: string
}

/**
 * Render a DOT string to SVG.
 * Throws a descriptive Error on parse / render failure.
 */
export async function renderDot(dot: string): Promise<RenderResult> {
  const gv = await getInstance()
  try {
    const svg = await gv.dot(dot, 'svg')
    return { svg }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    throw new Error(message)
  }
}
