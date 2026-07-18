import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { BottomNav } from './components/BottomNav';
import Login from './pages/Login';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Treinos   = lazy(() => import('./pages/Treinos'));
const Checkin   = lazy(() => import('./pages/Checkin'));
const Historico = lazy(() => import('./pages/Historico'));
const Perfil    = lazy(() => import('./pages/Perfil'));

function ProtectedLayout({ children }) {
  const { user, loading } = useAuth();
  const { pathname }      = useLocation();

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
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen bg-ios-background">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        {/* key no pathname reinicia a animação a cada navegação — transição única e consistente */}
        <main key={pathname} style={{ animation: 'pageIn 0.3s var(--ease-out-quint)' }}>
          {children}
        </main>
      </Suspense>
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
      <Route path="/perfil" element={<ProtectedLayout><Perfil /></ProtectedLayout>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
