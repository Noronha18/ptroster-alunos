import { useEffect } from 'react';
import { useSessoes } from '../hooks/useSessoes';

const getDiaSemana = (dataHora) => {
  const dias = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
  return dias[new Date(dataHora).getDay()];
};

const formatarData = (dataHora) =>
  new Date(dataHora).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });

function getWeeklyData(historico) {
  const weeks     = Array(8).fill(0);
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const now       = Date.now();
  historico.forEach(s => {
    const idx = Math.floor((now - new Date(s.data_hora).getTime()) / msPerWeek);
    if (idx >= 0 && idx < 8) weeks[idx]++;
  });
  return weeks.reverse().map((count, i) => ({ label: i === 7 ? 'Atual' : `S${i + 1}`, count }));
}

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

function WeeklyBars({ data }) {
  const maxCount = Math.max(...data.map(d => d.count), 1);
  return (
    <div>
      <div className="flex items-end gap-1.5" style={{ height: 80 }}>
        {data.map((d, i) => {
          const isLast = i === data.length - 1;
          const barH   = maxCount > 0 ? (d.count / maxCount) * 72 : 0;
          return (
            <div key={i} className="flex-1 flex flex-col items-center justify-end gap-0.5">
              {d.count > 0 && (
                <span className="text-[9px] font-bold" style={{ color: isLast ? '#00FF7F' : '#888' }}>
                  {d.count}
                </span>
              )}
              <div
                className="w-full rounded-t"
                style={{
                  height: Math.max(barH, d.count > 0 ? 4 : 2),
                  background: isLast ? '#00FF7F' : 'rgba(0,255,127,0.28)',
                  minHeight: 2,
                }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex gap-1.5 mt-1.5">
        {data.map((d, i) => (
          <span key={i} className="flex-1 text-center text-[9px]" style={{ color: i === data.length - 1 ? '#00FF7F' : '#555' }}>
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Historico() {
  const { historico, loadingHistorico, buscarHistorico } = useSessoes();

  useEffect(() => { buscarHistorico(); }, [buscarHistorico]);

  if (loadingHistorico) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ios-background">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const weeklyData = getWeeklyData(historico);
  const streak     = calcularStreak(historico);
  const thisMes    = getThisMonth(historico);

  return (
    <div className="min-h-screen bg-ios-background pb-6" style={{ animation: 'fadeIn 0.25s ease' }}>
      <div className="px-5 pt-6 mb-4">
        <h1 className="text-[28px] font-black text-white mb-1" style={{ letterSpacing: '-0.02em' }}>Histórico</h1>
        <p className="text-[14px] text-ios-text-secondary">Últimas 8 semanas</p>
      </div>

      {/* Gráfico semanal */}
      {historico.length > 0 && (
        <div className="mx-5 mb-4">
          <div className="rounded-2xl p-5" style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-[11px] font-bold text-ios-text-secondary uppercase mb-1" style={{ letterSpacing: '0.06em' }}>
                  Sessões por Semana
                </p>
                <p className="text-[30px] font-black text-white leading-none">
                  {weeklyData[weeklyData.length - 1].count}
                  <span className="text-sm font-medium text-ios-text-secondary ml-1">esta semana</span>
                </p>
              </div>
              <span
                className="text-[11px] font-bold uppercase px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(0,255,127,0.1)', color: '#00FF7F', border: '1px solid rgba(0,255,127,0.2)', letterSpacing: '0.06em' }}
              >
                {thisMes} no mês
              </span>
            </div>
            <WeeklyBars data={weeklyData} />
          </div>
        </div>
      )}

      {/* Stats */}
      {historico.length > 0 && (
        <div className="mx-5 grid grid-cols-3 gap-2 mb-4">
          {[
            { label: 'Este mês', value: thisMes,          accent: false },
            { label: 'Total',    value: historico.length, accent: false },
            { label: 'Sequência', value: `${streak}d 🔥`, accent: true  },
          ].map((s, i) => (
            <div key={i} className="rounded-2xl p-3 text-center" style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.07)' }}>
              <p className="text-[22px] font-black" style={{ color: s.accent ? '#00FF7F' : '#fff' }}>{s.value}</p>
              <p className="text-[10px] font-bold text-ios-text-secondary uppercase mt-1" style={{ letterSpacing: '0.04em' }}>{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Lista de sessões */}
      <div className="px-5">
        <h3 className="text-[15px] font-bold text-white mb-3">Registro de Treinos</h3>

        {historico.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{ background: '#1A1A1A' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <p className="text-ios-text-secondary font-medium">Nenhuma sessão registrada ainda.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {historico.map((sessao, i) => (
              <div
                key={sessao.id}
                className="flex items-center gap-3 px-4 py-3.5 rounded-2xl"
                style={{
                  background: i === 0 ? 'rgba(0,255,127,0.06)' : '#1A1A1A',
                  border: `1px solid ${i === 0 ? 'rgba(0,255,127,0.18)' : 'rgba(255,255,255,0.07)'}`,
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-base"
                  style={{ background: i === 0 ? 'rgba(0,255,127,0.1)' : '#222' }}
                >
                  {i === 0 ? '⚡' : '✓'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-bold text-white truncate">
                    {sessao.plano_treino?.titulo ?? 'Sessão Presencial'}
                  </p>
                  <p className="text-xs text-ios-text-secondary mt-0.5">
                    {getDiaSemana(sessao.data_hora)} · {formatarData(sessao.data_hora)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
