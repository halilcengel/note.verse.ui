import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material'
import {
  Chat as ChatIcon,
  Download as DownloadIcon,
  Description as FileIcon,
  Info as InfoIcon,
  Upload as UploadIcon,
} from '@mui/icons-material'
import { useEffect, useState } from 'react'

import CourseChat from '../components/CourseChat'
import { coursesApi } from '../api/courses'
import { documentsApi } from '../api/documents'
import { useParams } from 'react-router-dom'

function TabPanel(props) {
  const { children, value, index, ...other } = props
  return (
    <div hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

export default function CourseDetail() {
  const { id } = useParams()
  const [course, setCourse] = useState(null)
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tabValue, setTabValue] = useState(0)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (id) {
      fetchCourseDetails()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const fetchCourseDetails = async () => {
    try {
      setLoading(true)
      setError(null)
      const courseData = await coursesApi.getCourseOfferingById(id)
      setCourse(courseData)

      // Fetch documents if department ID is available
      if (courseData.course?.departmentId) {
        try {
          const docs = await documentsApi.getDepartmentDocuments(courseData.course.departmentId)
          setDocuments(docs)
        } catch (err) {
          console.error('Error fetching documents:', err)
        }
      }
    } catch (err) {
      setError('Ders bilgileri yüklenirken bir hata oluştu')
      console.error('Error fetching course details:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !id) return

    try {
      setUploading(true)
      await documentsApi.uploadDocument(selectedFile, id)
      setUploadDialogOpen(false)
      setSelectedFile(null)

      // Refresh documents list
      if (course?.course?.departmentId) {
        const docs = await documentsApi.getDepartmentDocuments(course.course.departmentId)
        setDocuments(docs)
      }
    } catch (err) {
      console.error('Error uploading document:', err)
      alert('Dosya yüklenirken bir hata oluştu')
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    )
  }

  if (error || !course) {
    return (
      <Container>
        <Alert severity="error">{error || 'Ders bulunamadı'}</Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Typography variant="h4" gutterBottom>
              {course.course?.code} - {course.course?.name}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Chip label={`${course.semester} ${course.academicYear}`} color="primary" />
              <Chip label={`${course.course?.credits || 0} Kredi`} variant="outlined" />
            </Stack>
            <Typography variant="body1" color="text.secondary">
              <strong>Öğretim Görevlisi:</strong> {course.teacher?.title} {course.teacher?.user?.name}
            </Typography>
            {course.teacher?.officeNumber && (
              <Typography variant="body1" color="text.secondary">
                <strong>Ofis:</strong> {course.teacher.officeNumber}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Ders Programı
                </Typography>
                {course.schedules && course.schedules.length > 0 ? (
                  course.schedules.map((schedule, idx) => (
                    <Box key={idx} sx={{ mb: 1 }}>
                      <Typography variant="body2">
                        <strong>{schedule.dayOfWeek}</strong>
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {schedule.startTime} - {schedule.endTime}
                      </Typography>
                      {schedule.classroom && (
                        <Typography variant="body2" color="text.secondary">
                          Sınıf: {schedule.classroom}
                        </Typography>
                      )}
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Program bilgisi bulunmamaktadır
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab icon={<InfoIcon />} label="Genel Bilgiler" />
          <Tab icon={<FileIcon />} label="Dökümanlar" />
          <Tab icon={<ChatIcon />} label="Sohbet" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Container>
            <Typography variant="h6" gutterBottom>
              Ders Hakkında
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Departman: {course.course?.department?.name || 'Belirtilmemiş'}
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Kontenjan: {course.quota || 'Sınırsız'}
            </Typography>
            {course.enrollments && (
              <Typography variant="body1" color="text.secondary">
                Kayıtlı Öğrenci: {course.enrollments.length}
              </Typography>
            )}
          </Container>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Container>
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
              <Box>
                <Typography variant="h6" fontWeight={600}>Bilgi Bankası</Typography>
                <Typography variant="body2" color="text.secondary">
                  Ders materyalleri ve dökümanları
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<UploadIcon />}
                onClick={() => setUploadDialogOpen(true)}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  py: 1.5,
                  fontWeight: 600,
                }}
              >
                Döküman Yükle
              </Button>
            </Box>

            {documents.length === 0 ? (
              <Paper
                elevation={0}
                sx={{
                  p: 6,
                  textAlign: 'center',
                  bgcolor: 'background.default',
                  border: (theme) => `2px dashed ${theme.palette.divider}`,
                  borderRadius: 3,
                }}
              >
                <FileIcon sx={{ fontSize: 64, color: 'text.secondary', opacity: 0.3, mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Henüz döküman yok
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Bu ders için henüz döküman eklenmemiş
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<UploadIcon />}
                  onClick={() => setUploadDialogOpen(true)}
                >
                  İlk Dökümanı Yükle
                </Button>
              </Paper>
            ) : (
              <Grid container spacing={2}>
                {documents.map((doc) => (
                  <Grid item xs={12} sm={6} md={4} key={doc.id}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2.5,
                        border: (theme) => `1px solid ${theme.palette.divider}`,
                        borderRadius: 2,
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          boxShadow: 3,
                          transform: 'translateY(-4px)',
                          borderColor: 'primary.main',
                        },
                      }}
                    >
                      <Stack spacing={2}>
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            bgcolor: (theme) => `${theme.palette.primary.main}15`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <FileIcon color="primary" />
                        </Box>
                        <Box>
                          <Typography
                            variant="body1"
                            fontWeight={600}
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                            }}
                          >
                            {doc.fileName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(doc.createdAt).toLocaleDateString('tr-TR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </Typography>
                        </Box>
                        <Button
                          fullWidth
                          variant="outlined"
                          startIcon={<DownloadIcon />}
                          size="small"
                          sx={{ borderRadius: 1.5 }}
                        >
                          İndir
                        </Button>
                      </Stack>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}
          </Container>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <CourseChat
            courseId={id}
            courseName={course.course?.name || ''}
            documents={documents}
          />
        </TabPanel>
      </Paper>

      <Dialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h5" fontWeight={700}>
            Döküman Yükle
          </Typography>
          <Typography variant="body2" color="text.secondary">
            PDF, Word veya metin dosyası yükleyebilirsiniz
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <input
              accept=".pdf,.doc,.docx,.txt"
              style={{ display: 'none' }}
              id="file-upload"
              type="file"
              onChange={handleFileSelect}
            />
            <label htmlFor="file-upload">
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  textAlign: 'center',
                  border: (theme) => `2px dashed ${selectedFile ? theme.palette.primary.main : theme.palette.divider}`,
                  borderRadius: 2,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  bgcolor: selectedFile ? (theme) => `${theme.palette.primary.main}08` : 'background.default',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: (theme) => `${theme.palette.primary.main}08`,
                  },
                }}
                component="div"
              >
                <UploadIcon
                  sx={{
                    fontSize: 48,
                    color: selectedFile ? 'primary.main' : 'text.secondary',
                    mb: 2,
                  }}
                />
                {selectedFile ? (
                  <>
                    <Typography variant="body1" fontWeight={600} gutterBottom>
                      {selectedFile.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </Typography>
                  </>
                ) : (
                  <>
                    <Typography variant="body1" fontWeight={600} gutterBottom>
                      Dosya seçmek için tıklayın
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      PDF, DOC, DOCX veya TXT
                    </Typography>
                  </>
                )}
              </Paper>
            </label>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => {
              setUploadDialogOpen(false)
              setSelectedFile(null)
            }}
            sx={{ borderRadius: 2, px: 3 }}
          >
            İptal
          </Button>
          <Button
            onClick={handleUpload}
            variant="contained"
            disabled={!selectedFile || uploading}
            sx={{ borderRadius: 2, px: 4, fontWeight: 600 }}
          >
            {uploading ? <CircularProgress size={24} color="inherit" /> : 'Yükle'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
