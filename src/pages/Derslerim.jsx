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
        <Card sx={{ height: "100%", "&:hover": { boxShadow: 6 } }}>
          <CardActionArea
            onClick={() => navigate(`/course/${lastCourseOffering.id}`)}
            sx={{ height: "100%" }}
          >
            <CardContent>
              <Stack spacing={2}>
                <Box>
                  <Chip
                    label={getSemesterText(
                      lastCourseOffering.semester
                    )}
                    color={getSemesterColor(
                      lastCourseOffering.semester
                    )}
                    size="small"
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="h6" component="div" gutterBottom>
                    {courseOffering?.code}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    gutterBottom
                  >
                    {courseOffering.name}
                  </Typography>
                </Box>

                <Box>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mb: 1 }}
                  >
                    <PersonIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {lastCourseOffering.teacher?.title}{" "}
                      {lastCourseOffering.teacher?.user
                        ?.name || "Öğretim Görevlisi"}
                    </Typography>
                  </Stack>

                  {lastCourseOffering.schedules &&
                    lastCourseOffering.schedules.length >
                      0 && (
                      <>
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          sx={{ mb: 1 }}
                        >
                          <TimeIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {
                              lastCourseOffering.schedules[0]
                                .dayOfWeek
                            }{" "}
                            {
                              lastCourseOffering.schedules[0]
                                .startTime
                            }{" "}
                            -{" "}
                            {
                              lastCourseOffering.schedules[0]
                                .endTime
                            }
                          </Typography>
                        </Stack>

                        {lastCourseOffering.schedules[0]
                          .classroom && (
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <RoomIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              {
                                lastCourseOffering.schedules[0]
                                  .classroom
                              }
                            </Typography>
                          </Stack>
                        )}
                      </>
                    )}
                </Box>

                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Chip
                    label={`${courseOffering?.credits || 0} Kredi`}
                    size="small"
                    variant="outlined"
                  />
                  <Typography variant="caption" color="text.secondary">
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
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom sx={{ mb: 1 }}>
        Derslerim
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        {getSemesterText(currentSemester)} Dönemi {currentYear}
      </Typography>

      {courses.length === 0 ? (
        <Alert severity="info">Kayıtlı ders bulunamadı</Alert>
      ) : (
        <>
          {/* Current Semester Courses */}
          {currentSemesterCourses.length > 0 && (
            <Box sx={{ mb: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Box
                  sx={{
                    width: 4,
                    height: 24,
                    bgcolor: "primary.main",
                    mr: 1.5,
                    borderRadius: 1,
                  }}
                />
                <Typography variant="h5" fontWeight={600}>
                  Güncel Dönem Dersleri
                </Typography>
                <Chip
                  label={`${currentSemesterCourses.length} Ders`}
                  size="small"
                  color="primary"
                  sx={{ ml: 2 }}
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
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Box
                sx={{
                  width: 4,
                  height: 24,
                  bgcolor: "text.secondary",
                  mr: 1.5,
                  borderRadius: 1,
                }}
              />
              <Typography variant="h5" fontWeight={600} color="text.secondary">
                Tüm Dersler
              </Typography>
              <Chip
                label={`${courses.length} Ders`}
                size="small"
                variant="outlined"
                sx={{ ml: 2 }}
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

