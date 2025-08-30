// frontend/src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';

import { CssBaseline, Box, Typography } from '@mui/material';
import { AuthProvider } from '~/features/auth/components/AuthProvider';
import { ProtectedRoute } from '~/features/auth/components/ProtectedRoute';
import { LoginPage } from '~/features/auth/pages/LoginPage';
import { AdminLayout } from '~/shared/components/layout/AdminLayout';
import { RoomManagement } from '~/features/hostel/rooms/pages/RoomManagement';
import { StudentManagement } from '~/features/hostel/students/pages/StudentManagement';
import { MasterDataPage } from '~/features/core/pages/MasterDataPage';
import { AdminIndexRedirect } from '~/features/auth/components/AdminIndexRedirect';
import { NotFoundPage } from '~/shared/components/ui/NotFoundPage';
import { StudentManagementPage } from '~/features/education/students/pages/StudentManagementPage';
import { StudentAdmissionFormPage } from '~/features/education/students/pages/StudentAdmissionFormPage';
import { StudentReportPage } from '~/features/education/students/pages/StudentReportPage';
import { TeacherManagementPage } from '~/features/education/teachers/pages/TeacherManagementPage';
import { TeacherRegisterPage } from '~/features/education/teachers/pages/TeacherRegisterPage';
import { TeacherReportPage } from '~/features/education/teachers/pages/TeacherReportPage';
// import { StuffRegisterPage } from '~/features/education/stuffs/pages/StuffRegisterPage';
import { StaffRegisterPage } from '~/features/education/staff/pages/StaffRegisterPage';
import { StaffManagementPage } from '~/features/education/staff/pages/StaffManagementPage';
import { BoardingDashboardPage } from '~/features/boarding/pages/BoardingDashboardPage';
import { BoardingMasterDataPage } from '~/features/boarding/core/pages/BoardingMasterDataPage';
import { BoardingAssignmentPage } from '~/features/boarding/pages/BoardingAssignmentPage';
import { StaffReportPage } from '~/features/education/staff/pages/StaffReportPage';
import { PersonFormPage } from '~/features/education/person/pages/PersonFormPage';
import { PersonManagementPage } from '~/features/education/person/pages/PersonManagementPage';
import { PersonReportPage } from '~/features/education/person/pages/PersonReportPage';


/**
 * Main application component
 * Defines the routing structure with authentication
 */
function App() {
  return (
    <AuthProvider>
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <CssBaseline />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            {/* Redirect to the user's default module dashboard */}
            <Route index element={<AdminIndexRedirect />} />

            {/* Hostel Module Routes */}
            <Route
              path="hostel/rooms"
              element={
                <ProtectedRoute requiredModule="hostel">
                  <RoomManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="hostel/students"
              element={
                <ProtectedRoute requiredModule="hostel">
                  <StudentManagement />
                </ProtectedRoute>
              }
            />

            {/* Education Module Routes */}
            <Route
              path="education/master-data"
              element={
                <ProtectedRoute requiredModule="education">
                  <MasterDataPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="education/persons/form"
              element={
                <ProtectedRoute requiredModule="education">
                  <PersonFormPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="education/persons/manage"
              element={
                <ProtectedRoute requiredModule="education">
                  <PersonManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="education/persons/report"
              element={
                <ProtectedRoute requiredModule="education">
                  <PersonReportPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="education/teachers/manage"
              element={
                <ProtectedRoute requiredModule="education">
                  <TeacherManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="education/teachers/form"
              element={
                <ProtectedRoute requiredModule="education">
                  <TeacherRegisterPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="education/teachers/report"
              element={
                <ProtectedRoute requiredModule="education">
                  <TeacherReportPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="education/students/form"
              element={
                <ProtectedRoute requiredModule="education">
                  <StudentAdmissionFormPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="education/students/manage"
              element={
                <ProtectedRoute requiredModule="education">
                  <StudentManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="education/students/report"
              element={
                <ProtectedRoute requiredModule="education">
                  <StudentReportPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="education/staffs/manage"
              element={
                <ProtectedRoute requiredModule="education">
                  <StaffManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="education/staffs/form"
              element={
                <ProtectedRoute requiredModule="education">
                  {/* <StuffRegisterPage /> */}
                  <StaffRegisterPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="education/staffs/report"
              element={
                <ProtectedRoute requiredModule="education">
                  <StaffReportPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="education/dashboard"
              element={
                <ProtectedRoute requiredModule="education">
                  <Box sx={{ p: 4, textAlign: "center" }}>
                    <h2>Education Dashboard</h2>
                    <p>Coming Soon...</p>
                  </Box>
                </ProtectedRoute>
              }
            />

            {/* Accounts Module Routes (Placeholder) */}
            <Route
              path="accounts/dashboard"
              element={
                <ProtectedRoute requiredModule="accounts">
                  <Box sx={{ p: 4, textAlign: "center" }}>
                    <h2>Accounts Dashboard</h2>
                    <p>Coming Soon...</p>
                  </Box>
                </ProtectedRoute>
              }
            />

            {/* Boarding Module Routes */}
            <Route
              path="boarding/dashboard"
              element={
                <ProtectedRoute requiredModule="boarding">
                  <BoardingDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="boarding/master-data"
              element={
                <ProtectedRoute requiredModule="boarding">
                  <BoardingMasterDataPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="boarding/assign"
              element={
                <ProtectedRoute requiredModule="boarding">
                  <BoardingAssignmentPage />
                </ProtectedRoute>
              }
            />

            {/* Placeholder routes for user menu */}
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <Box sx={{ p: 4, textAlign: "center" }}>
                    <Typography variant="h4" gutterBottom>
                      User Profile
                    </Typography>
                    <Typography>This feature is coming soon.</Typography>
                  </Box>
                </ProtectedRoute>
              }
            />

            {/* Catch-all for unknown admin routes */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Fallback Routes */}
          <Route path="/" element={<Navigate to="/admin" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Box>
    </AuthProvider>
  );
}

export default App;