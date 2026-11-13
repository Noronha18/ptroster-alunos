import { useEffect } from 'react';
import { Button } from '@astryxdesign/core/Button';
import { useAuth } from '../contexts/AuthContext';
import { useAluno } from '../hooks/useAluno';
import { useSessoes } from '../hooks/useSessoes';
import { PageLoader } from '../components/PageLoader';
import { calcularStreak, treinosNoMes } from '../utils/dashboard';

const iniciais = (nome) => {
  if (!nome) return '??';
  const parts = nome.split(' ').filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

function MetaBar({ label, current, target, unit }) {
  const pct = target > 0 ? Math.min(Math.round((current / target) * 100), 100) : 0;
  // Cor reforça, não substitui: o percentual está sempre escrito ao lado.
  const cor = pct >= 80 ? ['bg-primary', 'text-primary'] : pct >= 50 ? ['bg-alert', 'text-alert'] : ['bg-ink-dim', 'text-ink-muted'];
  return (
    <div>
      <div className="flex justify-between items-baseline gap-3 mb-2">
        <p className="text-[16px] font-semibold text-ink">{label}</p>
        <p className="num text-[15px] text-ink-muted">
          {current} de {target} {unit} · <span className={`font-bold ${cor[1]}`}>{pct}%</span>
        </p>
      </div>
      <div
        className="h-2 rounded-full overflow-hidden bg-surface-2"
        role="progressbar"
        aria-label={label}
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`h-full rounded-full origin-left transition-transform duration-500 ease-[var(--ease-out-quint)] ${cor[0]}`}
          style={{ transform: `scaleX(${pct / 100})` }}
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

  if (loading) return <PageLoader />;

  const streak  = calcularStreak(historico);
  const thisMes = treinosNoMes(historico);
  const metaMes = (aluno?.frequencia_semanal_plano ?? 0) * 4;

  const numeros = [
    ['Saldo de aulas', aluno?.saldo_aulas ?? '—'],
    ['Treinos no mês', thisMes],
    ['Dias seguidos', streak],
    ['Treinos por semana', aluno?.frequencia_semanal_plano ?? '—'],
  ];

  return (
    <div className="min-h-screen bg-bg px-5 pt-5 pb-6 max-w-lg mx-auto flex flex-col gap-7">

      <header className="flex items-center gap-4">
        <span
          className="w-16 h-16 shrink-0 rounded-full bg-surface-2 border border-line text-ink text-[22px] font-bold flex items-center justify-center"
          aria-hidden="true"
        >
          {iniciais(aluno?.nome)}
        </span>
        <div className="min-w-0">
          <h1 className="text-[26px] leading-tight font-black tracking-[-0.02em] text-ink">
            {aluno?.nome ?? 'Atleta'}
          </h1>
          {aluno?.objetivo && <p className="text-[15px] text-ink-muted mt-0.5 truncate">{aluno.objetivo}</p>}
        </div>
      </header>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-5 py-5 border-y border-line">
        {numeros.map(([rotulo, valor]) => (
          <div key={rotulo}>
            <dt className="text-[14px] text-ink-muted">{rotulo}</dt>
            <dd className="num text-[28px] leading-tight font-black text-ink">{valor}</dd>
          </div>
        ))}
      </dl>

      {metaMes > 0 && (
        <section aria-labelledby="metas" className="flex flex-col gap-5">
          <h2 id="metas" className="text-[18px] font-bold text-ink">Metas do mês</h2>
          <MetaBar label="Treinos no mês" current={thisMes} target={metaMes} unit="treinos" />
          {aluno?.saldo_aulas !== undefined && aluno.saldo_aulas > 0 && (
            <MetaBar
              label="Saldo de aulas"
              current={aluno.saldo_aulas}
              target={Math.max(aluno.saldo_aulas + thisMes, 1)}
              unit="aulas"
            />
          )}
        </section>
      )}

      {planoAtivo && (
        <section aria-labelledby="plano-atual">
          <h2 id="plano-atual" className="text-[18px] font-bold text-ink mb-3">Plano atual</h2>
          <div className="rounded-2xl bg-surface border border-line p-5">
            <p className="text-[20px] leading-snug font-bold text-ink">{planoAtivo.titulo}</p>
            {planoAtivo.objetivo_estrategico && (
              <p className="mt-1 text-[15px] text-ink-muted">{planoAtivo.objetivo_estrategico}</p>
            )}
            <p className="num mt-3 pt-3 border-t border-line text-[15px] text-ink-muted">
              {planoAtivo.treinos?.length ?? 0} treinos
              {planoAtivo.duracao_semanas ? ` · ${planoAtivo.duracao_semanas} semanas` : ''}
            </p>
          </div>
        </section>
      )}

      <Button
        variant="secondary"
        size="lg"
        width="100%"
        className="min-h-14 text-[17px] font-bold"
        label="Sair da conta"
        onClick={logout}
      />
    </div>
  );
}
