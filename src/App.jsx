import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { BottomNav } from './components/BottomNav';
import { PageLoader } from './components/PageLoader';
import Login from './pages/Login';
import { BloqueioConsultoria } from './components/BloqueioConsultoria';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Treinos   = lazy(() => import('./pages/Treinos'));
const Checkin   = lazy(() => import('./pages/Checkin'));
const Historico = lazy(() => import('./pages/Historico'));
const Perfil    = lazy(() => import('./pages/Perfil'));

function ProtectedLayout({ children }) {
  const { user, loading, aluno } = useAuth();
  const { pathname }      = useLocation();

  if (loading) {
    return <PageLoader />;
  }

  if (!user) return <Navigate to="/login" replace />;
  if (aluno?.acesso_bloqueado) return <BloqueioConsultoria />;

  return (
    <div className="pb-[calc(4rem+env(safe-area-inset-bottom))]">
      <Suspense fallback={<PageLoader />}>
        {/* key no pathname reinicia a animação a cada navegação — transição única e consistente */}
        <main key={pathname} className="animate-[pageIn_0.3s_var(--ease-out-quint)]">
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
