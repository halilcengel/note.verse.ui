import React, { useState } from 'react';
import './EventDisplay.css';

export const AgentDecision = ({ data }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="event-card agent-decision">
      <div className="event-header" onClick={() => setIsCollapsed(!isCollapsed)} style={{ cursor: 'pointer' }}>
        <span className="event-type">
          <span className={`chevron ${isCollapsed ? 'collapsed' : ''}`}>▼</span>
          Agent Decision
        </span>
      </div>
      {!isCollapsed && (
        <div className="event-content">
          <strong>Agent:</strong> {data.agent_name}
        </div>
      )}
    </div>
  );
};

export const ToolCall = ({ data }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="event-card tool-call">
      <div className="event-header" onClick={() => setIsCollapsed(!isCollapsed)} style={{ cursor: 'pointer' }}>
        <span className="event-type">
          <span className={`chevron ${isCollapsed ? 'collapsed' : ''}`}>▼</span>
          Tool Call
        </span>
        <span className="tool-name">{data.name}</span>
      </div>
      {!isCollapsed && (
        <div className="event-content">
          <div className="tool-id">ID: {data.id}</div>
          {Object.keys(data.args || {}).length > 0 && (
            <div className="tool-args">
              <strong>Arguments:</strong>
              <pre>{JSON.stringify(data.args, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const ToolResponse = ({ data }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const renderResult = (result) => {
    if (typeof result === 'string') {
      return <div className="result-text">{result}</div>;
    }
    return <pre className="result-json">{JSON.stringify(result, null, 2)}</pre>;
  };

  return (
    <div className="event-card tool-response">
      <div className="event-header" onClick={() => setIsCollapsed(!isCollapsed)} style={{ cursor: 'pointer' }}>
        <span className="event-type">
          <span className={`chevron ${isCollapsed ? 'collapsed' : ''}`}>▼</span>
          Tool Response
        </span>
        <span className="tool-name">{data.name}</span>
      </div>
      {!isCollapsed && (
        <div className="event-content">
          <strong>Result:</strong>
          {renderResult(data.result)}
        </div>
      )}
    </div>
  );
};

export const MessageContent = ({ content }) => {
  return (
    <span className="message-content">{content}</span>
  );
};

export const EventDisplay = ({ event }) => {
  switch (event.type) {
    case 'agent_decision':
      return <AgentDecision data={event} />;
    case 'tool_start':
      return <ToolCall data={event.data} />;
    case 'tool_response':
      return <ToolResponse data={event.data} />;
    case 'message':
      return <MessageContent content={event.content} />;
    default:
      return (
        <div className="event-card unknown">
          <div className="event-header">
            <span className="event-type">Unknown Event</span>
          </div>
          <div className="event-content">
            <pre>{JSON.stringify(event, null, 2)}</pre>
          </div>
        </div>
      );
  }
};
