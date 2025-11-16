import api from "./axios";

const getCurrentSemester = () => {
  const now = new Date();
  const month = now.getMonth() + 1; // 1-12
  const year = now.getFullYear();

  let semester;
  let academicYear;

  if (month >= 9 && month <= 12) {
    // September to December = Fall semester
    semester = "Fall";
    academicYear = `${year}-${year + 1}`;
  } else if (month >= 1 && month <= 5) {
    // January to May = Spring semester
    semester = "Spring";
    academicYear = `${year - 1}-${year}`;
  } else {
    // June to August = Summer semester
    semester = "Summer";
    academicYear = `${year}-${year + 1}`;
  }

  return { semester, academicYear };
};

export const coursesApi = {
  // Get course offering by ID
  getCourseOfferingById: async (id) => {
    const response = await api.get(`/course-offerings/${id}`);
    return response.data;
  },

  getCourseById: async (id) => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },

  // Get student by user ID
  getStudentByUserId: async (userId) => {
    const response = await api.get(`/students/user/${userId}`);
    return response.data;
  },

  // Get student's courses
  getStudentCourses: async (studentId) => {
    const response = await api.get(`/students/${studentId}/courses`);
    return response.data;
  },

  getStudentCurrentSemesterCourses: async (studentId) => {
    const { semester, academicYear } = getCurrentSemester();
    const response = await api.get(
      `students/${studentId}/courses/semester/${semester}/${academicYear}`,
      {}
    );
    return response.data;
  },

  // Get current semester info
  getCurrentSemesterInfo: () => {
    return getCurrentSemester();
  },
};

export { getCurrentSemester };

