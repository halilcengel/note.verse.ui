# University Chat Assistant

A React + Vite chat application that connects to a university announcement API using Server-Sent Events (SSE) for real-time streaming responses with tool call visualization.

## Features

- **Real-time Chat Interface**: Send messages and receive streaming responses
- **SSE Streaming**: Real-time response streaming from the backend
- **Tool Call Visualization**: Display agent decisions, tool calls, and responses
- **Configurable Settings**: Customize API endpoint, thread ID, university URL, school, and department
- **Auto-scroll**: Automatically scroll to the latest messages
- **Message History**: Keep track of conversation history
- **Loading States**: Visual indicators for message sending and receiving

## Getting Started

### Installation

```bash
cd sse-test-ui
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

## Usage

### Basic Chat

1. Open the application in your browser
2. Type your message in the input field (e.g., "7 kasımda hangi sınavlar var?")
3. Press Enter or click the "Send" button
4. Watch as the assistant responds with streaming content

### Configuration

Click the "⚙️ Settings" button to configure:

- **API Endpoint**: Your backend chat endpoint (default: `http://127.0.0.1:8000/chat`)
- **Thread ID**: Conversation thread identifier (default: `test-4`)
- **University URL**: University website URL (default: `https://eem.bakircay.edu.tr`)
- **School Name**: Name of the school (default: `Izmir Bakircay Universitesi`)
- **Department**: Department name (default: `Elektrik Elektronik Mühendisliği`)

### API Format

The application sends POST requests with the following payload:

```json
{
  "message": "7 kasımda hangi sınavlar var?",
  "thread_id": "test-4",
  "url": "https://eem.bakircay.edu.tr",
  "school": "Izmir Bakircay Universitesi",
  "department": "Elektrik Elektronik Mühendisliği"
}
```

### SSE Response Format

The application expects Server-Sent Events in the following formats:

```
data: {"type": "agent_decision", "agent_name": "announcement_agent"}

data: {"type": "tool_start", "data": {"name": "scrape_announcements", "args": {}, "id": "call_123"}}

data: {"type": "tool_response", "data": {"name": "scrape_announcements", "result": {...}}}

data: {"type": "message", "content": "text content"}

data: [DONE]
```

## Event Types

The chat interface visualizes different event types:

- **Agent Decision** (Green border): Shows which agent is processing the request
- **Tool Call** (Blue border): Displays tool invocations with their arguments
- **Tool Response** (Purple border): Shows tool execution results
- **Streaming Messages** (Green border): Real-time assistant response text

## Project Structure

```
sse-test-ui/
├── src/
│   ├── components/
│   │   ├── ChatMessage.jsx       # Chat message component
│   │   ├── ChatMessage.css       # Chat message styling
│   │   ├── EventDisplay.jsx      # Event visualization components
│   │   └── EventDisplay.css      # Event styling
│   ├── hooks/
│   │   ├── useChatSSE.js         # Chat SSE hook for POST requests
│   │   └── useSSE.js             # Generic SSE hook
│   ├── App.jsx                   # Main chat interface
│   ├── App.css                   # Application styling
│   ├── index.css                 # Global styles
│   └── main.jsx                  # Application entry point
├── package.json
└── README.md
```

## Key Components

### useChatSSE Hook

Custom hook that handles POST requests with SSE streaming:
- Manages loading states
- Handles streaming data parsing
- Supports request cancellation
- Error handling

### ChatMessage Component

Renders individual chat messages:
- User messages (blue bubble)
- Assistant messages with events and streaming text
- Loading indicators

### EventDisplay Component

Visualizes different SSE event types:
- Agent decisions
- Tool calls with arguments
- Tool responses with results
- Message content

## Technologies Used

- React 18
- Vite 7
- Fetch API with ReadableStream for SSE
- CSS3 for styling

## Example Queries

- "7 kasımda hangi sınavlar var?" (Which exams are on November 7?)
- "Diferansiyel Denklemler sınavı ne zaman?" (When is the Differential Equations exam?)
- "Elektrik Makineleri sınavı hangi sınıfta?" (Which classroom is the Electric Machines exam in?)

## Development Notes

- The application uses the Fetch API instead of EventSource to support POST requests with SSE
- Streaming responses are parsed line by line to handle SSE data format
- Messages are stored in React state for conversation history
- The UI automatically scrolls to show the latest messages

## License

MIT
