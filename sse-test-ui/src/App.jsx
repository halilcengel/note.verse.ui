import './App.css';

import { useEffect, useRef, useState } from 'react';

import { ChatMessage } from './components/ChatMessage';
import { useChatSSE } from './hooks/useChatSSE';

function App() {
  // Generate unique thread ID on component mount
  const generateThreadId = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    return `thread-${timestamp}-${random}`;
  };

  // Configuration state
  const [endpoint, setEndpoint] = useState('http://127.0.0.1:8000/chat');
  const [threadId, setThreadId] = useState(() => generateThreadId());
  const [url, setUrl] = useState('https://eem.bakircay.edu.tr');
  const [school, setSchool] = useState('Izmir Bakircay Universitesi');
  const [department, setDepartment] = useState('Elektrik Elektronik Mühendisliği');
  const [showConfig, setShowConfig] = useState(false);

  // Chat state
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentAssistantMessage, setCurrentAssistantMessage] = useState(null);

  const { sendMessage, isLoading, error, cancel } = useChatSSE();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentAssistantMessage]);

  // Move completed assistant message to messages array
  useEffect(() => {
    if (currentAssistantMessage && !currentAssistantMessage.isStreaming) {
      const messageExists = messages.some(m => m.id === currentAssistantMessage.id);
      if (!messageExists) {
        setMessages((prev) => [...prev, currentAssistantMessage]);
        setCurrentAssistantMessage(null);
      }
    }
  }, [currentAssistantMessage, messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');

    // Initialize assistant message
    const assistantMsg = {
      id: `assistant-${Date.now()}`,
      type: 'assistant',
      events: [],
      streamedText: '',
      isStreaming: true,
      timestamp: new Date().toISOString(),
    };
    setCurrentAssistantMessage(assistantMsg);

    const payload = {
      message: inputMessage,
      thread_id: threadId,
      url: url,
      school: school,
      department: department,
    };

    await sendMessage(
      endpoint,
      payload,
      (event) => {
        setCurrentAssistantMessage((prev) => {
          if (!prev) return prev;

          if (event.type === 'message') {
            return {
              ...prev,
              streamedText: prev.streamedText + event.content,
            };
          } else {
            return {
              ...prev,
              events: [...prev.events, event],
            };
          }
        });
      },
      () => {
        // On complete - just mark as not streaming, useEffect will move it to messages
        setCurrentAssistantMessage((prev) => {
          if (prev) {
            return { ...prev, isStreaming: false };
          }
          return prev;
        });
      }
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setCurrentAssistantMessage(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div>
            <h1>Chat Assistant</h1>
          </div>
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="config-toggle-btn"
          >
            {showConfig ? '✕ Close' : '⚙️ Settings'}
          </button>
        </div>
      </header>

      {showConfig && (
        <div className="config-panel">
          <h3>Configuration</h3>
          <div className="config-grid">
            <div className="config-field">
              <label>API Endpoint</label>
              <input
                type="text"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                placeholder="http://127.0.0.1:8000/chat"
              />
            </div>
            <div className="config-field">
              <label>Thread ID (auto-generated on page load)</label>
              <input
                type="text"
                value={threadId}
                onChange={(e) => setThreadId(e.target.value)}
                placeholder="thread-xxxxx-xxxxx"
              />
            </div>
            <div className="config-field">
              <label>University URL</label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://eem.bakircay.edu.tr"
              />
            </div>
            <div className="config-field">
              <label>School Name</label>
              <input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                placeholder="Izmir Bakircay Universitesi"
              />
            </div>
            <div className="config-field">
              <label>Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="Elektrik Elektronik Mühendisliği"
              />
            </div>
          </div>
        </div>
      )}

      <div className="chat-container">
        <div className="messages-area">
          {messages.length === 0 && !currentAssistantMessage && (
            <div className="empty-state">
              <div className="empty-icon">💬</div>
              <h2>Start a conversation</h2>
              <p>Ask questions about exams, schedules, or announcements</p>
              <div className="example-questions">
                <p className="example-label">Try asking:</p>
                <div className="example-question">7 kasımda hangi sınavlar var?</div>
                <div className="example-question">Diferansiyel Denklemler sınavı ne zaman?</div>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {currentAssistantMessage && !messages.some(m => m.id === currentAssistantMessage.id) && (
            <ChatMessage key="current-assistant" message={currentAssistantMessage} />
          )}

          {error && (
            <div className="error-message-box">
              <strong>Error:</strong> {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="input-area">
          {messages.length > 0 && (
            <button onClick={handleClearChat} className="clear-chat-btn" disabled={isLoading}>
              Clear Chat
            </button>
          )}
          <div className="input-container">
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here... (Press Enter to send)"
              disabled={isLoading}
              rows="1"
              className="message-input"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="send-btn"
            >
              {isLoading ? (
                <span className="loading-spinner">⏳</span>
              ) : (
                <span>Send ➤</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
