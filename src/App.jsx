import { Routes, Route, Navigate } from "react-router-dom";
import { Box } from "@mui/material";
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login";
import Derslerim from "./pages/Derslerim";
import CourseDetail from "./pages/CourseDetail";
import Assistant from "./pages/Assistant";
import { useAuth } from "./contexts/AuthContext";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/derslerim" replace /> : <Login />
        }
      />
      <Route
        path="/assistant"
        element={
          <PrivateRoute>
            <Assistant />
          </PrivateRoute>
        }
      />
      <Route
        path="/*"
        element={
          <PrivateRoute>
            <Box sx={{ display: "flex", minHeight: "100vh" }}>
              <Layout>
                <Routes>
                  <Route index element={<Navigate to="/derslerim" replace />} />
                  <Route path="derslerim" element={<Derslerim />} />
                  <Route path="course/:id" element={<CourseDetail />} />
                </Routes>
              </Layout>
            </Box>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
