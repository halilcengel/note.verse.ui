import { Icon } from "@iconify/react";
import "../../spin.css";
import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  Collapse,
  IconButton,
  Chip,
  Tooltip,
  Fade,
  Stack,
  Zoom,
} from '@mui/material'
import {
  ExpandMore as ExpandMoreIcon,
  ContentCopy as CopyIcon,
  CheckCircle as CheckIcon,
  Campaign as CampaignIcon,
  CalendarToday as CalendarTodayIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material'
import { formatRelativeTime, formatDuration, getToolIcon, getJSONSummary } from '../../utils/eventUtils'

const AgentDecision = ({ data, timestamp }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [relativeTime, setRelativeTime] = useState(formatRelativeTime(timestamp))

  useEffect(() => {
    const interval = setInterval(() => {
      setRelativeTime(formatRelativeTime(timestamp))
    }, 10000) // Update every 10 seconds

    return () => clearInterval(interval)
  }, [timestamp])

  return (
    <Zoom in timeout={300}>
      <Paper
        sx={{
          p: 1.5,
          mb: 1,
          background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
          border: '1px solid #90caf9',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 2,
          },
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          onClick={() => setIsExpanded(!isExpanded)}
          sx={{ cursor: 'pointer' }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="caption" fontWeight={600} sx={{ color: '#1976d2' }}>
              🤖 Agent Decision
            </Typography>
            {relativeTime && (
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                {relativeTime}
              </Typography>
            )}
          </Box>
          <IconButton
            size="small"
            sx={{
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
            }}
          >
            <ExpandMoreIcon fontSize="small" />
          </IconButton>
        </Box>
        <Collapse in={isExpanded}>
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2">
              <strong>Agent:</strong> {data.agent_name}
            </Typography>
          </Box>
        </Collapse>
      </Paper>
    </Zoom>
  )
}

const CopyButton = ({ text, label = 'Copy' }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = (e) => {
    e.stopPropagation()
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Tooltip title={copied ? 'Copied!' : label}>
      <IconButton size="small" onClick={handleCopy} sx={{ ml: 0.5 }}>
        {copied ? (
          <CheckIcon fontSize="small" sx={{ color: 'success.main' }} />
        ) : (
          <CopyIcon fontSize="small" />
        )}
      </IconButton>
    </Tooltip>
  )
}

const ToolCall = ({ data, timestamp, isPending, duration }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [relativeTime, setRelativeTime] = useState(formatRelativeTime(timestamp))
  const ToolIconComponent = getToolIcon(data?.name)

  useEffect(() => {
    const interval = setInterval(() => {
      setRelativeTime(formatRelativeTime(timestamp))
    }, 10000)

    return () => clearInterval(interval)
  }, [timestamp])

  return (
    <Zoom in timeout={300}>
      <Paper
        sx={{
          p: 1.5,
          mb: 1,
          background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
          border: '1px solid #ffb74d',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 2,
          },
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          onClick={() => setIsExpanded(!isExpanded)}
          sx={{ cursor: 'pointer' }}
        >
          <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
            <Box display="flex" alignItems="center" gap={0.5}>
              <ToolIconComponent sx={{ fontSize: 16, color: '#f57c00' }} />
              <Typography variant="caption" fontWeight={600} sx={{ color: '#f57c00' }}>
                Tool Call
              </Typography>
            </Box>
            <Chip
              label={data?.name || 'Unknown'}
              size="small"
              sx={{
                bgcolor: '#ff9800',
                color: 'white',
                fontWeight: 600,
                height: 20,
                fontSize: '0.65rem',
              }}
            />
            {isPending && (
              <Chip
                label="● Running"
                size="small"
                sx={{
                  bgcolor: '#ff9800',
                  color: 'white',
                  height: 20,
                  fontSize: '0.65rem',
                  animation: 'pulse 1.5s ease-in-out infinite',
                  '@keyframes pulse': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.6 },
                  },
                }}
              />
            )}
            {duration && (
              <Chip
                label={formatDuration(duration)}
                size="small"
                sx={{
                  bgcolor: '#4caf50',
                  color: 'white',
                  height: 20,
                  fontSize: '0.65rem',
                }}
              />
            )}
            {relativeTime && (
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                {relativeTime}
              </Typography>
            )}
          </Box>
          <IconButton
            size="small"
            sx={{
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
            }}
          >
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
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Typography variant="caption" fontWeight={600}>
                    Arguments:
                  </Typography>
                  <CopyButton text={JSON.stringify(data.args, null, 2)} label="Copy arguments" />
                </Box>
                <Box
                  component="pre"
                  sx={{
                    mt: 0.5,
                    p: 1,
                    bgcolor: 'rgba(0, 0, 0, 0.05)',
                    borderRadius: 1,
                    overflow: 'auto',
                    fontSize: '0.7rem',
                    maxHeight: '200px',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                  }}
                >
                  {JSON.stringify(data.args, null, 2)}
                </Box>
              </Box>
            )}
          </Box>
        </Collapse>
      </Paper>
    </Zoom>
  )
}

