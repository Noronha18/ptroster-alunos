import { useEffect } from 'react';
import { useSessoes } from '../hooks/useSessoes';
import { useAluno } from '../hooks/useAluno';
import { Button } from '@astryxdesign/core/Button';
import { PageLoader } from '../components/PageLoader';
import { CheckIcon, FlameIcon } from '../components/icons';
import { calcularStreak, treinosNoMes } from '../utils/dashboard';

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

function WeeklyBars({ data }) {
  const maxCount = Math.max(...data.map(d => d.count), 1);
  return (
    <ol className="flex items-end gap-2 h-32" aria-label="Sessões por semana, das mais antigas para a atual">
      {data.map((d, i) => {
        const atual = i === data.length - 1;
        return (
          <li key={i} className="flex-1 h-full flex flex-col items-center justify-end gap-1" aria-label={`${d.label}: ${d.count} sessões`}>
            <span className={`num text-[13px] font-bold ${atual ? 'text-primary' : 'text-ink-muted'}`}>{d.count || ''}</span>
            <span
              className={`w-full rounded-t-md origin-bottom animate-[barGrow_0.5s_var(--ease-out-quint)_backwards] ${atual ? 'bg-primary' : 'bg-primary/30'}`}
              style={{ height: `${Math.max((d.count / maxCount) * 100, 3)}%`, animationDelay: `${i * 40}ms` }}
            />
            <span className={`text-[12px] ${atual ? 'text-ink font-semibold' : 'text-ink-dim'}`}>{d.label}</span>
          </li>
        );
      })}
    </ol>
  );
}

const labelSessao = (sessao, planos) => {
  if (sessao.tipo_atividade) return sessao.tipo_atividade;
  if (sessao.plano_treino_id) {
    const plano = planos?.find(p => p.id === sessao.plano_treino_id);
    if (plano) return plano.titulo;
  }
  return 'Sessão Presencial';
};

export default function Historico() {
  const { historico, loadingHistorico, buscarHistorico } = useSessoes();
  const { aluno } = useAluno();

  useEffect(() => { buscarHistorico(); }, [buscarHistorico]);

  if (loadingHistorico) return <PageLoader />;

  if (historico.length === 0) {
    return (
      <div className="min-h-[calc(100dvh-5rem)] bg-bg px-5 pt-5 max-w-lg mx-auto">
        <h1 className="text-[32px] leading-[1.1] font-black tracking-[-0.02em] text-ink">Histórico</h1>
        <p className="mt-3 text-[17px] text-ink-muted">
          Nenhum treino registrado ainda. Faça seu primeiro check-in e ele aparece aqui.
        </p>
        <div className="mt-6">
          <Button variant="primary" size="lg" width="100%" className="min-h-14 text-[17px] font-bold" label="Fazer check-in" href="/checkin" />
        </div>
      </div>
    );
  }

  const weeklyData = getWeeklyData(historico);
  const streak     = calcularStreak(historico);
  const thisMes    = treinosNoMes(historico);

  return (
    <div className="min-h-screen bg-bg px-5 pt-5 pb-6 max-w-lg mx-auto flex flex-col gap-7">
      <header>
        <h1 className="text-[32px] leading-[1.1] font-black tracking-[-0.02em] text-ink">Histórico</h1>
        <p className="mt-1 text-[15px] text-ink-muted">Últimas 8 semanas</p>
      </header>

      <section className="rounded-2xl bg-surface border border-line p-5" aria-labelledby="por-semana">
        <h2 id="por-semana" className="text-[15px] font-semibold text-ink-muted">Sessões por semana</h2>
        <p className="mt-1 mb-5 text-[16px] text-ink-muted">
          <span className="num text-[36px] leading-none font-black text-ink">{weeklyData[weeklyData.length - 1].count}</span> esta semana
        </p>
        <WeeklyBars data={weeklyData} />

        <dl className="mt-5 pt-4 border-t border-line grid grid-cols-3 gap-3">
          <div>
            <dt className="text-[13px] text-ink-muted">Este mês</dt>
            <dd className="num text-[22px] font-bold text-ink">{thisMes}</dd>
          </div>
          <div>
            <dt className="text-[13px] text-ink-muted">Total</dt>
            <dd className="num text-[22px] font-bold text-ink">{historico.length}</dd>
          </div>
          <div>
            <dt className="text-[13px] text-ink-muted">Sequência</dt>
            <dd className={`num flex items-center gap-1 text-[22px] font-bold ${streak > 0 ? 'text-alert' : 'text-ink'}`}>
              <FlameIcon size={18} /> {streak} <span className="text-[14px] font-semibold">{streak === 1 ? 'dia' : 'dias'}</span>
            </dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="registro">
        <h2 id="registro" className="text-[18px] font-bold text-ink mb-1">Registro de treinos</h2>
        <ul className="divide-y divide-line border-y border-line">
          {historico.map(sessao => (
            <li key={sessao.id} className="flex items-center justify-between gap-3 py-3.5">
              <div className="min-w-0">
                <p className="text-[16px] font-semibold text-ink truncate">{labelSessao(sessao, aluno?.planos_treino)}</p>
                <p className="text-[14px] text-ink-muted mt-0.5">
                  {getDiaSemana(sessao.data_hora)} · {formatarData(sessao.data_hora)}
                </p>
              </div>
              <span className="text-primary shrink-0"><CheckIcon /></span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
