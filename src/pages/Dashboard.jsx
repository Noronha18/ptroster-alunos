import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAluno } from '../hooks/useAluno';
import { useSessoes } from '../hooks/useSessoes';

function DumbbellIcon({ color = '#fff', size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2"  y="9"  width="3" height="6" rx="1.5" fill={color}/>
      <rect x="6"  y="7"  width="3" height="10" rx="1.5" fill={color}/>
      <rect x="15" y="7"  width="3" height="10" rx="1.5" fill={color}/>
      <rect x="19" y="9"  width="3" height="6" rx="1.5" fill={color}/>
      <rect x="9"  y="11" width="6" height="2" rx="1" fill={color}/>
    </svg>
  );
}

const primeiroNome = (nome) => nome?.split(' ')[0] ?? 'Atleta';

const iniciais = (nome) => {
  if (!nome) return '??';
  const parts = nome.split(' ').filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const formatarDataCurta = () => {
  const dias  = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const meses = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
  const d = new Date();
  return `${dias[d.getDay()]}, ${d.getDate()} de ${meses[d.getMonth()]}`;
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

function getUltimos7Dias(historico) {
  const dates  = new Set(historico.map(s => s.data_hora.split('T')[0]));
  const semana = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    return { label: semana[d.getDay()], done: dates.has(dateStr), isToday: i === 6 };
  });
}