const ToolResponse = ({ data, timestamp, duration }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [relativeTime, setRelativeTime] = useState(formatRelativeTime(timestamp))
  const ToolIconComponent = getToolIcon(data?.name)

  useEffect(() => {
    const interval = setInterval(() => {
      setRelativeTime(formatRelativeTime(timestamp))
    }, 10000)

    return () => clearInterval(interval)
  }, [timestamp])

  const renderResult = (result) => {
    if (typeof result === 'string') {
      return (
        <Box>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.5}>
            <Typography variant="caption" color="text.secondary">
              {getJSONSummary(result)}
            </Typography>
            <CopyButton text={result} label="Copy result" />
          </Box>
          {isExpanded && (
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
              {result}
            </Typography>
          )}
        </Box>
      )
    }

    const summary = getJSONSummary(result)
    const jsonString = JSON.stringify(result, null, 2)

    return (
      <Box>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.5}>
          <Typography variant="caption" color="text.secondary">
            {summary}
          </Typography>
          <CopyButton text={jsonString} label="Copy result" />
        </Box>
        {isExpanded && (
          <Box
            component="pre"
            sx={{
              p: 1,
              bgcolor: 'rgba(0, 0, 0, 0.05)',
              borderRadius: 1,
              overflow: 'auto',
              fontSize: '0.7rem',
              maxHeight: '300px',
              border: '1px solid rgba(0, 0, 0, 0.1)',
            }}
          >
            {jsonString}
          </Box>
        )}
      </Box>
    )
  }

  return (
    <Zoom in timeout={300}>
      <Paper
        sx={{
          p: 1.5,
          mb: 1,
          background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
          border: '1px solid #81c784',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 2,
          },
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          onClick={() => setIsExpanded(!isExpanded)}
          sx={{ cursor: 'pointer' }}
        >
          <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
            <Box display="flex" alignItems="center" gap={0.5}>
              <CheckIcon sx={{ fontSize: 16, color: '#388e3c' }} />
              <Typography variant="caption" fontWeight={600} sx={{ color: '#388e3c' }}>
                Tool Response
              </Typography>
            </Box>
            <Chip
              label={data?.name || 'Unknown'}
              size="small"
              sx={{
                bgcolor: '#4caf50',
                color: 'white',
                fontWeight: 600,
                height: 20,
                fontSize: '0.65rem',
              }}
            />
            {duration && (
              <Chip
                label={formatDuration(duration)}
                size="small"
                sx={{
                  bgcolor: '#66bb6a',
                  color: 'white',
                  height: 20,
                  fontSize: '0.65rem',
                }}
              />
            )}
            {relativeTime && (
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                {relativeTime}
              </Typography>
            )}
          </Box>
          <IconButton
            size="small"
            sx={{
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
            }}
          >
            <ExpandMoreIcon fontSize="small" />
          </IconButton>
        </Box>
        <Collapse in={isExpanded}>
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" fontWeight={600} gutterBottom>
              Result:
            </Typography>
            <Box sx={{ mt: 0.5 }}>{renderResult(data?.result)}</Box>
          </Box>
        </Collapse>
      </Paper>
    </Zoom>
  )
}

