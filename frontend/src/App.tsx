import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';

// Public
import LandingPage from './pages/LandingPage';

// Auth
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Dashboard
import DashboardPage from './pages/DashboardPage';

// Phase 2 -- Core Business
import PreConsultationPage from './pages/PreConsultationPage';
import AppointmentsPage from './pages/AppointmentsPage';
import NewAppointmentPage from './pages/NewAppointmentPage';
import DoctorsPage from './pages/DoctorsPage';

// Phase 3 -- Admin
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AuditLogsPage from './pages/admin/AuditLogsPage';
import UsersPage from './pages/admin/UsersPage';
import SpecialtiesPage from './pages/admin/SpecialtiesPage';

// Phase 3 -- Medecin
import SchedulePage from './pages/doctor/SchedulePage';

// Phase 5 -- Secretaire
import SecretaryDashboardPage from './pages/secretary/SecretaryDashboardPage';
import AppointmentValidationPage from './pages/secretary/AppointmentValidationPage';

// React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* ====== ROUTES PUBLIQUES ====== */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* ====== ROUTES PROTEGEES avec layout Dashboard ====== */}
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/app/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />

              {/* Phase 2 -- Core Business */}
              <Route
                path="preconsultation"
                element={
                  <ProtectedRoute allowedRoles={['patient']}>
                    <PreConsultationPage />
                  </ProtectedRoute>
                }
              />
              <Route path="appointments" element={<AppointmentsPage />} />
              <Route
                path="appointments/new"
                element={
                  <ProtectedRoute allowedRoles={['patient']}>
                    <NewAppointmentPage />
                  </ProtectedRoute>
                }
              />
              <Route path="doctors" element={<DoctorsPage />} />

              {/* Phase 3 -- Medecin */}
              <Route
                path="schedule"
                element={
                  <ProtectedRoute allowedRoles={['doctor']}>
                    <SchedulePage />
                  </ProtectedRoute>
                }
              />

              {/* Phase 3 -- Admin */}
              <Route
                path="admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin/users"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <UsersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin/audit-logs"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AuditLogsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="specialties"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <SpecialtiesPage />
                  </ProtectedRoute>
                }
              />

              {/* Phase 5 -- Secretaire */}
              <Route
                path="secretary/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['secretary', 'admin']}>
                    <SecretaryDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="secretary/appointments"
                element={
                  <ProtectedRoute allowedRoles={['secretary', 'admin']}>
                    <AppointmentValidationPage />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* ====== RETROCOMPATIBILITE : anciennes URLs /dashboard, /preconsultation, etc. ====== */}
            <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
            <Route path="/preconsultation" element={<Navigate to="/app/preconsultation" replace />} />
            <Route path="/appointments" element={<Navigate to="/app/appointments" replace />} />
            <Route path="/appointments/new" element={<Navigate to="/app/appointments/new" replace />} />
            <Route path="/doctors" element={<Navigate to="/app/doctors" replace />} />
            <Route path="/schedule" element={<Navigate to="/app/schedule" replace />} />
            <Route path="/admin" element={<Navigate to="/app/admin" replace />} />
            <Route path="/admin/users" element={<Navigate to="/app/admin/users" replace />} />
            <Route path="/admin/audit-logs" element={<Navigate to="/app/admin/audit-logs" replace />} />
            <Route path="/specialties" element={<Navigate to="/app/specialties" replace />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
