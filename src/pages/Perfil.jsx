import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAluno } from '../hooks/useAluno';
import { useSessoes } from '../hooks/useSessoes';

const iniciais = (nome) => {
  if (!nome) return '??';
  const parts = nome.split(' ').filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

function calcularStreak(historico) {
  const dates = new Set(historico.map(s => s.data_hora.split('T')[0]));
  let streak = 0;
  while (streak < 365) {
    const d = new Date();
    d.setDate(d.getDate() - streak);
    if (dates.has(d.toISOString().split('T')[0])) streak++;
    else break;
  }
  return streak;
}

function getThisMonth(historico) {
  const now = new Date();
  return historico.filter(s => {
    const d = new Date(s.data_hora);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;
}

function MetaBar({ label, current, target, unit }) {
  const pct      = target > 0 ? Math.min(Math.round((current / target) * 100), 100) : 0;
  const barColor = pct >= 80 ? '#00FF7F' : pct >= 50 ? '#FF6B35' : '#555';
  const icon     = pct >= 80 ? '✓' : pct >= 50 ? '→' : '…';
  return (
    <div className="rounded-2xl p-4 mb-2" style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="flex justify-between items-start mb-2.5">
        <div>
          <p className="text-[14px] font-bold text-white">{label}</p>
          <p className="text-xs text-ios-text-secondary mt-0.5">
            {current} {unit} <span style={{ color: '#444' }}>/ {target} {unit}</span>
          </p>
        </div>
        <span className="text-[15px] font-black" style={{ color: barColor }}>{icon} {pct}%</span>
      </div>
      <div
        className="h-1.5 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        style={{ background: '#2A2A2A' }}
      >
        <div
          className="h-full rounded-full"
          style={{
            background: barColor,
            transform: `scaleX(${pct / 100})`,
            transformOrigin: 'left',
            transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)',
          }}
        />
      </div>
    </div>
  );
}

export default function Perfil() {
  const { logout }                     = useAuth();
  const { aluno, planoAtivo, loading } = useAluno();
  const { historico, buscarHistorico } = useSessoes();

  useEffect(() => { buscarHistorico(); }, [buscarHistorico]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ios-background">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const streak  = calcularStreak(historico);
  const thisMes = getThisMonth(historico);
  const metaMes = (aluno?.frequencia_semanal_plano ?? 0) * 4;

  return (
    <div className="min-h-screen bg-ios-background pb-6" style={{ animation: 'fadeIn 0.25s ease' }}>

      {/* Cabeçalho do perfil */}
      <div
        className="flex items-center gap-4 px-5 pt-6 pb-5"
        style={{
          background: 'linear-gradient(180deg, rgba(0,255,127,0.05) 0%, transparent 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <div
          className="w-[72px] h-[72px] rounded-full flex items-center justify-center text-[26px] font-black text-black shrink-0"
          style={{
            background: 'linear-gradient(135deg, #00FF7F, #00BFFF)',
            boxShadow: '0 0 0 3px #0D0D0D, 0 0 0 5px rgba(255,255,255,0.1)',
          }}
          role="img"
          aria-label="Avatar"
        >
          {iniciais(aluno?.nome)}
        </div>
        <div className="min-w-0">
          <h1 className="text-[22px] font-black text-white" style={{ letterSpacing: '-0.01em' }}>
            {aluno?.nome ?? 'Atleta'}
          </h1>
          {planoAtivo && (
            <p className="text-[13px] text-ios-text-secondary mt-0.5">{planoAtivo.titulo}</p>
          )}
          {aluno?.objetivo && (
            <p className="text-xs text-ios-text-secondary mt-0.5 truncate">{aluno.objetivo}</p>
          )}
        </div>
      </div>

      {/* Stats horizontais */}
      <div className="mx-5 flex" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        {[
          { label: 'Saldo',     value: aluno?.saldo_aulas ?? '—', unit: 'aulas'   },
          { label: 'Este mês',  value: thisMes,                    unit: 'treinos' },
          { label: 'Por semana', value: aluno?.frequencia_semanal_plano ?? '—', unit: 'dias' },
        ].map((s, i) => (
          <div
            key={i}
            className="flex-1 py-4 text-center"
            style={{ borderRight: i < 2 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}
          >
            <p className="text-[20px] font-black text-white">{s.value}</p>
            <p className="text-[10px] text-ios-text-secondary mt-0.5">{s.unit}</p>
            <p className="text-[10px] font-bold text-ios-text-secondary mt-0.5 uppercase" style={{ letterSpacing: '0.04em' }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Streak + mês */}
      <div className="mx-5 mt-4 grid grid-cols-2 gap-2">
        <div
          className="rounded-2xl p-4"
          style={{ background: 'rgba(255,107,53,0.08)', border: '1px solid rgba(255,107,53,0.18)' }}
        >
          <p className="text-[28px]">🔥</p>
          <p className="text-[30px] font-black mt-1 leading-none" style={{ color: '#FF6B35' }}>{streak}</p>
          <p className="text-xs text-ios-text-secondary mt-1">dias seguidos</p>
        </div>
        <div
          className="rounded-2xl p-4"
          style={{ background: 'rgba(0,255,127,0.08)', border: '1px solid rgba(0,255,127,0.15)' }}
        >
          <p className="text-[28px]">🏆</p>
          <p className="text-[30px] font-black text-primary mt-1 leading-none">{thisMes}</p>
          <p className="text-xs text-ios-text-secondary mt-1">treinos no mês</p>
        </div>
      </div>

      {/* Metas */}
      {metaMes > 0 && (
        <div className="px-5 mt-6">
          <h3 className="text-[15px] font-bold text-white mb-3">Metas Mensais</h3>
          <MetaBar label="Treinos no mês" current={thisMes} target={metaMes} unit="treinos" />
          {aluno?.saldo_aulas !== undefined && aluno.saldo_aulas > 0 && (
            <MetaBar
              label="Saldo de aulas"
              current={aluno.saldo_aulas}
              target={Math.max(aluno.saldo_aulas + thisMes, 1)}
              unit="aulas"
            />
          )}
        </div>
      )}

      {/* Plano ativo */}
      {planoAtivo && (
        <div className="px-5 mt-4">
          <h3 className="text-[15px] font-bold text-white mb-3">Plano Atual</h3>
          <div className="rounded-2xl p-4" style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex justify-between items-start mb-2">
              <p className="text-[16px] font-black text-white pr-3">{planoAtivo.titulo}</p>
              <span
                className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full shrink-0"
                style={{ background: 'rgba(0,255,127,0.1)', color: '#00FF7F', border: '1px solid rgba(0,255,127,0.2)', letterSpacing: '0.06em' }}
              >
                Ativo
              </span>
            </div>
            {planoAtivo.objetivo_estrategico && (
              <p className="text-sm text-ios-text-secondary">{planoAtivo.objetivo_estrategico}</p>
            )}
            <div className="flex gap-6 mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              <div>
                <p className="text-[10px] font-bold text-ios-text-secondary uppercase" style={{ letterSpacing: '0.04em' }}>Treinos</p>
                <p className="text-[13px] font-black text-white mt-0.5">{planoAtivo.treinos?.length ?? 0}</p>
              </div>
              {planoAtivo.duracao_semanas && (
                <div>
                  <p className="text-[10px] font-bold text-ios-text-secondary uppercase" style={{ letterSpacing: '0.04em' }}>Duração</p>
                  <p className="text-[13px] font-black text-white mt-0.5">{planoAtivo.duracao_semanas} sem.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Logout */}
      <div className="px-5 mt-8">
        <button
          onClick={logout}
          className="w-full py-4 rounded-2xl text-sm font-black text-ios-text-secondary"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          Sair da conta
        </button>
      </div>
    </div>
  );
}
