import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import PreConsultationPage from './pages/PreConsultationPage';
import AppointmentsPage from './pages/AppointmentsPage';
import NewAppointmentPage from './pages/NewAppointmentPage';
import DoctorsPage from './pages/DoctorsPage';

// Créer le client React Query
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
            {/* Routes publiques */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Routes protégées avec layout Dashboard */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />

              {/* Phase 2 — Core Business */}
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

              {/* Phase 3 — Dashboards avancés (à implémenter) */}
              {/* <Route path="schedule" element={<SchedulePage />} /> */}
              {/* <Route path="specialties" element={<SpecialtiesPage />} /> */}
              {/* <Route path="users" element={<UsersPage />} /> */}
              {/* <Route path="audit-logs" element={<AuditLogsPage />} /> */}
            </Route>

            {/* Redirection par défaut */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
