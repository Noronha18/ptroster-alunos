import { useAuth } from '../contexts/AuthContext';

export function BloqueioConsultoria() {
  const { logout } = useAuth();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center bg-bg">
      <h1 className="text-2xl font-black text-ink text-balance">Sua consultoria venceu</h1>
      <p className="text-base text-ink-muted max-w-sm">
        Fale com seu treinador para renovar e voltar a acessar seus treinos.
      </p>
      <button
        type="button"
        onClick={logout}
        className="mt-4 min-h-12 px-8 rounded-2xl bg-surface-2 border border-line text-ink text-base font-semibold"
      >
        Sair
      </button>
    </div>
  );
}