const ScrapeAnnouncementsResponse = ({ data }) => {
  const announcements = data?.result?.announcements || []

  if (announcements.length === 0) {
    return (
      <Zoom in timeout={300}>
        <Paper
          sx={{
            p: 2,
            mb: 1,
            bgcolor: 'background.paper',
            border: '1px dashed',
            borderColor: 'text.disabled',
            borderRadius: 2,
          }}
        >
          <Box display="flex" alignItems="center" gap={1} color="text.secondary">
            <Icon icon="mdi:announcement" width={24} height={24} />
            <Typography variant="body2">Duyuru bulunamadı.</Typography>
          </Box>
        </Paper>
      </Zoom>
    )
  }

  return (
    <Zoom in timeout={300}>
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 1,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <Box
            sx={{
              p: 0.5,
              borderRadius: 1,
              bgcolor: theme => theme.palette.primary.light,
              color: theme => theme.palette.primary.main,
              display: 'flex',
            }}
          >
            <Icon icon="mdi:announcement"  width={24} height={24} />
          </Box>
          <Typography variant="subtitle2" fontWeight={700} color="text.primary">
            {announcements.length} duyuru bulundu
          </Typography>
        </Box>

        <Stack spacing={1}>
          {announcements.map((announcement, index) => (
            <Paper
              key={index}
              elevation={0}
              component="a"
              href={announcement.url}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                p: 1.5,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1.5,
                textDecoration: 'none',
                transition: 'all 0.2s ease-in-out',
                bgcolor: 'background.paper',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'action.hover',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                },
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color="text.primary"
                    lineHeight={1.3}
                    mb={0.5}
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {announcement.title}
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="flex"
                      alignItems="center"
                      gap={0.5}
                      sx={{
                        bgcolor: 'action.selected',
                        px: 0.75,
                        py: 0.25,
                        borderRadius: 0.5,
                      }}
                    >
                      <CalendarTodayIcon sx={{ fontSize: 12 }} /> {announcement.date}
                    </Typography>
                  </Stack>
                </Box>
                <OpenInNewIcon fontSize="large" color="action" sx={{ opacity: 0.8, fontSize: 20, mt: 0.5 }} />
              </Stack>
            </Paper>
          ))}
        </Stack>
      </Paper>
    </Zoom>
  )
}

const ScrapeAnnouncementsStart = ({ data, isPending }) => {
  return (
    <Zoom in timeout={300}>
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 1,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Box
            sx={{
              p: 0.5,
              borderRadius: 1,
              bgcolor: 'primary.light',
              color: 'primary.main',
              display: 'flex',
            }}
          >
            <Icon icon="mdi:announcement" className="spin" width={24} height={24} />
          </Box>
          <Typography variant="subtitle2" fontWeight={700} color="text.primary">
            Arama Yapılıyor...
          </Typography>
          {isPending && (
            <Chip
              label="Taranıyor"
              size="small"
              sx={{
                ml: 'auto',
                bgcolor: 'primary.main',
                color: 'white',
                height: 20,
                fontSize: '0.65rem',
                animation: 'pulse 1.5s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 1 },
                  '50%': { opacity: 0.6 },
                },
              }}
            />
          )}
        </Box>
      </Paper>
    </Zoom>
  )
}

const ScrapeAnnouncementStart = ({ data, isPending }) => {
  return (
    <Zoom in timeout={300}>
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 1,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Box
            sx={{
              p: 0.5,
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'primary.light',
              color: 'primary.main',
              display: 'flex',
            }}
          >
            <Icon icon="mdi:announcement" width={24} height={24} className="spin" />
          </Box>
          <Typography variant="subtitle2" fontWeight={700} color="text.primary">
            Duyuru detayları alınıyor...  
          </Typography>
          {isPending && (
            <Chip
              label="Yükleniyor"
              size="small"
              sx={{
                ml: 'auto',
                bgcolor: 'primary.main',
                color: 'white',
                height: 20,
                fontSize: '0.65rem',
                animation: 'pulse 1.5s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 1 },
                  '50%': { opacity: 0.6 },
                },
              }}
            />
          )}
        </Box>
      </Paper>
    </Zoom>
  )
}

