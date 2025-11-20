// API configuration centralizes environment handling so every feature references
// the same base URLs and headers. Keep the comments—they help other agents stay
// aligned with the integration plan.
export const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8000'
export const API_WS_BASE = API_BASE.replace(/^http/i, 'ws')
export const API_KEY = import.meta.env.VITE_API_KEY ?? 'demo'

export const DEFAULT_HEADERS: Record<string, string> = {
  'Content-Type': 'application/json',
}

if (API_KEY) {
  DEFAULT_HEADERS['X-API-Key'] = API_KEY
}
