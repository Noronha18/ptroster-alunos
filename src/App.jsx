import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { BottomNav } from './components/BottomNav';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Treinos from './pages/Treinos';
import Checkin from './pages/Checkin';
import Historico from './pages/Historico';

function ProtectedLayout({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-ios-background">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="pb-20">
      {children}
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
      <Route path="/treinos" element={<ProtectedLayout><Treinos /></ProtectedLayout>} />
      <Route path="/checkin" element={<ProtectedLayout><Checkin /></ProtectedLayout>} />
      <Route path="/historico" element={<ProtectedLayout><Historico /></ProtectedLayout>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
