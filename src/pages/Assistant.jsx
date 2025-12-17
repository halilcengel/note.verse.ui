import {
  Announcement as AnnouncementIcon,
  SmartToy as BotIcon,
  Send as SendIcon,
  AutoAwesome as SparkleIcon,
  ArrowBack as ArrowBackIcon,
  School as SchoolIcon,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
  alpha,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ChatMessage } from "../components/chat/ChatMessage";
import { useChatSSE } from "../hooks/useChatSSE";
import { v4 } from "uuid";
import { useAuth } from "../contexts/AuthContext";

export default function Assistant() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      id: "0",
      type: "assistant",
      streamedText:
        "Merhaba! Size nasıl yardımcı olabilirim? Duyurular, sınavlar veya okul hakkında sorularınızı yanıtlayabilirim.",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [currentAssistantMessage, setCurrentAssistantMessage] = useState(null);
  const messagesEndRef = useRef(null);

  const { sendMessage, isLoading, error } = useChatSSE();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentAssistantMessage]);

  // Move completed assistant message to messages array
  useEffect(() => {
    if (currentAssistantMessage && !currentAssistantMessage.isStreaming) {
      const messageExists = messages.some(
        (m) => m.id === currentAssistantMessage.id
      );
      if (!messageExists) {
        setMessages((prev) => [...prev, currentAssistantMessage]);
        setCurrentAssistantMessage(null);
      }
    }
  }, [currentAssistantMessage, messages]);

  const suggestedQuestions = [
    "Bu hafta hangi sınavlar var?",
    "Son duyurular neler?",
    "Akademik takvim nedir?",
    "Kütüphane saatleri nedir?",
  ];

  const handleSend = async (customMessage) => {
    const messageText = customMessage || input;
    if (!messageText.trim() || isLoading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      type: "user",
      content: messageText,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Initialize assistant message
    const assistantMsg = {
      id: `assistant-${Date.now()}`,
      type: "assistant",
      events: [],
      streamedText: "",
      isStreaming: true,
      timestamp: new Date().toISOString(),
    };
    setCurrentAssistantMessage(assistantMsg);

    const threadId = v4();
    const payload = {
      message: messageText,
      thread_id: threadId,
      url: "https://eem.bakircay.edu.tr",
      school: "Izmir Bakircay Universitesi",
      student_id: user.studentId,
      user_id: user.id,
      department_id: user.departmentId,
    };
    await sendMessage(
      "/api/chat",
      payload,
      (event) => {
        setCurrentAssistantMessage((prev) => {
          if (!prev) return prev;

          if (event.type === "message") {
            return {
              ...prev,
              streamedText: prev.streamedText + event.content,
            };
          } else {
            return {
              ...prev,
              events: [...(prev.events || []), event],
            };
          }
        });
      },
      () => {
        setCurrentAssistantMessage((prev) => {
          if (prev) {
            return { ...prev, isStreaming: false };
          }
          return prev;
        });
      }
    );
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: (theme) =>
            `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: "white",
          py: 3,
          px: 4,
          boxShadow: 3,
          zIndex: 10,
        }}
      >
        <Box maxWidth="lg" mx="auto">
          <Stack direction="row" alignItems="center" spacing={2}>
            <IconButton
              onClick={() => navigate("/derslerim")}
              sx={{
                color: "white",
                bgcolor: (theme) => alpha(theme.palette.common.white, 0.1),
                "&:hover": {
                  bgcolor: (theme) => alpha(theme.palette.common.white, 0.2),
                },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Avatar
              sx={{
                bgcolor: "white",
                color: "primary.main",
                width: 56,
                height: 56,
                boxShadow: 2,
              }}
            >
              <BotIcon fontSize="large" />
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant="h4"
                fontWeight={700}
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                AI Asistan
                <SparkleIcon sx={{ fontSize: 28, color: "secondary.main" }} />
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Duyurular, sınavlar ve okul hakkında sorularınızı yanıtlıyorum
              </Typography>
            </Box>
            <IconButton
              onClick={() => navigate("/derslerim")}
              sx={{
                color: "white",
                bgcolor: (theme) => alpha(theme.palette.common.white, 0.1),
                "&:hover": {
                  bgcolor: (theme) => alpha(theme.palette.common.white, 0.2),
                },
                display: { xs: "none", sm: "flex" },
              }}
            >
              <SchoolIcon />
            </IconButton>
          </Stack>
        </Box>
      </Box>

      {/* Messages Area */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          position: "relative",
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            bgcolor: "background.default",
          },
          "&::-webkit-scrollbar-thumb": {
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.3),
            borderRadius: "4px",
            "&:hover": {
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.5),
            },
          },
        }}
      >
        <Box maxWidth="lg" mx="auto" px={4} py={4}>
          {/* Welcome message with suggested questions */}
          {messages.length === 1 && (
            <Box sx={{ mb: 4 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
                  border: (theme) =>
                    `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  borderRadius: 3,
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight={600}
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <SparkleIcon color="primary" />
                  Örnek Sorular
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  Başlamak için aşağıdaki sorulardan birini seçebilir veya kendi
                  sorunuzu sorabilirsiniz
                </Typography>
                <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                  {suggestedQuestions.map((question, idx) => (
                    <Chip
                      key={idx}
                      label={question}
                      onClick={() => handleSend(question)}
                      clickable
                      icon={<AnnouncementIcon />}
                      sx={{
                        py: 2.5,
                        px: 1,
                        fontSize: "0.9rem",
                        fontWeight: 500,
                        bgcolor: "background.paper",
                        border: (theme) =>
                          `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                        "&:hover": {
                          bgcolor: "primary.main",
                          color: "white",
                          borderColor: "primary.main",
                          transform: "translateY(-2px)",
                          boxShadow: 2,
                        },
                        transition: "all 0.2s ease-in-out",
                      }}
                    />
                  ))}
                </Stack>
              </Paper>
            </Box>
          )}

          {/* Chat Messages */}
          <Stack spacing={3}>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {currentAssistantMessage &&
              !messages.some((m) => m.id === currentAssistantMessage.id) && (
                <ChatMessage
                  key="current-assistant"
                  message={currentAssistantMessage}
                />
              )}

            {error && (
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
                  border: (theme) =>
                    `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
                  borderRadius: 2,
                }}
              >
                <Typography variant="body2" color="error.main" fontWeight={500}>
                  ⚠️ Hata: {error}
                </Typography>
              </Paper>
            )}
          </Stack>

          <div ref={messagesEndRef} />
        </Box>
      </Box>

      {/* Input Area */}
      <Box
        sx={{
          bgcolor: "background.paper",
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          boxShadow: (theme) =>
            `0 -4px 12px ${alpha(theme.palette.common.black, 0.05)}`,
          zIndex: 10,
        }}
      >
        <Box maxWidth="lg" mx="auto" px={4} py={3}>
          <Paper
            elevation={0}
            sx={{
              display: "flex",
              gap: 2,
              p: 1,
              bgcolor: "background.default",
              border: (theme) =>
                `2px solid ${
                  isLoading ? theme.palette.primary.main : theme.palette.divider
                }`,
              borderRadius: 3,
              transition: "border-color 0.2s ease-in-out",
              "&:focus-within": {
                borderColor: "primary.main",
              },
            }}
          >
            <TextField
              fullWidth
              variant="standard"
              placeholder="Mesajınızı yazın..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              disabled={isLoading}
              multiline
              maxRows={6}
              InputProps={{
                disableUnderline: true,
                sx: {
                  px: 2,
                  py: 1.5,
                  fontSize: "1rem",
                },
              }}
            />
            <IconButton
              color="primary"
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              sx={{
                bgcolor: "primary.main",
                color: "white",
                width: 56,
                height: 56,
                flexShrink: 0,
                "&:hover": {
                  bgcolor: "primary.dark",
                  transform: "scale(1.05)",
                },
                "&:disabled": {
                  bgcolor: "action.disabledBackground",
                  color: "action.disabled",
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <SendIcon />
              )}
            </IconButton>
          </Paper>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", textAlign: "center", mt: 1 }}
          >
            AI asistan yanlış bilgi verebilir. Önemli bilgiler için doğrulama
            yapın.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
