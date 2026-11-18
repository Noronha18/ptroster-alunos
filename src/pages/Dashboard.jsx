import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@astryxdesign/core/Button';
import { useAluno } from '../hooks/useAluno';
import { useSessoes } from '../hooks/useSessoes';
import { useSemana } from '../hooks/useSemana';
import { BannerAvisos } from '../components/BannerAvisos';
import { ErroCarregamento } from '../components/ErroCarregamento';
import { PageLoader } from '../components/PageLoader';
import { CheckIcon, DumbbellIcon, FlameIcon, TargetIcon } from '../components/icons';
import { calcularStreak, getUltimos7Dias, resolverCardHoje } from '../utils/dashboard';

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

export default function Dashboard() {
  const navigate                                                       = useNavigate();
  const { aluno, planoAtivo, loading }                                       = useAluno();
  const { sessaoHoje, historico, loadingSessao, loadingHistorico, erroSessao, erroHistorico, buscarSessaoHoje, buscarHistorico } = useSessoes();
  const { semana, loadingSemana, erroSemana, buscarSemana }                             = useSemana();

  useEffect(() => {
    buscarSessaoHoje();
    buscarHistorico();
    buscarSemana();
  }, [buscarSessaoHoje, buscarHistorico, buscarSemana]);

  if (loading) return <PageLoader />;

  const streak   = calcularStreak(historico);
  const ultimos7 = getUltimos7Dias(historico);
  const recentes = historico.slice(0, 3);
  const totalEx  = planoAtivo?.treinos?.reduce((a, t) => a + (t.prescricoes?.length ?? 0), 0) ?? 0;
  const metaMes  = (aluno?.frequencia_semanal_plano ?? 0) * 4;
  const faltam = aluno?.aulas_feitas_mes == null ? null : metaMes - aluno.aulas_feitas_mes;
  const erroHoje = erroSessao || (!sessaoHoje && erroSemana);
  const tentarHoje = () => {
    if (erroSessao) buscarSessaoHoje();
    if (erroSemana) buscarSemana();
  };
  const mostrarSaldo = aluno?.modalidade === 'presencial' && aluno?.tipo_pagamento === 'pacote';
  const card = resolverCardHoje({
    sessaoHoje,
    treinoSugerido: semana?.treino_sugerido_hoje ?? null,
    planoAtivo,
    treinosSemana: semana?.treinos ?? [],
    carregando: loadingSessao || (!sessaoHoje && loadingSemana),
  });

  const diasFeitos = ultimos7.filter(d => d.done).length;

  return (
    <div className="min-h-screen bg-bg px-5 pt-5 pb-6 max-w-lg mx-auto flex flex-col gap-7">

      {/* Cabeçalho */}
      <header className="flex justify-between items-center gap-4">
        <div className="min-w-0">
          <p className="text-[14px] text-ink-muted">{formatarDataCurta()}</p>
          <h1 className="text-[32px] leading-[1.1] font-black tracking-[-0.02em] text-ink truncate">
            Olá, {primeiroNome(aluno?.nome)}
          </h1>
        </div>
        <button
          onClick={() => navigate('/perfil')}
          className="w-12 h-12 shrink-0 rounded-full bg-surface-2 border border-line text-ink text-[15px] font-bold"
          aria-label="Ver perfil"
        >
          {iniciais(aluno?.nome)}
        </button>
      </header>

      <BannerAvisos aluno={aluno} />

      {/* Treino de hoje: a única ação principal da tela */}
      <section className="rounded-2xl bg-surface border border-line p-5" aria-labelledby="treino-hoje">
        {erroHoje ? (
          <>
            <h2 id="treino-hoje" className="mb-3 text-xl font-bold text-ink">Hoje</h2>
            <ErroCarregamento mensagem={erroHoje} tentarNovamente={tentarHoje} />
            {planoAtivo && <Link to="/treinos" className="mt-2 inline-flex min-h-11 items-center font-semibold text-primary">Ver treinos</Link>}
          </>
        ) : <>
        <p className={`flex items-center gap-1.5 text-[14px] font-semibold ${sessaoHoje ? 'text-primary' : 'text-ink-muted'}`}>
          {sessaoHoje && <CheckIcon />}
          {card.badge}
        </p>
        <h2 id="treino-hoje" className="mt-2 text-[30px] leading-[1.1] font-black tracking-[-0.02em] text-ink text-balance">
          {card.nomeTreino}
        </h2>
        {card.subtitulo && <p className="mt-2 text-[15px] text-ink-muted">{card.subtitulo}</p>}

        <div className="mt-5">
          <Button
            variant="primary"
            size="lg"
            width="100%"
            className="min-h-14 text-[17px] font-bold"
            label={card.cta}
            icon={<DumbbellIcon />}
            href={card.destino}
            isDisabled={card.desabilitado}
          />
        </div>

        </>}

        {planoAtivo && (
          <dl className="mt-5 pt-4 border-t border-line grid grid-cols-3 gap-3">
            {[
              ['Treinos', planoAtivo.treinos?.length ?? 0],
              ['Exercícios', totalEx],
              ...(mostrarSaldo ? [['Saldo de aulas', aluno?.saldo_aulas ?? '—']] : []),
            ].map(([rotulo, valor]) => (
              <div key={rotulo}>
                <dt className="text-[13px] text-ink-muted">{rotulo}</dt>
                <dd className="num text-[22px] font-bold text-ink">{valor}</dd>
              </div>
            ))}
          </dl>
        )}
      </section>

      {erroSemana && erroHoje !== erroSemana && (
        <ErroCarregamento mensagem={erroSemana} tentarNovamente={buscarSemana} />
      )}
      {semana?.treinos?.length > 0 && (
        <section aria-labelledby="semana-progresso">
          <h3 id="semana-progresso" className="text-[18px] font-semibold text-ink-muted mb-2">Esta semana</h3>
          <div className="flex flex-wrap gap-2" role="list" aria-label="Progresso semanal por treino">
            {semana.treinos.map((treino) => {
              const completo = treino.feitas >= treino.vezes_por_semana;
              const label = `${treino.treino_nome}: ${treino.feitas} de ${treino.vezes_por_semana} sessões`;
              return (
                <span
                  key={treino.treino_id}
                  role="listitem"
                  aria-label={label}
                  title={label}
                  className={`flex items-center gap-1.5 max-w-full px-3 py-2 rounded-full text-[14px] font-semibold border ${
                    completo ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-surface border-line text-ink-muted'
                  }`}
                >
                  {completo && <CheckIcon size={14} />}
                  <span className="truncate">{treino.treino_nome}</span>
                  <span className="num shrink-0">{treino.feitas}/{treino.vezes_por_semana}</span>
                </span>
              );
            })}
          </div>
        </section>
      )}

      {erroHistorico ? (
        <ErroCarregamento mensagem={erroHistorico} tentarNovamente={buscarHistorico} />
      ) : loadingHistorico ? (
        <p role="status" className="text-sm text-ink-muted">Carregando frequência…</p>
      ) : (
      <section aria-labelledby="ultimos-7">
        <div className="flex justify-between items-baseline mb-4">
          <h3 id="ultimos-7" className="text-[18px] font-bold text-ink">Últimos 7 dias</h3>
          <p className="flex items-center gap-3 text-[14px] text-ink-muted">
            {streak > 0 && (
              <span className="flex items-center gap-1 text-alert font-semibold">
                <FlameIcon /> {streak} {streak === 1 ? 'dia seguido' : 'dias seguidos'}
              </span>
            )}
            <span className="num">{diasFeitos} de 7</span>
          </p>
        </div>
        <ol className="flex justify-between">
          {ultimos7.map((d, i) => (
            <li
              key={i}
              className="flex flex-col items-center gap-1.5"
              aria-label={`${d.label}: ${d.done ? 'com registro' : 'sem registro no recorte'}${d.isToday ? ' (hoje)' : ''}`}
            >
              <span
                className={`w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-bold ${
                  d.done
                    ? 'bg-primary text-on-primary'
                    : d.isToday
                      ? 'border-2 border-primary text-primary'
                      : 'border-2 border-line text-ink-dim'
                }`}
              >
                {d.done ? <CheckIcon /> : d.label.charAt(0)}
              </span>
              <span className={`text-[12px] font-medium ${d.isToday ? 'text-ink' : 'text-ink-dim'}`}>{d.label}</span>
            </li>
          ))}
        </ol>
        {historico.length >= 30 && <p className="mt-3 text-xs text-ink-muted">Dados das 30 sessões mais recentes.</p>}
      </section>

      )}

      {/* Aviso de meta */}
      {faltam > 0 && faltam <= 3 && metaMes > 0 && (
        <p className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-primary/10 border border-primary/25 text-primary text-[15px] font-semibold">
          <TargetIcon />
          {faltam === 1 ? 'Falta 1 treino' : `Faltam ${faltam} treinos`} para atingir a meta mensal estimada.
        </p>
      )}

      {/* Últimas sessões */}
      {!loadingHistorico && !erroHistorico && recentes.length > 0 && (
        <section aria-labelledby="ultimas-sessoes">
          <div className="flex justify-between items-center">
            <h3 id="ultimas-sessoes" className="text-[18px] font-bold text-ink">Últimas sessões</h3>
            <Link to="/historico" className="press -mr-2 px-2 min-h-11 flex items-center text-[15px] font-semibold text-primary">
              Ver histórico
            </Link>
          </div>
          <ul className="divide-y divide-line border-y border-line">
            {recentes.map(s => {
              const d      = new Date(s.data_hora);
              const semana = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
              const meses  = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
              return (
                <li key={s.id} className="flex justify-between items-center gap-3 py-3.5">
                  <div className="min-w-0">
                    <p className="text-[16px] font-semibold text-ink truncate">
                      {s.tipo_atividade || (s.treino_id ? 'Treino concluído' : 'Presença registrada')}
                    </p>
                    <p className="text-[14px] text-ink-muted mt-0.5">
                      {semana[d.getDay()]} · {d.getDate()} de {meses[d.getMonth()]}
                    </p>
                  </div>
                  <span className="text-primary shrink-0"><CheckIcon /></span>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
