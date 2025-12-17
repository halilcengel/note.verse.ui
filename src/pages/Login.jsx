import { useState } from 'react'
import {
  Container,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  CircularProgress,
  IconButton,
  useTheme,
  alpha,
  Stack,
} from '@mui/material'
import {
  Visibility,
  VisibilityOff,
  School as SchoolIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'

const MotionCard = motion(Card)
const MotionBox = motion(Box)

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()
  const theme = useTheme()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      login(data.data.token, data.data.user)
      navigate('/derslerim')
    } catch (err) {
      setError(err.message || 'An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
        bgcolor: 'background.default',
      }}
    >
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          overflow: 'hidden',
        }}
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            position: 'absolute',
            top: '-10%',
            left: '-10%',
            width: '60vw',
            height: '60vw',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, rgba(99,102,241,0) 70%)',
            filter: 'blur(60px)',
          }}
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [0, -60, 0],
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            position: 'absolute',
            bottom: '-10%',
            right: '-10%',
            width: '50vw',
            height: '50vw',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(236,72,153,0.3) 0%, rgba(236,72,153,0) 70%)',
            filter: 'blur(60px)',
          }}
        />
      </Box>

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center' }}>
        <MotionCard
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          sx={{
            width: '100%',
            backdropFilter: 'blur(20px)',
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.85)',
            boxShadow: theme.palette.mode === 'dark' ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid',
            borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)',
            overflow: 'visible',
          }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 6 } }}>
            <Box sx={{ textAlign: 'center', mb: 5 }}>
              <MotionBox
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '24px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  boxShadow: '0 20px 25px -5px rgba(99, 102, 241, 0.4)',
                }}
              >
                <SchoolIcon sx={{ fontSize: 40, color: 'white' }} />
              </MotionBox>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Typography
                  variant="h3"
                  fontWeight={800}
                  sx={{
                    background: theme.palette.mode === 'dark' 
                      ? 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)' 
                      : 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1,
                    letterSpacing: '-0.02em',
                  }}
                >
                  NoteVerse
                </Typography>
                <Typography variant="body1" color="text.secondary" fontWeight={500}>
                  Üniversite Yönetim Sistemi
                </Typography>
              </motion.div>
            </Box>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0, mb: 0 }}
                  animate={{ opacity: 1, height: 'auto', mb: 24 }}
                  exit={{ opacity: 0, height: 0, mb: 0 }}
                >
                  <Alert
                    severity="error"
                    sx={{
                      borderRadius: 3,
                      border: '1px solid',
                      borderColor: 'error.light',
                      bgcolor: alpha(theme.palette.error.main, 0.1),
                    }}
                  >
                    {error}
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Box>
                    <Typography variant="body2" fontWeight={600} sx={{ mb: 1, color: 'text.primary' }}>
                      E-posta
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="ornek@ogrenci.edu.tr"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.5)',
                          backdropFilter: 'blur(10px)',
                          transition: 'all 0.2s',
                          '&:hover': {
                            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.8)',
                          },
                          '&.Mui-focused': {
                            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#fff',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 10px 20px -5px rgba(99, 102, 241, 0.2)',
                          }
                        },
                      }}
                    />
                  </Box>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Box>
                    <Typography variant="body2" fontWeight={600} sx={{ mb: 1, color: 'text.primary' }}>
                      Şifre
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="••••••••"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.5)',
                          backdropFilter: 'blur(10px)',
                          transition: 'all 0.2s',
                          '&:hover': {
                            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.8)',
                          },
                          '&.Mui-focused': {
                            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#fff',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 10px 20px -5px rgba(99, 102, 241, 0.2)',
                          }
                        },
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              sx={{ color: 'text.secondary' }}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{
                      py: 2,
                      mt: 2,
                      background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                      fontSize: '1rem',
                      fontWeight: 700,
                      borderRadius: '16px',
                      boxShadow: '0 10px 20px -5px rgba(99, 102, 241, 0.4)',
                      transition: 'all 0.3s',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #4f46e5 0%, #db2777 100%)',
                        boxShadow: '0 20px 30px -10px rgba(99, 102, 241, 0.5)',
                        transform: 'translateY(-3px)',
                      },
                    }}
                  >
                    {loading ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <CircularProgress size={20} sx={{ color: 'white' }} />
                        Giriş yapılıyor...
                      </Box>
                    ) : (
                      'Giriş Yap'
                    )}
                  </Button>
                </motion.div>
              </Stack>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <Box
                sx={{
                  mt: 4,
                  pt: 3,
                  borderTop: '1px solid',
                  borderColor: 'divider',
                  textAlign: 'center',
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Hesabınız yok mu?{' '}
                  <Typography
                    component="span"
                    sx={{
                      cursor: 'pointer',
                      fontWeight: 700,
                      color: 'primary.main',
                      background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      transition: 'opacity 0.2s',
                      '&:hover': {
                        opacity: 0.8,
                      },
                    }}
                    onClick={() => navigate('/register')}
                  >
                    Kayıt Ol
                  </Typography>
                </Typography>
              </Box>
            </motion.div>
          </CardContent>
        </MotionCard>
      </Container>
    </Box>
  )
}