const ScrapeAnnouncementResponse = ({ data }) => {
  const result = data?.result || {}

  return (
    <Zoom in timeout={300}>
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 1,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <Box
            sx={{
              p: 0.5,
              borderRadius: 1,
              bgcolor: 'primary.light',
              color: 'primary.main',
              display: 'flex',
            }}
          >
            <Icon icon="mdi:magnify" width={24} height={24} />
          </Box>
          <Typography variant="subtitle2" fontWeight={700} color="text.primary">
            Duyuru Detayları
          </Typography>
        </Box>

        <Stack spacing={2}>
          <Box>
            <Typography variant="subtitle1" fontWeight={700} color="text.primary" gutterBottom>
              {result.title}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
              <Chip
                icon={<CalendarTodayIcon sx={{ fontSize: 14 }} />}
                label={result.date}
                size="small"
                sx={{
                  bgcolor: 'action.selected',
                  color: 'text.secondary',
                  fontWeight: 500,
                  fontSize: '0.75rem',
                  height: 24,
                }}
              />
            </Stack>
            <Typography variant="body2" color="text.primary" sx={{ whiteSpace: 'pre-wrap' }}>
              {result.content}
            </Typography>
          </Box>

          {result.links && result.links.length > 0 && (
            <Box>
              <Typography variant="caption" fontWeight={600} color="text.secondary" display="block" mb={1}>
                İlgili Bağlantılar:
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {result.links.map((link, index) => (
                  <Chip
                    key={index}
                    label={link.text}
                    component="a"
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    clickable
                    icon={<OpenInNewIcon sx={{ fontSize: 14 }} />}
                    size="small"
                    sx={{
                      bgcolor: 'background.paper',
                      border: '1px solid',
                      borderColor: 'divider',
                      color: 'primary.main',
                      '&:hover': {
                        bgcolor: 'action.hover',
                        borderColor: 'primary.main',
                      },
                    }}
                  />
                ))}
              </Stack>
            </Box>
          )}
        </Stack>
      </Paper>
    </Zoom>
  )
}

const GetDocumentFromUrlStart = ({ data, isPending }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Zoom in timeout={300}>
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 1,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <Box 
          display="flex" 
          alignItems="center" 
          justifyContent="space-between"
          onClick={() => setIsExpanded(!isExpanded)}
          sx={{ cursor: 'pointer' }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <Box
              sx={{
                p: 0.5,
                borderRadius: 1,
                bgcolor: 'primary.light',
                color: 'primary.main',
                display: 'flex',
              }}
            >
              <Icon icon="mdi:file-document-outline" className="spin" width={24} height={24} />
            </Box>
            <Typography variant="subtitle2" fontWeight={700} color="text.primary">
              Belge içeriği alınıyor...
            </Typography>
            {isPending && (
              <Chip
                label="İndiriliyor"
                size="small"
                sx={{
                  ml: 1,
                  bgcolor: 'primary.main',
                  color: 'white',
                  height: 20,
                  fontSize: '0.65rem',
                  animation: 'pulse 1.5s ease-in-out infinite',
                  '@keyframes pulse': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.6 },
                  },
                }}
              />
            )}
          </Box>
          <IconButton
            size="small"
            sx={{
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
            }}
          >
            <ExpandMoreIcon fontSize="small" />
          </IconButton>
        </Box>
        <Collapse in={isExpanded}>
          <Box sx={{ mt: 2, px: 1 }}>
             <Typography variant="caption" fontWeight={600} color="text.secondary">
                Argümanlar:
             </Typography>
             <Box
                component="pre"
                sx={{
                  mt: 0.5,
                  p: 1,
                  bgcolor: 'rgba(0, 0, 0, 0.05)',
                  borderRadius: 1,
                  overflow: 'auto',
                  fontSize: '0.7rem',
                  maxHeight: '200px',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                }}
              >
                {JSON.stringify(data?.args, null, 2)}
              </Box>
          </Box>
        </Collapse>
      </Paper>
    </Zoom>
  )
}

