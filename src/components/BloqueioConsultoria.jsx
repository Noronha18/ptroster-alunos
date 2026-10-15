import { useAuth } from '../contexts/AuthContext';

export function BloqueioConsultoria() {
  const { logout } = useAuth();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center bg-ios-background">
      <h1 className="text-2xl font-black text-white">Sua consultoria venceu</h1>
      <p className="text-base text-ios-text-secondary max-w-sm">
        Fale com seu treinador para renovar e voltar a acessar seus treinos.
      </p>
      <button type="button" onClick={logout} className="mt-4 text-sm font-semibold text-ios-text-secondary underline">
        Sair
      </button>
    </div>
  );
}
