import { Box, Paper, Typography, Avatar, Chip } from '@mui/material'
import { Person as PersonIcon, SmartToy as BotIcon } from '@mui/icons-material'
import ReactMarkdown from 'react-markdown'
import { EventDisplay } from './EventDisplay'

export const ChatMessage = ({ message }) => {
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
              <Chip label="● Streaming..." size="small" color="secondary" sx={{ height: 20 }} />
            )}
          </Box>
          <Paper elevation={1} sx={{ p: 2, bgcolor: 'background.paper' }}>
            {message.events && message.events.length > 0 && (
              <Box sx={{ mb: message.streamedText ? 2 : 0 }}>
                {message.events.map((event, index) => (
                  <EventDisplay key={index} event={event} />
                ))}
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
