import { useEffect } from 'react';
import { useAluno } from '../hooks/useAluno';
import { useSessoes } from '../hooks/useSessoes';
import { useToast } from '../hooks/useToast';
import { Toast } from '../components/Toast';

const formatarDataCompleta = () => {
  const dias = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  const d = new Date();
  return `${dias[d.getDay()]}, ${d.getDate()} de ${meses[d.getMonth()]}`;
};

const formatarHora = (dataHora) => {
  if (!dataHora) return '';
  return new Date(dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

export default function Checkin() {
  const { aluno, planoAtivo, loading } = useAluno();
  const { sessaoHoje, loadingSessao, checkingIn, buscarSessaoHoje, fazerCheckin } = useSessoes();
  const { toast, show } = useToast();

  useEffect(() => { buscarSessaoHoje(); }, [buscarSessaoHoje]);

  const handleCheckin = async () => {
    const resultado = await fazerCheckin(planoAtivo?.id ?? null);
    if (resultado.success) {
      show('Presença confirmada! Bom treino! 💪', 'success');
    } else {
      show(resultado.message, 'error');
    }
  };

  if (loading || loadingSessao) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ios-background">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ios-background px-4 pt-14 pb-6 flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white tracking-tight">Check-in</h1>
        <p className="text-ios-text-secondary text-sm font-bold uppercase tracking-widest mt-1">
          {formatarDataCompleta()}
        </p>
      </div>

      {sessaoHoje ? (
        /* Já fez check-in */
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" className="w-12 h-12">
              <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-white mb-2">Presença confirmada!</h2>
          <p className="text-ios-text-secondary font-medium mb-1">
            Check-in realizado às {formatarHora(sessaoHoje.data_hora)}
          </p>
          {planoAtivo && (
            <p className="text-sm text-ios-text-secondary mt-2">
              Plano: <span className="font-bold text-white/80">{planoAtivo.titulo}</span>
            </p>
          )}
          <div className="mt-8 w-full bg-primary/10 border border-primary/20 rounded-2xl p-5">
            <p className="text-primary font-black text-sm uppercase tracking-wide">Dica do dia</p>
            <p className="text-ios-text-secondary text-sm mt-1">
              Foco total! Lembre de se hidratar entre as séries e anotar suas cargas.
            </p>
          </div>
        </div>
      ) : (
        /* Check-in pendente */
        <div className="flex-1 flex flex-col">
          {/* Info do aluno */}
          <div className="bg-card rounded-2xl border border-ios-border p-5 mb-4">
            <p className="text-[10px] font-black text-ios-text-secondary uppercase tracking-widest mb-3">Aluno</p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                <span className="text-xl font-black text-primary">
                  {(aluno?.nome ?? 'A').charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-black text-white">{aluno?.nome ?? '—'}</p>
                <p className="text-xs text-ios-text-secondary font-medium">
                  {aluno?.saldo_aulas ?? '—'} aulas no saldo
                </p>
              </div>
            </div>
          </div>

          {/* Plano selecionado */}
          {planoAtivo ? (
            <div className="bg-card rounded-2xl border border-ios-border p-5 mb-4">
              <p className="text-[10px] font-black text-ios-text-secondary uppercase tracking-widest mb-1">Plano de treino</p>
              <p className="font-black text-white">{planoAtivo.titulo}</p>
              <p className="text-xs text-ios-text-secondary mt-0.5">{planoAtivo.treinos?.length ?? 0} treinos configurados</p>
            </div>
          ) : (
            <div className="bg-card2 rounded-2xl p-4 mb-4">
              <p className="text-ios-text-secondary text-sm text-center font-medium">
                Nenhum plano ativo. O check-in será registrado sem plano.
              </p>
            </div>
          )}

          {/* Botão de check-in */}
          <div className="mt-auto pt-4">
            <button
              onClick={handleCheckin}
              disabled={checkingIn}
              className="w-full py-5 bg-primary text-black font-black text-lg rounded-2xl active:scale-[0.98] active:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {checkingIn ? (
                <svg className="animate-spin h-6 w-6 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                  Confirmar Presença
                </>
              )}
            </button>
            <p className="text-center text-xs text-ios-text-secondary mt-3 font-medium">
              Registra sua presença na aula de hoje
            </p>
          </div>
        </div>
      )}

      <Toast toast={toast} />
    </div>
  );
}