export default function Dashboard() {
  const navigate                                                       = useNavigate();
  const { aluno, planoAtivo, loading }                                 = useAluno();
  const { sessaoHoje, historico, buscarSessaoHoje, buscarHistorico }   = useSessoes();

  useEffect(() => {
    buscarSessaoHoje();
    buscarHistorico();
  }, [buscarSessaoHoje, buscarHistorico]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ios-background">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const streak   = calcularStreak(historico);
  const ultimos7 = getUltimos7Dias(historico);
  const recentes = historico.slice(0, 3);
  const totalEx  = planoAtivo?.treinos?.reduce((a, t) => a + (t.prescricoes?.length ?? 0), 0) ?? 0;
  const metaMes  = (aluno?.frequencia_semanal_plano ?? 0) * 4;
  const faltam   = metaMes - (aluno?.aulas_feitas_mes ?? 0);

  return (
    <div className="min-h-screen bg-ios-background pb-4" style={{ animation: 'fadeIn 0.25s ease' }}>

      {/* Header */}
      <div className="flex justify-between items-center px-5 pt-5">
        <div>
          <p className="text-xs font-medium text-ios-text-secondary">
            {formatarDataCurta()}{streak > 0 ? ` · 🔥 ${streak} dias` : ''}
          </p>
          <h1 className="text-[30px] font-black text-white mt-0.5" style={{ letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            Olá, {primeiroNome(aluno?.nome)}
          </h1>
        </div>
        <button
          onClick={() => navigate('/perfil')}
          className="w-11 h-11 rounded-full border-none cursor-pointer font-black text-black text-sm shrink-0"
          style={{ background: 'linear-gradient(135deg, #00FF7F, #00BFFF)' }}
          aria-label="Ver perfil"
        >
          {iniciais(aluno?.nome)}
        </button>
      </div>

      {/* Card Principal */}
      <div className="px-5 mt-4">
        <div className="bg-card rounded-3xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.09)' }}>
          {/* Topo com gradiente verde */}
          <div
            className="px-5 pt-5 pb-4"
            style={{
              background: 'linear-gradient(135deg, rgba(0,255,127,0.13) 0%, rgba(0,255,127,0.03) 100%)',
              borderBottom: '1px solid rgba(0,255,127,0.1)',
            }}
          >
            {sessaoHoje ? (
              <span
                className="inline-block text-[11px] font-bold uppercase px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(0,255,127,0.1)', color: '#00FF7F', border: '1px solid rgba(0,255,127,0.2)', letterSpacing: '0.06em' }}
              >
                ✓ Presença Confirmada
              </span>
            ) : (
              <span
                className="inline-block text-[11px] font-bold uppercase px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(0,255,127,0.1)', color: '#00FF7F', border: '1px solid rgba(0,255,127,0.2)', letterSpacing: '0.06em' }}
              >
                {planoAtivo ? 'Treino de Hoje' : 'Sem Plano'}
              </span>
            )}
            <h2 className="text-[26px] font-black text-white mt-3" style={{ letterSpacing: '-0.02em', lineHeight: 1.15 }}>
              {planoAtivo?.titulo ?? 'Nenhum plano ativo'}
            </h2>
            {planoAtivo?.objetivo_estrategico && (
              <p className="text-[13px] font-medium text-ios-text-secondary mt-1.5">
                {planoAtivo.objetivo_estrategico}
              </p>
            )}
          </div>

          {/* Stats */}
          {planoAtivo && (
            <div className="flex" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex-1 px-5 py-3" style={{ borderRight: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-[10px] font-bold text-ios-text-secondary uppercase" style={{ letterSpacing: '0.07em' }}>Treinos</p>
                <p className="text-xl font-black text-white mt-0.5">{planoAtivo.treinos?.length ?? 0}</p>
              </div>
              <div className="flex-1 px-5 py-3" style={{ borderRight: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-[10px] font-bold text-ios-text-secondary uppercase" style={{ letterSpacing: '0.07em' }}>Exercícios</p>
                <p className="text-xl font-black text-white mt-0.5">{totalEx}</p>
              </div>
              <div className="flex-1 px-5 py-3">
                <p className="text-[10px] font-bold text-ios-text-secondary uppercase" style={{ letterSpacing: '0.07em' }}>Saldo</p>
                <p className="text-xl font-black text-white mt-0.5">{aluno?.saldo_aulas ?? '—'}</p>
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="px-5 py-4">
            <Link
              to={sessaoHoje ? '/treinos' : '/checkin'}
              className="flex items-center justify-center gap-2 w-full font-black text-black rounded-2xl"
              style={{
                padding: '17px',
                fontSize: 16,
                background: '#00FF7F',
                animation: 'pulse 2.5s ease-in-out infinite',
                letterSpacing: '-0.01em',
              }}
            >
              <DumbbellIcon color="#000" size={18} />
              {sessaoHoje ? 'Ver Treino de Hoje →' : 'Fazer Check-in →'}
            </Link>
          </div>
        </div>
      </div>

      {/* Tracker semanal */}
      <div className="px-5 mt-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-[15px] font-bold text-white">Esta Semana</h3>
          <span className="text-[13px] font-medium text-ios-text-secondary">
            {ultimos7.filter(d => d.done).length} / 7
          </span>
        </div>
        <div className="flex justify-between">
          {ultimos7.map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-bold"
                style={{
                  background: d.done ? '#00FF7F' : d.isToday ? 'rgba(0,255,127,0.1)' : 'transparent',
                  border: d.isToday && !d.done ? '2px solid #00FF7F' : d.done ? 'none' : '2px solid #444',
                  color: d.done ? '#000' : d.isToday ? '#00FF7F' : '#555',
                }}
              >
                {d.done ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2.5 7l3 3L11.5 4" stroke="#000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : d.label.charAt(0)}
              </div>
              <span className="text-[11px] font-medium" style={{ color: d.isToday ? '#00FF7F' : '#555' }}>
                {d.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Últimas sessões */}
      {recentes.length > 0 && (
        <div className="px-5 mt-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-[15px] font-bold text-white">Últimas Sessões</h3>
            <Link to="/historico" className="text-[13px] font-medium text-ios-text-secondary">
              Ver todas
            </Link>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            {recentes.map(s => {
              const d      = new Date(s.data_hora);
              const semana = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
              const meses  = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
              return (
                <div
                  key={s.id}
                  className="flex justify-between items-center py-3"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <div>
                    <p className="text-[14px] font-bold text-white">
                      {s.plano_treino?.titulo ?? 'Sessão Presencial'}
                    </p>
                    <p className="text-xs text-ios-text-secondary mt-0.5">
                      {semana[d.getDay()]} · {d.getDate()} de {meses[d.getMonth()]}
                    </p>
                  </div>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 3.5l3 3L8.5 2.5" stroke="#00FF7F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Aviso de meta */}
      {faltam > 0 && faltam <= 3 && metaMes > 0 && (
        <div className="mx-5 mt-4">
          <div
            className="flex items-center gap-2 px-4 py-3 rounded-2xl"
            style={{ background: 'rgba(0,255,127,0.08)', border: '1px solid rgba(0,255,127,0.15)' }}
          >
            <span>🎯</span>
            <p className="text-[13px] font-bold" style={{ color: '#00FF7F' }}>
              Faltam {faltam} treinos para bater a meta mensal!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
