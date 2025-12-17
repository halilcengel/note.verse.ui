import {
  Search as SearchIcon,
  Storage as DatabaseIcon,
  Code as CodeIcon,
  Language as ApiIcon,
  Description as DocumentIcon,
  Calculate as CalculateIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material'

/**
 * Format a timestamp as relative time (e.g., "2s ago", "1m ago")
 */
export const formatRelativeTime = (timestamp) => {
  if (!timestamp) return ''
  
  const now = new Date()
  const time = new Date(timestamp)
  const diffInSeconds = Math.floor((now - time) / 1000)
  
  if (diffInSeconds < 1) return 'just now'
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`
  
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h ago`
  
  const diffInDays = Math.floor(diffInHours / 24)
  return `${diffInDays}d ago`
}

/**
 * Format duration in milliseconds to human-readable string
 */
export const formatDuration = (durationMs) => {
  if (!durationMs || durationMs < 0) return ''
  
  if (durationMs < 1000) return `${durationMs}ms`
  
  const seconds = (durationMs / 1000).toFixed(1)
  return `${seconds}s`
}

/**
 * Get icon component for a tool based on its name
 */
export const getToolIcon = (toolName) => {
  if (!toolName) return SettingsIcon
  
  const name = toolName.toLowerCase()
  
  if (name.includes('search') || name.includes('query')) return SearchIcon
  if (name.includes('database') || name.includes('db') || name.includes('sql')) return DatabaseIcon
  if (name.includes('api') || name.includes('http') || name.includes('fetch')) return ApiIcon
  if (name.includes('document') || name.includes('file') || name.includes('read')) return DocumentIcon
  if (name.includes('calculate') || name.includes('math') || name.includes('compute')) return CalculateIcon
  if (name.includes('code') || name.includes('execute') || name.includes('run')) return CodeIcon
  
  return SettingsIcon
}

/**
 * Match tool calls with their responses and calculate execution time
 */
export class ToolCallTracker {
  constructor() {
    this.pendingCalls = new Map() // id -> { call, startTime }
    this.completedCalls = new Map() // id -> { call, response, duration }
  }
  
  addToolCall(toolCall) {
    if (toolCall.data?.id) {
      this.pendingCalls.set(toolCall.data.id, {
        call: toolCall,
        startTime: Date.now(),
      })
    }
  }
  
  addToolResponse(toolResponse) {
    // Try to match by ID first
    if (toolResponse.data?.id) {
      const pending = this.pendingCalls.get(toolResponse.data.id)
      if (pending) {
        const duration = Date.now() - pending.startTime
        this.completedCalls.set(toolResponse.data.id, {
          call: pending.call,
          response: toolResponse,
          duration,
        })
        this.pendingCalls.delete(toolResponse.data.id)
        return { matched: true, duration }
      }
    }
    
    // Fallback: match by tool name (for responses without IDs)
    if (toolResponse.data?.name) {
      for (const [id, pending] of this.pendingCalls.entries()) {
        if (pending.call.data?.name === toolResponse.data.name) {
          const duration = Date.now() - pending.startTime
          this.completedCalls.set(id, {
            call: pending.call,
            response: toolResponse,
            duration,
          })
          this.pendingCalls.delete(id)
          return { matched: true, duration }
        }
      }
    }
    
    return { matched: false, duration: null }
  }
  
  isPending(toolCallId) {
    return this.pendingCalls.has(toolCallId)
  }
  
  getMatchedResponse(toolCallId) {
    return this.completedCalls.get(toolCallId)
  }
  
  getPendingCalls() {
    return Array.from(this.pendingCalls.values())
  }
}

/**
 * Syntax highlight JSON string
 */
export const syntaxHighlightJSON = (json) => {
  if (typeof json !== 'string') {
    json = JSON.stringify(json, null, 2)
  }
  
  return json
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?)/g, (match) => {
      let cls = 'json-string'
      if (/:$/.test(match)) {
        cls = 'json-key'
      }
      return `<span class="${cls}">${match}</span>`
    })
    .replace(/\b(true|false)\b/g, '<span class="json-boolean">$1</span>')
    .replace(/\b(null)\b/g, '<span class="json-null">$1</span>')
    .replace(/\b(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)\b/g, '<span class="json-number">$1</span>')
}

/**
 * Truncate long strings for preview
 */
export const truncateString = (str, maxLength = 100) => {
  if (!str || str.length <= maxLength) return str
  return str.substring(0, maxLength) + '...'
}

/**
 * Get a summary of a JSON object for preview
 */
export const getJSONSummary = (obj) => {
  if (typeof obj === 'string') {
    return truncateString(obj, 80)
  }
  
  if (Array.isArray(obj)) {
    return `Array (${obj.length} items)`
  }
  
  if (typeof obj === 'object' && obj !== null) {
    const keys = Object.keys(obj)
    if (keys.length === 0) return '{}'
    if (keys.length <= 3) {
      return `{ ${keys.join(', ')} }`
    }
    return `{ ${keys.slice(0, 3).join(', ')}, ... } (${keys.length} keys)`
  }
  
  return String(obj)
}
