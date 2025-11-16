# Chat Implementation Guide

This document explains the chat implementation based on the sse-test-ui structure.

## Architecture Overview

The chat system uses **Server-Sent Events (SSE)** for real-time streaming of AI responses. It follows an event-based architecture that supports:

- **Streaming text responses** - Character-by-character streaming from the AI
- **Tool call events** - Shows when the AI calls internal tools
- **Agent decisions** - Displays AI reasoning and agent selection
- **Tool responses** - Shows results from tool executions

## File Structure

```
src/
├── hooks/
│   └── useChatSSE.ts          # Custom hook for SSE chat streaming
├── components/
│   └── chat/
│       ├── ChatMessage.tsx    # Message display component
│       └── EventDisplay.tsx   # Event cards (tools, agents, etc.)
├── types/
│   └── chat.ts                # TypeScript interfaces for chat
└── pages/
    └── Assistant.tsx          # Example usage
```

## Key Components

### 1. useChatSSE Hook

**Location:** `src/hooks/useChatSSE.ts`

A custom React hook that handles SSE streaming from the chat API.

```typescript
const { sendMessage, isLoading, error, cancel } = useChatSSE()

await sendMessage(
  endpoint,      // API endpoint (e.g., '/api/chat')
  payload,       // Chat request payload
  onEvent,       // Callback for each SSE event
  onComplete     // Callback when stream completes
)
```

**Features:**
- Automatic SSE stream parsing
- JSON event parsing
- `[DONE]` signal handling
- AbortController support for cancellation
- Error handling with state management

### 2. ChatMessage Component

**Location:** `src/components/chat/ChatMessage.tsx`

Displays individual chat messages with support for:
- User messages (right-aligned, primary color)
- Assistant messages (left-aligned, secondary color)
- Streaming indicator badge
- Event cards for tool calls and agent decisions
- Markdown rendering for assistant responses

**Props:**
```typescript
interface ChatMessageProps {
  message: ChatMessage
}
```

### 3. EventDisplay Component

**Location:** `src/components/chat/EventDisplay.tsx`

Renders different types of events from the AI:

#### Event Types:

**Agent Decision**
```typescript
{ type: 'agent_decision', agent_name: 'search' }
```
Shows which agent the AI selected for the task.

**Tool Start**
```typescript
{
  type: 'tool_start',
  data: {
    id: 'call_123',
    name: 'web_search',
    args: { query: 'university exams' }
  }
}
```
Shows when a tool is being called with its arguments.

**Tool Response**
```typescript
{
  type: 'tool_response',
  data: {
    name: 'web_search',
    result: { ... }
  }
}
```
Shows the result returned from a tool.

**Message**
```typescript
{ type: 'message', content: 'Hello!' }
```
Plain text content from the assistant.

## Message Flow

### 1. User Sends Message

```typescript
const userMessage: ChatMessage = {
  id: `user-${Date.now()}`,
  type: 'user',
  content: input,
  timestamp: new Date().toISOString(),
}
setMessages(prev => [...prev, userMessage])
```

### 2. Initialize Assistant Message

```typescript
const assistantMsg: ChatMessage = {
  id: `assistant-${Date.now()}`,
  type: 'assistant',
  events: [],
  streamedText: '',
  isStreaming: true,
  timestamp: new Date().toISOString(),
}
setCurrentAssistantMessage(assistantMsg)
```

### 3. Stream Events

```typescript
await sendMessage(endpoint, payload,
  (event) => {
    // Handle each SSE event
    if (event.type === 'message') {
      // Append to streamed text
      setCurrentAssistantMessage(prev => ({
        ...prev,
        streamedText: prev.streamedText + event.content
      }))
    } else {
      // Add to events array
      setCurrentAssistantMessage(prev => ({
        ...prev,
        events: [...prev.events, event]
      }))
    }
  },
  () => {
    // Mark as complete
    setCurrentAssistantMessage(prev => ({
      ...prev,
      isStreaming: false
    }))
  }
)
```

### 4. Move to Messages Array

```typescript
useEffect(() => {
  if (currentAssistantMessage && !currentAssistantMessage.isStreaming) {
    const messageExists = messages.some(m => m.id === currentAssistantMessage.id)
    if (!messageExists) {
      setMessages(prev => [...prev, currentAssistantMessage])
      setCurrentAssistantMessage(null)
    }
  }
}, [currentAssistantMessage, messages])
```

