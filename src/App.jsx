import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Auth Components
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';

// Temporary placeholder components
const Dashboard = () => (
  <div className="space-y-4">
    <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-[#1e293b] p-6 rounded-2xl border border-white/5 h-32 flex items-center justify-center">
          <p className="text-slate-500">Statistic Card {i}</p>
        </div>
      ))}
    </div>
  </div>
);

const Management = () => <div className="text-white"><h1>Management Portal</h1></div>;
const AdminSettings = () => <div className="text-white"><h1>Admin Settings</h1></div>;

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

          <Route path="/management" element={
            <ProtectedRoute allowedRoles={['management', 'admin']}>
              <MainLayout>
                <Management />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <MainLayout>
                <AdminSettings />
              </MainLayout>
            </ProtectedRoute>
          } />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
