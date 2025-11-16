import { useState } from 'react'
import { Box, Typography, Paper, Collapse, IconButton } from '@mui/material'
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material'

const AgentDecision = ({ data }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Paper sx={{ p: 1.5, bgcolor: 'info.light', mb: 1 }}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        onClick={() => setIsExpanded(!isExpanded)}
        sx={{ cursor: 'pointer' }}
      >
        <Typography variant="caption" fontWeight={600}>
          🤖 Agent Decision
        </Typography>
        <IconButton size="small" sx={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          <ExpandMoreIcon fontSize="small" />
        </IconButton>
      </Box>
      <Collapse in={isExpanded}>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Agent:</strong> {data.agent_name}
        </Typography>
      </Collapse>
    </Paper>
  )
}

const ToolCall = ({ data }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Paper sx={{ p: 1.5, bgcolor: 'warning.light', mb: 1 }}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        onClick={() => setIsExpanded(!isExpanded)}
        sx={{ cursor: 'pointer' }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="caption" fontWeight={600}>
            🔧 Tool Call
          </Typography>
          <Typography variant="caption" sx={{ bgcolor: 'warning.dark', px: 1, py: 0.5, borderRadius: 1 }}>
            {data?.name}
          </Typography>
        </Box>
        <IconButton size="small" sx={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          <ExpandMoreIcon fontSize="small" />
        </IconButton>
      </Box>
      <Collapse in={isExpanded}>
        <Box sx={{ mt: 1 }}>
          <Typography variant="caption" color="text.secondary">
            ID: {data?.id}
          </Typography>
          {data?.args && Object.keys(data.args).length > 0 && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="caption" fontWeight={600}>
                Arguments:
              </Typography>
              <Box
                component="pre"
                sx={{
                  mt: 0.5,
                  p: 1,
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  overflow: 'auto',
                  fontSize: '0.7rem',
                }}
              >
                {JSON.stringify(data.args, null, 2)}
              </Box>
            </Box>
          )}
        </Box>
      </Collapse>
    </Paper>
  )
}

const ToolResponse = ({ data }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const renderResult = (result) => {
    if (typeof result === 'string') {
      return <Typography variant="body2">{result}</Typography>
    }
    return (
      <Box
        component="pre"
        sx={{
          p: 1,
          bgcolor: 'background.paper',
          borderRadius: 1,
          overflow: 'auto',
          fontSize: '0.7rem',
        }}
      >
        {JSON.stringify(result, null, 2)}
      </Box>
    )
  }

  return (
    <Paper sx={{ p: 1.5, bgcolor: 'success.light', mb: 1 }}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        onClick={() => setIsExpanded(!isExpanded)}
        sx={{ cursor: 'pointer' }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="caption" fontWeight={600}>
            ✓ Tool Response
          </Typography>
          <Typography variant="caption" sx={{ bgcolor: 'success.dark', px: 1, py: 0.5, borderRadius: 1 }}>
            {data?.name}
          </Typography>
        </Box>
        <IconButton size="small" sx={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          <ExpandMoreIcon fontSize="small" />
        </IconButton>
      </Box>
      <Collapse in={isExpanded}>
        <Box sx={{ mt: 1 }}>
          <Typography variant="caption" fontWeight={600}>
            Result:
          </Typography>
          <Box sx={{ mt: 0.5 }}>{renderResult(data?.result)}</Box>
        </Box>
      </Collapse>
    </Paper>
  )
}

export const EventDisplay = ({ event }) => {
  switch (event.type) {
    case 'agent_decision':
      return <AgentDecision data={event} />
    case 'tool_start':
      return <ToolCall data={event.data} />
    case 'tool_response':
      return <ToolResponse data={event.data} />
    case 'message':
      return null // Message content is handled separately
    default:
      return (
        <Paper sx={{ p: 1.5, bgcolor: 'grey.200', mb: 1 }}>
          <Typography variant="caption" fontWeight={600}>
            Unknown Event
          </Typography>
          <Box
            component="pre"
            sx={{
              mt: 1,
              p: 1,
              bgcolor: 'background.paper',
              borderRadius: 1,
              overflow: 'auto',
              fontSize: '0.7rem',
            }}
          >
            {JSON.stringify(event, null, 2)}
          </Box>
        </Paper>
      )
  }
}
