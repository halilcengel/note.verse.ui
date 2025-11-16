import React from 'react';
import ReactMarkdown from 'react-markdown';
import { EventDisplay } from './EventDisplay';
import './ChatMessage.css';

export const ChatMessage = ({ message }) => {
  if (message.type === 'user') {
    return (
      <div className="chat-message user-message">
        <div className="message-header">
          <span className="message-sender">You</span>
        </div>
        <div className="message-content">{message.content}</div>
      </div>
    );
  }

  if (message.type === 'assistant') {
    return (
      <div className="chat-message assistant-message">
        <div className="message-header">
          <span className="message-sender">Assistant</span>
          {message.isStreaming && <span className="streaming-badge">● Streaming...</span>}
        </div>
        <div className="message-body">
          {message.events?.map((event, index) => (
            <div key={index} className="event-item">
              <EventDisplay event={event} />
            </div>
          ))}
          {message.streamedText && (
            <div className="streamed-text markdown-content">
              <ReactMarkdown>{message.streamedText}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};