## TypeScript Interfaces

### ChatMessage
```typescript
interface ChatMessage {
  id: string
  type: 'user' | 'assistant'
  content?: string           // For user messages
  events?: ChatEvent[]       // For assistant events
  streamedText?: string      // For assistant text
  isStreaming?: boolean      // Streaming status
  timestamp: string
}
```

### ChatEvent
```typescript
interface ChatEvent {
  type: 'agent_decision' | 'tool_start' | 'tool_response' | 'message' | string
  agent_name?: string
  content?: string
  data?: {
    id?: string
    name?: string
    args?: Record<string, unknown>
    result?: unknown
  }
}
```

### ChatPayload
```typescript
interface ChatPayload {
  message: string
  thread_id: string
  url: string
  school: string
  department: string
}
```

## SSE Stream Format

The backend sends data in SSE format:

```
data: {"type":"agent_decision","agent_name":"search"}

data: {"type":"tool_start","data":{"id":"call_123","name":"web_search","args":{"query":"exams"}}}

data: {"type":"message","content":"I "}

data: {"type":"message","content":"found "}

data: {"type":"message","content":"the exams."}

data: {"type":"tool_response","data":{"name":"web_search","result":"..."}}

data: [DONE]
```

## Usage Example

```typescript
import { useChatSSE } from '../hooks/useChatSSE'
import { ChatMessage as ChatMessageType } from '../types/chat'
import { ChatMessage } from '../components/chat/ChatMessage'

function MyChatComponent() {
  const [messages, setMessages] = useState<ChatMessageType[]>([])
  const [currentMessage, setCurrentMessage] = useState<ChatMessageType | null>(null)
  const { sendMessage, isLoading, error } = useChatSSE()

  const handleSend = async (text: string) => {
    // Add user message
    const userMsg: ChatMessageType = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    }
    setMessages(prev => [...prev, userMsg])

    // Initialize assistant message
    const assistantMsg: ChatMessageType = {
      id: `assistant-${Date.now()}`,
      type: 'assistant',
      events: [],
      streamedText: '',
      isStreaming: true,
      timestamp: new Date().toISOString(),
    }
    setCurrentMessage(assistantMsg)

    // Send to API
    await sendMessage(
      '/api/chat',
      {
        message: text,
        thread_id: 'my-thread',
        url: 'https://example.com',
        school: 'My University',
        department: 'CS',
      },
      (event) => {
        setCurrentMessage(prev => {
          if (!prev) return prev
          if (event.type === 'message') {
            return { ...prev, streamedText: prev.streamedText + event.content }
          }
          return { ...prev, events: [...prev.events, event] }
        })
      },
      () => {
        setCurrentMessage(prev => prev ? { ...prev, isStreaming: false } : prev)
      }
    )
  }

  return (
    <div>
      {messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
      {currentMessage && <ChatMessage message={currentMessage} />}
      {error && <div>Error: {error}</div>}
    </div>
  )
}
```

## Markdown Support

Assistant messages are rendered with **react-markdown** for rich text formatting:

- **Bold**, *italic*, `code`
- Lists (ordered and unordered)
- Code blocks with syntax highlighting
- Links and images
- Blockquotes

## Styling

Event cards use MUI's color system:
- **Agent Decision**: `info.light` (blue)
- **Tool Call**: `warning.light` (orange)
- **Tool Response**: `success.light` (green)
- **Unknown**: `grey.200`

All cards are collapsible with expand/collapse animation.

## Best Practices

1. **Thread ID Management**: Use consistent thread IDs for conversation continuity
2. **Error Handling**: Always display errors to users
3. **Loading States**: Show streaming indicator during active streams
4. **Auto-scroll**: Scroll to bottom on new messages
5. **Cleanup**: Cancel streams on component unmount

## Differences from Simple Chat

Compared to a basic chat implementation, this system:
- ✅ Shows AI reasoning process (tool calls, agent decisions)
- ✅ Streams responses character-by-character
- ✅ Supports rich markdown formatting
- ✅ Handles complex multi-step AI workflows
- ✅ Provides detailed event inspection

## Future Enhancements

- [ ] Message editing
- [ ] Message deletion
- [ ] Export conversation
- [ ] Copy code blocks
- [ ] Syntax highlighting for code
- [ ] Image rendering in messages
- [ ] Audio message support
- [ ] File attachments
