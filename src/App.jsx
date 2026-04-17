import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';

// Auth Components
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import DepartmentManagement from './pages/DepartmentManagement';
import SubmitKaizen from './pages/SubmitKaizen';
import MyKaizens from './pages/MyKaizens';
import KaizenView from './pages/KaizenView';
import Profile from './pages/Profile';
import QDMPortal from './pages/QDMPortal';
import PendingApproval from './pages/PendingApproval';
import Analytics from './pages/Analytics';
import AdminOverview from './pages/AdminOverview';
import SuperAdminConsole from './pages/SuperAdminConsole';
import Maintenance from './pages/Maintenance';
import About from './pages/About';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';
import { Toaster } from "@/components/ui/toaster"





const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    const handleApiOffline = (e) => {
      toast({
        title: "Connection Error",
        description: e.detail?.message || "Cannot connect to the server. Some features may be unavailable.",
        variant: "destructive",
      });
    };
    
    window.addEventListener('api-offline', handleApiOffline);
    return () => window.removeEventListener('api-offline', handleApiOffline);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/pending-approval" element={<PendingApproval />} />

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

          <Route path="/profile" element={
            <ProtectedRoute>
              <MainLayout>
                <Profile />
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

          <Route path="/analytics" element={
            <ProtectedRoute allowedRoles={['qdm', 'hod', 'admin', 'superadmin']}>
              <MainLayout>
                <Analytics />
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

          <Route path="/maintenance" element={<Maintenance />} />

          <Route path="/system-overview" element={
            <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
              <MainLayout>
                <AdminOverview />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/superadmin-console" element={
            <ProtectedRoute allowedRoles={['superadmin']}>
              <MainLayout>
                <SuperAdminConsole />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/about" element={
            <ProtectedRoute>
              <MainLayout>
                <About />
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
