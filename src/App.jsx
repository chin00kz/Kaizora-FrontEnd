import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Auth Components
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import DepartmentManagement from './pages/DepartmentManagement';
import SubmitKaizen from './pages/SubmitKaizen';
import MyKaizens from './pages/MyKaizens';
import KaizenView from './pages/KaizenView';
import QDMPortal from './pages/QDMPortal';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';
import { Toaster } from "@/components/ui/toaster"

const AdminSettings = () => (
  <div className="space-y-4">
    <h1 className="text-2xl font-bold text-slate-900">Admin Settings</h1>
    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-slate-500 italic">
      System configuration and administrative tools.
    </div>
  </div>
);

const SuperAdminPanel = () => (
  <div className="space-y-4">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center border border-accent/30">
        <span className="text-accent text-xl">⚡</span>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Super Admin Panel</h1>
        <p className="text-slate-500 text-sm">Full system control — handle with care.</p>
      </div>
    </div>
    <div className="bg-accent/5 border border-accent/20 rounded-2xl p-6">
      <p className="text-accent font-semibold">⚠️ User management, system settings, and advanced controls will be built here.</p>
    </div>
  </div>
);

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <MainLayout>
                <Navigate to="/dashboard" replace />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/dashboard" element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/submit-kaizen" element={
            <ProtectedRoute>
              <MainLayout>
                <SubmitKaizen />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/my-kaizens" element={
            <ProtectedRoute>
              <MainLayout>
                <MyKaizens />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/kaizen/:kaizenId" element={
            <ProtectedRoute>
              <MainLayout>
                <KaizenView />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/qdm-portal" element={
            <ProtectedRoute allowedRoles={['qdm', 'admin', 'superadmin']}>
              <MainLayout>
                <QDMPortal />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/management" element={
            <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
              <MainLayout>
                <UserManagement />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/department" element={
            <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
              <MainLayout>
                <DepartmentManagement />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
              <MainLayout>
                <AdminSettings />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/superadmin" element={
            <ProtectedRoute allowedRoles={['superadmin']}>
              <MainLayout>
                <SuperAdminPanel />
              </MainLayout>
            </ProtectedRoute>
          } />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
