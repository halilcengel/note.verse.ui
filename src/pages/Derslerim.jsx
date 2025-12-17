import {
  Alert,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import {
  Person as PersonIcon,
  Room as RoomIcon,
  AccessTime as TimeIcon,
} from "@mui/icons-material";
import { coursesApi, getCurrentSemester } from "../api/courses";
import { useEffect, useState } from "react";

import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Derslerim() {
  const [courses, setCourses] = useState([]);
  const [currentSemesterCourses, setCurrentSemesterCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.studentId) {
      fetchCourses();
    }
  }, [user]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get student ID from authenticated user
      if (!user?.studentId) {
        setError("Öğrenci bilgisi bulunamadı");
        setLoading(false);
        return;
      }

      // Fetch student's current semester courses and all enrolled courses
      const [currentResponse, allCoursesResponse] = await Promise.all([
        coursesApi.getStudentCurrentSemesterCourses(user.studentId),
        coursesApi.getStudentCourses(user.studentId),
      ]);

      console.log(currentResponse);
      console.log(allCoursesResponse);

      setCurrentSemesterCourses(currentResponse || []);
      setCourses(allCoursesResponse || []);
    } catch (err) {
      setError("Dersler yüklenirken bir hata oluştu");
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  };

  const getSemesterColor = (semester) => {
    switch (semester) {
      case "Fall":
        return "warning";
      case "Spring":
        return "success";
      case "Summer":
        return "info";
      default:
        return "default";
    }
  };

  const getSemesterText = (semester) => {
    switch (semester) {
      case "Fall":
        return "Güz";
      case "Spring":
        return "Bahar";
      case "Summer":
        return "Yaz";
      default:
        return semester;
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

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  const { semester: currentSemester, academicYear: currentYear } =
    getCurrentSemester();

  const renderCourseCard = (courseOffering) => {
    const lastCourseOffering = courseOffering.courseOfferings?.[0];
    return (
      <Grid item xs={12} sm={6} md={4} key={courseOffering.id}>
        <Card
          sx={{
            height: "100%",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            cursor: "pointer",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background: `linear-gradient(90deg, ${
                getSemesterColor(lastCourseOffering.semester) === "warning"
                  ? "#f59e0b"
                  : getSemesterColor(lastCourseOffering.semester) === "success"
                  ? "#10b981"
                  : "#3b82f6"
              }, ${
                getSemesterColor(lastCourseOffering.semester) === "warning"
                  ? "#d97706"
                  : getSemesterColor(lastCourseOffering.semester) === "success"
                  ? "#059669"
                  : "#2563eb"
              })`,
            },
            "&:hover": {
              transform: "translateY(-8px)",
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          <CardActionArea
            onClick={() => navigate(`/course/${lastCourseOffering.id}`)}
            sx={{ height: "100%", p: 0 }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={2.5}>
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <Chip
                      label={getSemesterText(lastCourseOffering.semester)}
                      color={getSemesterColor(lastCourseOffering.semester)}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.75rem",
                      }}
                    />
                    <Chip
                      label={`${courseOffering?.credits || 0} Kredi`}
                      size="small"
                      variant="outlined"
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>
                  <Typography
                    variant="h6"
                    component="div"
                    fontWeight={700}
                    sx={{
                      mb: 0.5,
                      color: "text.primary",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {courseOffering?.code}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    fontWeight={500}
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      lineHeight: 1.5,
                    }}
                  >
                    {courseOffering.name}
                  </Typography>
                </Box>

                <Stack spacing={1.5}>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                  >
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: "8px",
                        bgcolor: (theme) => `${theme.palette.primary.main}15`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <PersonIcon fontSize="small" color="primary" />
                    </Box>
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                      {lastCourseOffering.teacher?.title}{" "}
                      {lastCourseOffering.teacher?.user?.name || "Öğretim Görevlisi"}
                    </Typography>
                  </Stack>

                  {lastCourseOffering.schedules &&
                    lastCourseOffering.schedules.length > 0 && (
                      <>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: "8px",
                              bgcolor: (theme) => `${theme.palette.info.main}15`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <TimeIcon fontSize="small" color="info" />
                          </Box>
                          <Typography variant="body2" color="text.secondary" fontWeight={500}>
                            {lastCourseOffering.schedules[0].dayOfWeek}{" "}
                            {lastCourseOffering.schedules[0].startTime} -{" "}
                            {lastCourseOffering.schedules[0].endTime}
                          </Typography>
                        </Stack>

                        {lastCourseOffering.schedules[0].classroom && (
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Box
                              sx={{
                                width: 32,
                                height: 32,
                                borderRadius: "8px",
                                bgcolor: (theme) => `${theme.palette.success.main}15`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <RoomIcon fontSize="small" color="success" />
                            </Box>
                            <Typography variant="body2" color="text.secondary" fontWeight={500}>
                              {lastCourseOffering.schedules[0].classroom}
                            </Typography>
                          </Stack>
                        )}
                      </>
                    )}
                </Stack>

                <Box
                  sx={{
                    pt: 2,
                    borderTop: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    {lastCourseOffering.academicYear}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 6 }}>
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            mb: 2,
            px: 2,
            py: 0.75,
            borderRadius: 3,
            bgcolor: (theme) => `${theme.palette.primary.main}15`,
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: "primary.main",
              animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
              "@keyframes pulse": {
                "0%, 100%": {
                  opacity: 1,
                },
                "50%": {
                  opacity: 0.5,
                },
              },
            }}
          />
          <Typography variant="body2" color="primary" fontWeight={600}>
            {getSemesterText(currentSemester)} Dönemi {currentYear}
          </Typography>
        </Box>
        <Typography
          variant="h3"
          fontWeight={800}
          sx={{
            letterSpacing: "-0.02em",
            background: "linear-gradient(135deg, #1e293b 0%, #475569 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Derslerim
        </Typography>
      </Box>

      {courses.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: "center",
            bgcolor: "background.default",
            border: (theme) => `2px dashed ${theme.palette.divider}`,
            borderRadius: 4,
          }}
        >
          <Alert severity="info" sx={{ maxWidth: 400, mx: "auto" }}>
            Kayıtlı ders bulunamadı
          </Alert>
        </Paper>
      ) : (
        <>
          {/* Current Semester Courses */}
          {currentSemesterCourses.length > 0 && (
            <Box sx={{ mb: 8 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
                <Box
                  sx={{
                    width: 6,
                    height: 32,
                    bgcolor: "primary.main",
                    mr: 2,
                    borderRadius: 2,
                    background: "linear-gradient(180deg, #6366f1 0%, #ec4899 100%)",
                  }}
                />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" fontWeight={700} sx={{ letterSpacing: "-0.01em" }}>
                    Güncel Dönem Dersleri
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    Aktif olarak kayıtlı olduğunuz dersler
                  </Typography>
                </Box>
                <Chip
                  label={`${currentSemesterCourses.length} Ders`}
                  size="medium"
                  sx={{
                    bgcolor: (theme) => `${theme.palette.primary.main}15`,
                    color: "primary.main",
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    px: 1,
                  }}
                />
              </Box>
              <Grid container spacing={3}>
                {currentSemesterCourses.map((courseOffering) =>
                  renderCourseCard(courseOffering)
                )}
              </Grid>
            </Box>
          )}

          {/* All Courses */}
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
              <Box
                sx={{
                  width: 6,
                  height: 32,
                  bgcolor: "text.secondary",
                  mr: 2,
                  borderRadius: 2,
                  opacity: 0.5,
                }}
              />
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h5" fontWeight={700} color="text.secondary" sx={{ letterSpacing: "-0.01em" }}>
                  Tüm Dersler
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  Geçmiş ve mevcut tüm ders kayıtlarınız
                </Typography>
              </Box>
              <Chip
                label={`${courses.length} Ders`}
                size="medium"
                variant="outlined"
                sx={{
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  px: 1,
                  borderWidth: 2,
                }}
              />
            </Box>
            <Grid container spacing={3}>
              {courses.map((courseOffering) =>
                renderCourseCard(courseOffering)
              )}
            </Grid>
          </Box>
        </>
      )}
    </Container>
  );
}

