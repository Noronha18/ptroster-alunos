import { useEffect } from 'react';
import { useAluno } from '../hooks/useAluno';
import { useSessoes } from '../hooks/useSessoes';
import { useToast } from '../hooks/useToast';
import { Toast } from '../components/Toast';

const formatarDataCompleta = () => {
  const dias  = ['Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado'];
  const meses = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
  const d = new Date();
  return `${dias[d.getDay()]}, ${d.getDate()} de ${meses[d.getMonth()]}`;
};

const formatarHora = (dataHora) => {
  if (!dataHora) return '';
  return new Date(dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

export default function Checkin() {
  const { aluno, planoAtivo, loading }                                            = useAluno();
  const { sessaoHoje, loadingSessao, checkingIn, buscarSessaoHoje, fazerCheckin } = useSessoes();
  const { toast, show }                                                           = useToast();

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

  if (sessaoHoje) {
    return (
      <div
        className="min-h-screen bg-ios-background flex flex-col items-center justify-center px-7 text-center"
        style={{ animation: 'fadeIn 0.25s ease' }}
      >
        <div style={{ animation: 'pop 0.4s cubic-bezier(0.16,1,0.3,1)' }}>
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: 'rgba(0,255,127,0.1)', border: '3px solid #00FF7F' }}
          >
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <path d="M8 18l7 7L28 12" stroke="#00FF7F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="text-[26px] font-black text-white mb-2" style={{ letterSpacing: '-0.02em' }}>
            Presença Confirmada!
          </h2>
          <p className="text-sm text-ios-text-secondary mb-1">
            Check-in realizado às {formatarHora(sessaoHoje.data_hora)}
          </p>
          <p className="text-[13px] font-bold mb-7" style={{ color: '#00FF7F' }}>
            🔥 Continue assim!
          </p>
          <div
            className="w-full rounded-2xl p-5 text-left"
            style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <p className="text-[13px] text-ios-text-secondary mb-1">{formatarDataCompleta()}</p>
            <p className="text-[16px] font-black text-white">
              {sessaoHoje.plano_treino?.titulo ?? planoAtivo?.titulo ?? 'Sessão Presencial'}
            </p>
          </div>
        </div>
        <Toast toast={toast} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ios-background px-5 pt-6 pb-6 flex flex-col" style={{ animation: 'fadeIn 0.25s ease' }}>
      <div className="mb-6">
        <h1 className="text-[28px] font-black text-white mb-1" style={{ letterSpacing: '-0.02em' }}>Check-in</h1>
        <p className="text-[14px] text-ios-text-secondary">Confirme sua presença de hoje</p>
      </div>

      {/* Card do treino */}
      <div className="rounded-2xl p-5 mb-3" style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-[11px] font-bold text-ios-text-secondary uppercase mb-1" style={{ letterSpacing: '0.05em' }}>
              Treino de Hoje
            </p>
            <p className="text-[20px] font-black text-white leading-tight">
              {planoAtivo?.titulo ?? 'Sessão Presencial'}
            </p>
            <p className="text-[13px] text-ios-text-secondary mt-1">{formatarDataCompleta()}</p>
          </div>
          {planoAtivo && (
            <span
              className="text-[11px] font-bold uppercase px-2.5 py-1 rounded-full shrink-0 ml-3"
              style={{ background: 'rgba(0,255,127,0.1)', color: '#00FF7F', border: '1px solid rgba(0,255,127,0.2)', letterSpacing: '0.06em' }}
            >
              Ativo
            </span>
          )}
        </div>
        {planoAtivo && (
          <div className="flex gap-6 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <div>
              <p className="text-[11px] font-bold text-ios-text-secondary uppercase mb-0.5" style={{ letterSpacing: '0.04em' }}>Plano</p>
              <p className="text-[13px] font-bold text-white">{planoAtivo.titulo}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-ios-text-secondary uppercase mb-0.5" style={{ letterSpacing: '0.04em' }}>Saldo</p>
              <p className="text-[13px] font-bold text-white">{aluno?.saldo_aulas ?? '—'} aulas</p>
            </div>
          </div>
        )}
      </div>

      {/* Info do aluno */}
      {aluno && (
        <div className="rounded-2xl p-4 mb-3 flex items-center gap-3" style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(0,255,127,0.1)' }}
          >
            <span className="text-sm font-black" style={{ color: '#00FF7F' }}>
              {(aluno.nome ?? 'A').charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-black text-white text-sm">{aluno.nome ?? '—'}</p>
            <p className="text-xs text-ios-text-secondary">{aluno.saldo_aulas ?? '—'} aulas no saldo</p>
          </div>
        </div>
      )}

      {!planoAtivo && (
        <div
          className="rounded-2xl p-4 mb-3 text-center"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <p className="text-ios-text-secondary text-sm">
            Nenhum plano ativo. O check-in será registrado sem plano.
          </p>
        </div>
      )}

      {/* Botão CTA */}
      <div className="mt-auto pt-4">
        <button
          onClick={handleCheckin}
          disabled={checkingIn}
          className="w-full font-black text-black rounded-2xl flex items-center justify-center gap-2"
          style={{
            padding: '18px',
            fontSize: 17,
            background: checkingIn ? 'rgba(0,255,127,0.6)' : '#00FF7F',
            cursor: checkingIn ? 'default' : 'pointer',
            transition: 'opacity 0.2s',
          }}
        >
          {checkingIn ? (
            <>
              <svg className="animate-spin h-5 w-5 text-black" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Confirmando...
            </>
          ) : '✓ Confirmar Presença'}
        </button>
        <p className="text-center text-xs text-ios-text-secondary mt-3 font-medium">
          Registra sua presença na aula de hoje
        </p>
      </div>

      <Toast toast={toast} />
    </div>
  );
}
