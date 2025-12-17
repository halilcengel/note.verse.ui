import { useMemo } from 'react'
import { Box, Paper, Typography, Avatar, Chip } from '@mui/material'
import { Person as PersonIcon, SmartToy as BotIcon } from '@mui/icons-material'
import ReactMarkdown from 'react-markdown'
import { EventDisplay } from './EventDisplay'
import { ToolCallTracker } from '../../utils/eventUtils'

export const ChatMessage = ({ message }) => {
  const toolCallInfo = useMemo(() => {
    if (message.type !== 'assistant' || !message.events) {
      return { tracker: null, eventMetadata: new Map() }
    }

    const tracker = new ToolCallTracker()
    const eventMetadata = new Map()

    // First pass: register all tool calls
    message.events.forEach((event, index) => {
      if (event.type === 'tool_start') {
        tracker.addToolCall(event)
        eventMetadata.set(index, { isPending: true, duration: null })
      }
    })

    // Second pass: match responses and calculate durations
    message.events.forEach((event, index) => {
      if (event.type === 'tool_response') {
        const matchResult = tracker.addToolResponse(event)
        eventMetadata.set(index, {
          isPending: false,
          duration: matchResult.duration,
        })
      }
    })

    // Third pass: update pending status for tool calls that got responses
    message.events.forEach((event, index) => {
      if (event.type === 'tool_start' && event.data?.id) {
        const matched = tracker.getMatchedResponse(event.data.id)
        if (matched) {
          eventMetadata.set(index, {
            isPending: false,
            duration: matched.duration,
          })
        }
      }
    })

    // If message is still streaming, mark unmatched tool calls as pending
    if (message.isStreaming) {
      message.events.forEach((event, index) => {
        if (event.type === 'tool_start') {
          const metadata = eventMetadata.get(index)
          if (metadata && metadata.isPending) {
            eventMetadata.set(index, { ...metadata, isPending: true })
          }
        }
      })
    }

    // Create a map of tool responses for easy lookup
    const responseMap = new Map()
    message.events.forEach((event) => {
      if (event.type === 'tool_response' && event.data?.id) {
        responseMap.set(event.data.id, event)
      }
    })

    return { tracker, eventMetadata, responseMap }
  }, [message.events, message.type, message.isStreaming])

  if (message.type === 'user') {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row-reverse',
          gap: 1,
          mb: 2,
        }}
      >
        <Avatar
          sx={{
            bgcolor: 'primary.main',
            width: 40,
            height: 40,
          }}
        >
          <PersonIcon />
        </Avatar>
        <Paper
          elevation={1}
          sx={{
            p: 2,
            maxWidth: '75%',
            bgcolor: 'primary.light',
            color: 'primary.contrastText',
          }}
        >
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {message.content}
          </Typography>
        </Paper>
      </Box>
    )
  }

  if (message.type === 'assistant') {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 1,
          mb: 2,
        }}
      >
        <Avatar
          sx={{
            bgcolor: 'secondary.main',
            width: 40,
            height: 40,
          }}
        >
          <BotIcon />
        </Avatar>
        <Box sx={{ flexGrow: 1, maxWidth: '75%' }}>
          <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="subtitle2" fontWeight={600}>
              Assistant
            </Typography>
            {message.isStreaming && (
              <Chip
                label="● Streaming..."
                size="small"
                color="secondary"
                sx={{
                  height: 20,
                  animation: 'pulse 1.5s ease-in-out infinite',
                  '@keyframes pulse': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.7 },
                  },
                }}
              />
            )}
          </Box>
          <Paper elevation={1} sx={{ p: 2, bgcolor: 'background.paper' }}>
            {message.events && message.events.length > 0 && (
              <Box sx={{ mb: message.streamedText ? 2 : 0 }}>
                {message.events.map((event, index) => {
                  console.log(event)
                  if (event.type === 'tool_response') return null

                  const metadata = toolCallInfo.eventMetadata.get(index) || {
                    isPending: false,
                    duration: null,
                  }

                  const responseEvent =
                    event.type === 'tool_start'
                      ? toolCallInfo.responseMap.get(event.data?.id)
                      : null

                  return (
                    <EventDisplay
                      key={index}
                      event={responseEvent || event}
                      isPending={metadata.isPending}
                      duration={metadata.duration}
                    />
                  )
                })}
              </Box>
            )}
            {message.streamedText && (
              <Box
                sx={{
                  '& p': { margin: 0, marginBottom: 1 },
                  '& p:last-child': { marginBottom: 0 },
                  '& pre': {
                    bgcolor: 'grey.100',
                    p: 1,
                    borderRadius: 1,
                    overflow: 'auto',
                  },
                  '& code': {
                    bgcolor: 'grey.100',
                    px: 0.5,
                    py: 0.25,
                    borderRadius: 0.5,
                    fontSize: '0.9em',
                  },
                  '& ul, & ol': {
                    marginTop: 0.5,
                    marginBottom: 0.5,
                    paddingLeft: 2,
                  },
                }}
              >
                <ReactMarkdown>{message.streamedText}</ReactMarkdown>
              </Box>
            )}
          </Paper>
        </Box>
      </Box>
    )
  }

  return null
}
