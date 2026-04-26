import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SearchProvider } from './context/SearchContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import BatchListPage from './pages/BatchListPage';
import BatchDetailPage from './pages/BatchDetailPage';
import BatchFormPage from './pages/BatchFormPage';
import InspectionListPage from './pages/InspectionListPage';
import InspectionFormPage from './pages/InspectionFormPage';
import DefectListPage from './pages/DefectListPage';
import DefectFormPage from './pages/DefectFormPage';
import ProfilePage from './pages/ProfilePage';
import ReportsPage from './pages/ReportsPage';
import CalendarPage from './pages/CalendarPage';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <SearchProvider>
        <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#12121e',
              color: '#f0f0f5',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '12px',
              fontSize: '14px'
            }
          }}
        />
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<DashboardPage />} />

            {/* Batches */}
            <Route path="/batches" element={<BatchListPage />} />
            <Route path="/batches/new" element={<BatchFormPage />} />
            <Route path="/batches/:id" element={<BatchDetailPage />} />
            <Route path="/batches/:id/edit" element={<BatchFormPage />} />

            {/* Inspections */}
            <Route path="/inspections" element={<InspectionListPage />} />
            <Route path="/inspections/new" element={<InspectionFormPage />} />
            <Route path="/inspections/:id/edit" element={<InspectionFormPage />} />

            {/* Defects */}
            <Route path="/defects" element={<DefectListPage />} />
            <Route path="/defects/new" element={<DefectFormPage />} />
            <Route path="/defects/:id/edit" element={<DefectFormPage />} />

            {/* Reports, Calendar & Profile */}
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </SearchProvider>
    </AuthProvider>
  );
}

export default App;
