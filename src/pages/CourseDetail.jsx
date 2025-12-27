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
  Avatar,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import {
  Chat as ChatIcon,
  Download as DownloadIcon,
  Description as FileIcon,
  Info as InfoIcon,
  Upload as UploadIcon,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Person as PersonIcon } from "@mui/icons-material";
import CourseChat from "../components/CourseChat";
import { coursesApi } from "../api/courses";
import { documentsApi } from "../api/documents";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function CourseDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCourseDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const courseData = await coursesApi.getCourseOfferingById(id);
      setCourse(courseData);

      // Fetch documents for this course
      if (courseData.course?.id) {
        try {
          const response = await documentsApi.getCourseDocuments(
            courseData.course.id
          );
          setDocuments(response.data || []);
        } catch (err) {
          console.error("Error fetching documents:", err);
          setDocuments([]);
        }
      }
    } catch (err) {
      setError("Ders bilgileri yüklenirken bir hata oluştu");
      console.error("Error fetching course details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !course?.course?.id || !user?.id) return;

    try {
      setUploading(true);
      // Use the file name as the title (without extension)
      const title = selectedFile.name.replace(/\.[^/.]+$/, "");
      await documentsApi.uploadDocument(
        selectedFile,
        title,
        user.id,
        course.course.id
      );
      setUploadDialogOpen(false);
      setSelectedFile(null);

      // Refresh documents list
      const response = await documentsApi.getCourseDocuments(course.course.id);
      setDocuments(response.data || []);
    } catch (err) {
      console.error("Error uploading document:", err);
      alert("Dosya yüklenirken bir hata oluştu");
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (documentId, fileName) => {
    try {
      const blob = await documentsApi.downloadDocument(documentId);

      // Create a download link and trigger it
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading document:", err);
      alert("Dosya indirilirken bir hata oluştu");
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !course) {
    return (
      <Container>
        <Alert severity="error">{error || "Ders bulunamadı"}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        sx={{
          position: "relative",
          borderRadius: 4,
          overflow: "hidden",
          mb: 4,
          background: "linear-gradient(135deg, #00A4B4 0%, #008A99 100%)",
          p: 4,
          color: "white",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)",
          }}
        />
        <Grid container spacing={3} sx={{ position: "relative" }}>
          <Grid item xs={12} md={8}>
            <Box sx={{ mb: 2 }}>
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <Chip
                  label={`${course.semester} ${course.academicYear}`}
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.2)",
                    color: "white",
                    fontWeight: 600,
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                  }}
                />
                <Chip
                  label={`${course.course?.credits || 0} Kredi`}
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.2)",
                    color: "white",
                    fontWeight: 600,
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                  }}
                />
              </Stack>
              <Typography
                variant="h6"
                sx={{ opacity: 0.9, mb: 1, fontWeight: 600 }}
              >
                {course.course?.code}
              </Typography>
              <Typography
                variant="h4"
                fontWeight={800}
                sx={{ letterSpacing: "-0.02em", mb: 3 }}
              >
                {course.course?.name}
              </Typography>
            </Box>
            <Stack spacing={2}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 2,
                  borderRadius: 2,
                  bgcolor: "rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: "rgba(255, 255, 255, 0.2)",
                    border: "2px solid rgba(255, 255, 255, 0.3)",
                  }}
                >
                  <PersonIcon />
                </Avatar>
                <Box>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Öğretim Görevlisi
                  </Typography>
                  <Typography variant="body1" fontWeight={700}>
                    {course.teacher?.title} {course.teacher?.user?.name}
                  </Typography>
                  {course.teacher?.officeNumber && (
                    <Typography variant="caption" sx={{ opacity: 0.9 }}>
                      Ofis: {course.teacher.officeNumber}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Stack>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  gutterBottom
                  sx={{ color: "text.primary" }}
                >
                  Ders Programı
                </Typography>
                {course.schedules && course.schedules.length > 0 ? (
                  <Stack spacing={2}>
                    {course.schedules.map((schedule, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: (theme) => `${theme.palette.primary.main}08`,
                          border: "1px solid",
                          borderColor: (theme) =>
                            `${theme.palette.primary.main}20`,
                        }}
                      >
                        <Typography
                          variant="body2"
                          fontWeight={700}
                          color="primary"
                          gutterBottom
                        >
                          {schedule.dayOfWeek}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontWeight={600}
                        >
                          {schedule.startTime} - {schedule.endTime}
                        </Typography>
                        {schedule.classroom && (
                          <Chip
                            label={schedule.classroom}
                            size="small"
                            sx={{ mt: 1, fontWeight: 600 }}
                          />
                        )}
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Program bilgisi bulunmamaktadır
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Paper
        sx={{
          mb: 3,
          borderRadius: 4,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          sx={{
            borderBottom: "1px solid",
            borderColor: "divider",
            px: 2,
            "& .MuiTab-root": {
              minHeight: 64,
              fontWeight: 600,
              fontSize: "0.95rem",
              textTransform: "none",
              "&.Mui-selected": {
                color: "primary.main",
              },
            },
            "& .MuiTabs-indicator": {
              height: 3,
              borderRadius: "3px 3px 0 0",
            },
          }}
        >
          <Tab
            icon={<InfoIcon />}
            label="Genel Bilgiler"
            iconPosition="start"
          />
          <Tab icon={<FileIcon />} label="Dökümanlar" iconPosition="start" />
          <Tab icon={<ChatIcon />} label="Sohbet" iconPosition="start" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Container>
            <Typography
              variant="h5"
              fontWeight={700}
              gutterBottom
              sx={{ mb: 3 }}
            >
              Ders Hakkında
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    transition: "all 0.2s",
                    "&:hover": {
                      borderColor: "primary.main",
                      boxShadow: 2,
                    },
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    Departman
                  </Typography>
                  <Typography variant="h6" fontWeight={700} color="primary">
                    {course.course?.department?.name || "Belirtilmemiş"}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    transition: "all 0.2s",
                    "&:hover": {
                      borderColor: "info.main",
                      boxShadow: 2,
                    },
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    Kontenjan
                  </Typography>
                  <Typography variant="h6" fontWeight={700} color="info.main">
                    {course.quota || "Sınırsız"}
                  </Typography>
                </Paper>
              </Grid>
              {course.enrollments && (
                <Grid item xs={12} sm={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      border: "1px solid",
                      borderColor: "divider",
                      transition: "all 0.2s",
                      "&:hover": {
                        borderColor: "success.main",
                        boxShadow: 2,
                      },
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={600}
                    >
                      Kayıtlı Öğrenci
                    </Typography>
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      color="success.main"
                    >
                      {course.enrollments.length}
                    </Typography>
                  </Paper>
                </Grid>
              )}
            </Grid>
          </Container>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Container>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 3 }}
            >
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  Bilgi Bankası
                </Typography>
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
                  textAlign: "center",
                  bgcolor: "background.default",
                  border: (theme) => `2px dashed ${theme.palette.divider}`,
                  borderRadius: 3,
                }}
              >
                <FileIcon
                  sx={{
                    fontSize: 64,
                    color: "text.secondary",
                    opacity: 0.3,
                    mb: 2,
                  }}
                />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Henüz döküman yok
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
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
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                          boxShadow: 3,
                          transform: "translateY(-4px)",
                          borderColor: "primary.main",
                        },
                      }}
                    >
                      <Stack spacing={2}>
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            bgcolor: (theme) =>
                              `${theme.palette.primary.main}15`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <FileIcon color="primary" />
                        </Box>
                        <Box>
                          <Typography
                            variant="body1"
                            fontWeight={600}
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                            }}
                          >
                            {doc.fileName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(doc.createdAt).toLocaleDateString(
                              "tr-TR",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </Typography>
                        </Box>
                        <Button
                          fullWidth
                          variant="outlined"
                          startIcon={<DownloadIcon />}
                          size="small"
                          sx={{ borderRadius: 1.5 }}
                          onClick={() => handleDownload(doc.id, doc.fileName)}
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
            courseId={course.course?.id}
            courseName={course.course?.name || ""}
            courseData={course}
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
              style={{ display: "none" }}
              id="file-upload"
              type="file"
              onChange={handleFileSelect}
            />
            <label htmlFor="file-upload">
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  textAlign: "center",
                  border: (theme) =>
                    `2px dashed ${
                      selectedFile
                        ? theme.palette.primary.main
                        : theme.palette.divider
                    }`,
                  borderRadius: 2,
                  cursor: "pointer",
                  transition: "all 0.2s ease-in-out",
                  bgcolor: selectedFile
                    ? (theme) => `${theme.palette.primary.main}08`
                    : "background.default",
                  "&:hover": {
                    borderColor: "primary.main",
                    bgcolor: (theme) => `${theme.palette.primary.main}08`,
                  },
                }}
                component="div"
              >
                <UploadIcon
                  sx={{
                    fontSize: 48,
                    color: selectedFile ? "primary.main" : "text.secondary",
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
              setUploadDialogOpen(false);
              setSelectedFile(null);
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
            {uploading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Yükle"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
