const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

function getBackendOrigin() {
  try {
    return new URL(API_URL).origin
  } catch {
    return window.location.origin
  }
}

export function resolveMediaUrl(value?: string | null) {
  if (!value) return ''
  if (/^https?:\/\//i.test(value)) return value

  const path = value.startsWith('/') ? value : `/${value}`
  return `${getBackendOrigin()}${path}`
}