const GetDocumentFromUrlResponse = ({ data }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const result = data?.result || ''
  
  const parseDocuments = (str) => {
    const docs = []
    const regex = /page_content='((?:[^'\\]|\\.)*)'/g
    let match
    
    while ((match = regex.exec(str)) !== null) {
      docs.push(match[1].replace(/\\n/g, '\n').replace(/\\'/g, "'"))
    }
    
    return docs
  }

  const documents = typeof result === 'string' ? parseDocuments(result) : []
  const hasContent = documents.length > 0

  return (
    <Zoom in timeout={300}>
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 1,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <Box 
          display="flex" 
          alignItems="center" 
          justifyContent="space-between"
          onClick={() => setIsExpanded(!isExpanded)}
          sx={{ cursor: 'pointer' }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <Box
              sx={{
                p: 0.5,
                borderRadius: 1,
                bgcolor: 'primary.light',
                color: 'primary.main',
                display: 'flex',
              }}
            >
              <Icon icon="mdi:file-document-check" width={24} height={24} />
            </Box>
            <Typography variant="subtitle2" fontWeight={700} color="text.primary">
              Belge İçeriği ({documents.length} Sayfa)
            </Typography>
          </Box>
          <IconButton
            size="small"
            sx={{
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
            }}
          >
            <ExpandMoreIcon fontSize="small" />
          </IconButton>
        </Box>

        <Collapse in={isExpanded}>
          <Stack spacing={2} sx={{ mt: 2 }}>
            {hasContent ? (
              documents.map((content, index) => (
                <Paper
                  key={index}
                  elevation={0}
                  sx={{
                    p: 2,
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="caption" color="text.secondary" display="block" mb={1} fontWeight={600}>
                    Sayfa {index + 1}
                  </Typography>
                  <Typography variant="body2" color="text.primary" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                    {content}
                  </Typography>
                </Paper>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                İçerik görüntülenemedi veya boş.
              </Typography>
            )}
          </Stack>
        </Collapse>
      </Paper>
    </Zoom>
  )
}

export const EventDisplay = ({ event, isPending, duration }) => {
  switch (event.type) {
    case 'agent_decision':
      return <AgentDecision data={event} timestamp={event.timestamp} />
    case 'tool_start':
      if (event.data.name === 'scrape_announcements') {
        return <ScrapeAnnouncementsStart data={event.data} isPending={isPending} />
      }
      if (event.data.name === 'scrape_announcement') {
        return <ScrapeAnnouncementStart data={event.data} isPending={isPending} />
      }
      if (event.data.name === 'get_document_from_url') {
        return <GetDocumentFromUrlStart data={event.data} isPending={isPending} />
      }
      return (
        <ToolCall
          data={event.data}
          timestamp={event.timestamp}
          isPending={isPending}
          duration={duration}
        />
      )
    case 'tool_response':
      switch (event.data.name) {
        case 'scrape_announcements':
          return <ScrapeAnnouncementsResponse data={event.data} />
        case 'scrape_announcement':
          return <ScrapeAnnouncementResponse data={event.data} />
        case 'get_document_from_url':
          return <GetDocumentFromUrlResponse data={event.data} />
        default:
          return <ToolResponse data={event.data} timestamp={event.timestamp} duration={duration} />
      }
    case 'message':
      return null // Message content is handled separately
    default:
      return (
        <Fade in timeout={300}>
          <Paper
            sx={{
              p: 1.5,
              bgcolor: 'grey.200',
              mb: 1,
              border: '1px solid',
              borderColor: 'grey.400',
            }}
          >
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
                maxHeight: '200px',
              }}
            >
              {JSON.stringify(event, null, 2)}
            </Box>
          </Paper>
        </Fade>
      )
  }
}
