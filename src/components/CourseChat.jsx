import { useState, useRef, useEffect } from "react";
import {
  Box,
  TextField,
  IconButton,
  Typography,
  CircularProgress,
  Paper,
  Chip,
  Stack,
  alpha,
} from "@mui/material";
import {
  Send as SendIcon,
  SmartToy as BotIcon,
  MenuBook as BookIcon,
  AutoAwesome as SparkleIcon,
} from "@mui/icons-material";
import { useChatSSE } from "../hooks/useChatSSE";
import { ChatMessage } from "./chat/ChatMessage";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "../contexts/AuthContext";

export default function CourseChat({
  courseId,
  courseName,
  courseData,
  documents = [],
}) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [currentAssistantMessage, setCurrentAssistantMessage] = useState(null);
  const [threadId, setThreadId] = useState(() => uuidv4());
  const messagesEndRef = useRef(null);
  const { user, token } = useAuth();

  const { sendMessage, isLoading, error } = useChatSSE();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Generate new thread ID on every page visit (component mount) or course change
  useEffect(() => {
    setThreadId(uuidv4());
    setMessages([]);
    setCurrentAssistantMessage(null);
  }, [courseId]);

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

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      type: "user",
      content: input,
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

    await sendMessage(
      "/api/chat/course",
      {
        message: input,
        thread_id: threadId,
        course_id: courseId,
      },
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

  const suggestedQuestions = [
    "Bu dersin içeriği nedir?",
    "Hangi konular işlenecek?",
    "Sınavlar hakkında bilgi ver",
    "Ödevler nelerdir?",
  ];

  return (
    <Box sx={{ height: "700px", display: "flex", flexDirection: "column" }}>
      {/* Knowledge Base Info */}
      {documents.length > 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 2,
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
            border: (theme) =>
              `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            borderRadius: 2,
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <BookIcon color="primary" fontSize="small" />
            <Typography variant="body2" fontWeight={600} color="primary">
              Bilgi Bankası
            </Typography>
            <Chip
              label={`${documents.length} Döküman`}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Stack>
        </Paper>
      )}

      {/* Messages Area */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          p: 2,
          bgcolor: "background.default",
          borderRadius: 2,
          mb: 2,
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            bgcolor: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.3),
            borderRadius: "3px",
            "&:hover": {
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.5),
            },
          },
        }}
      >
        {messages.length === 0 && !currentAssistantMessage ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100%"
          >
            <Box
              sx={{
                position: "relative",
                mb: 3,
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <BotIcon sx={{ fontSize: 40, color: "primary.main" }} />
              </Box>
              <SparkleIcon
                sx={{
                  position: "absolute",
                  top: -5,
                  right: -5,
                  fontSize: 24,
                  color: "secondary.main",
                }}
              />
            </Box>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Ders Asistanı
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
              sx={{ mb: 3 }}
            >
              {courseName} dersi hakkında sorular sorabilirsiniz
            </Typography>

            {/* Suggested Questions */}
            <Stack
              direction="row"
              spacing={1}
              flexWrap="wrap"
              useFlexGap
              justifyContent="center"
            >
              {suggestedQuestions.map((question, idx) => (
                <Chip
                  key={idx}
                  label={question}
                  onClick={() => {
                    setInput(question);
                  }}
                  clickable
                  size="small"
                  sx={{
                    "&:hover": {
                      bgcolor: "primary.main",
                      color: "white",
                    },
                  }}
                />
              ))}
            </Stack>
          </Box>
        ) : (
          <Stack spacing={2}>
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
                  p: 2,
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

            <div ref={messagesEndRef} />
          </Stack>
        )}
      </Box>

      {/* Input Area */}
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          gap: 1.5,
          p: 1,
          bgcolor: "background.default",
          border: (theme) =>
            `2px solid ${
              isLoading ? theme.palette.primary.main : theme.palette.divider
            }`,
          borderRadius: 2,
          transition: "border-color 0.2s ease-in-out",
          "&:focus-within": {
            borderColor: "primary.main",
          },
        }}
      >
        <TextField
          fullWidth
          variant="standard"
          placeholder="Ders hakkında bir soru sorun..."
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
          maxRows={4}
          InputProps={{
            disableUnderline: true,
            sx: {
              px: 1.5,
              py: 1,
              fontSize: "0.95rem",
            },
          }}
        />
        <IconButton
          color="primary"
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          sx={{
            bgcolor: "primary.main",
            color: "white",
            width: 48,
            height: 48,
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
            <CircularProgress size={20} color="inherit" />
          ) : (
            <SendIcon />
          )}
        </IconButton>
      </Paper>
    </Box>
  );
}
