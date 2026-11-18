import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAluno } from '../hooks/useAluno';
import { useToast } from '../hooks/useToast';
import { Button } from '@astryxdesign/core/Button';
import { Toast } from '../components/Toast';
import { PageLoader } from '../components/PageLoader';
import { CheckIcon } from '../components/icons';
import api from '../services/api';
import { getAlunoId } from '../utils/auth';
import { chaveSerie, seriesParaEnvio, valoresIniciais } from '../utils/series';
import { indiceTreinoDaUrl } from '../utils/treino';

/* ─── RestTimer ─────────────────────────────────────── */
// Fica preso acima da navegação: sempre visível e ao alcance do polegar,
// com os segundos grandes o bastante para ler com o celular no chão.
function RestTimer({ seconds, total, onSkip }) {
  const pct    = total > 0 ? seconds / total : 0;
  const urgent = seconds <= 10;

  return (
    <div className="fixed inset-x-0 z-30 px-4 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] animate-[slideUp_0.2s_ease]">
      <div
        role="timer"
        aria-label={`Descanso: ${seconds} segundos`}
        className={`max-w-lg mx-auto overflow-hidden rounded-2xl border shadow-[0_12px_32px_rgb(0_0_0/0.5)] ${
          urgent ? 'bg-alert border-alert text-on-primary' : 'bg-surface-2 border-line text-ink'
        }`}
      >
        <div className="flex items-center gap-4 pl-5 pr-3 py-3">
          <span className={`num text-[40px] leading-none font-black min-w-[2ch] ${urgent ? '' : 'text-alert'}`}>
            {seconds}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-[17px] font-bold text-inherit">Descanso</p>
            <p className={`text-[14px] ${urgent ? 'text-inherit' : 'text-ink-muted'}`}>
              {urgent ? 'Prepare-se!' : 'segundos para a próxima série'}
            </p>
          </div>
          <button
            onClick={onSkip}
            className={`min-h-12 px-5 rounded-xl text-[15px] font-bold text-inherit border ${
              urgent ? 'border-on-primary/40' : 'bg-surface border-line'
            }`}
          >
            Pular
          </button>
        </div>
        <div className={`h-1 ${urgent ? 'bg-on-primary/20' : 'bg-line'}`}>
          <div
            className={`h-full origin-left transition-transform duration-1000 ease-linear ${urgent ? 'bg-on-primary' : 'bg-alert'}`}
            style={{ transform: `scaleX(${pct})` }}
          />
        </div>
      </div>
    </div>
  );
}

/* ─── CompletionModal ────────────────────────────────── */
const CONFETE = ['bg-primary', 'bg-alert', 'bg-ink', 'bg-info'];

// <dialog> nativo: prende o foco, fecha com Esc e cobre a tela sem biblioteca.
function CompletionModal({ onSalvar, salvando, onClose, feitas, totalSets, treinoNome, children }) {
  const ref      = useRef(null);
  const completo = feitas === totalSets;

  useEffect(() => {
    ref.current?.showModal?.();
  }, []);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-labelledby="resumo-titulo"
      className="m-auto w-[calc(100%-2.5rem)] max-w-sm overflow-visible rounded-2xl bg-surface border border-line p-6 text-center text-ink backdrop:bg-black/85 animate-[pop_0.35s_var(--ease-out-quint)]"
    >
      {completo && Array.from({ length: 14 }, (_, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={`absolute -top-2 pointer-events-none ${CONFETE[i % CONFETE.length]} ${i % 3 === 0 ? 'rounded-full' : 'rounded-[2px]'} ${i % 2 === 0 ? 'w-2 h-2' : 'w-1.5 h-1.5'}`}
          style={{
            left: `${6 + (i / 14) * 88}%`,
            animation: `confetti ${0.6 + (i % 3) * 0.2}s ease-out ${i * 0.05}s forwards`,
          }}
        />
      ))}

      <span className="mx-auto flex w-16 h-16 items-center justify-center rounded-full bg-primary text-on-primary">
        <CheckIcon size={32} />
      </span>
      <h2 id="resumo-titulo" className="mt-4 text-[26px] leading-tight font-black tracking-[-0.02em]">
        {completo ? 'Treino concluído!' : 'Finalizar treino?'}
      </h2>
      <p className="mt-1 text-[16px] text-ink-muted">{treinoNome}</p>
      <p className="mt-4 text-[16px]">
        <span className="num text-[32px] font-black text-primary">{feitas}</span>
        <span className="text-ink-muted"> de {totalSets} séries feitas</span>
      </p>

      <div className="mt-6 flex flex-col gap-3">
        <Button
          variant="primary"
          size="lg"
          width="100%"
          className="min-h-14 text-[17px] font-bold"
          label="Salvar treino"
          onClick={onSalvar}
          isLoading={salvando}
        />
        <Button
          variant="secondary"
          size="lg"
          width="100%"
          className="min-h-12 text-[16px]"
          label="Voltar ao treino"
          onClick={() => ref.current?.close()}
        />
      </div>
      {children}
    </dialog>
  );
}

/* ─── VideoExercicio ─────────────────────────────────── */
function getYouTubeId(url) {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return match ? match[1] : null;
}

function VideoExercicio({ url }) {
  const ytId = getYouTubeId(url);

  if (ytId) {
    return (
      <div className="relative aspect-video overflow-hidden rounded-xl">
        <iframe
          src={`https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1`}
          title="Execução do exercício"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0"
        />
      </div>
    );
  }

  return <video src={url} controls playsInline className="w-full max-h-56 rounded-xl bg-black" />;
}

const SET_GROUPS = {
  biset: { label: 'Bi-set', expectedSize: 2 },
  triset: { label: 'Tri-set', expectedSize: 3 },
  circuito: { label: 'Circuito', expectedSize: Infinity },
};

function getSetGroupType(prescricao) {
  const rawType = prescricao.tipo_serie
    ?? prescricao.tipo_set
    ?? prescricao.metodo
    ?? prescricao.tecnica
    ?? prescricao.modalidade
    ?? prescricao.grupo?.tipo
    ?? '';

  const normalized = String(rawType)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[\s_-]/g, '');

  if (normalized.includes('circuit')) return 'circuito';
  if (normalized.includes('triset')) return 'triset';
  if (normalized.includes('biset') || normalized.includes('superset')) return 'biset';
  return null;
}

function getSetGroupId(prescricao) {
  return prescricao.grupo_id
    ?? prescricao.agrupamento_id
    ?? prescricao.circuito_id
    ?? prescricao.superset_id
    ?? prescricao.serie_combinada_id
    ?? prescricao.grupo?.id
    ?? null;
}

// A API pode identificar o grupo por ID ou apenas marcar prescrições consecutivas.
// Esta função mantém ambos os formatos compatíveis e preserva exercícios simples.
function groupPrescricoes(prescricoes = []) {
  const blocks = [];

  prescricoes.forEach((prescricao, index) => {
    const type = getSetGroupType(prescricao);
    if (!type) {
      blocks.push({ type: null, items: [{ prescricao, index }] });
      return;
    }

    const groupId = getSetGroupId(prescricao);
    const previous = blocks.at(-1);
    const canJoin = previous?.type === type
      && (groupId !== null
        ? previous.groupId === groupId
        : previous.groupId === null && previous.items.length < SET_GROUPS[type].expectedSize);

    if (canJoin) {
      previous.items.push({ prescricao, index });
    } else {
      blocks.push({ type, groupId, items: [{ prescricao, index }] });
    }
  });

  return blocks;
}

function SetGroup({ type, children, itemCount }) {
  const { label } = SET_GROUPS[type];
  const sequence = Array.from({ length: itemCount }, (_, index) => String.fromCharCode(65 + index)).join(' → ');

  return (
    <section
      className="rounded-2xl border border-primary/30 bg-primary/5 p-2 flex flex-col gap-2"
      aria-label={`${label} com ${itemCount} exercícios em sequência`}
    >
      <div className="flex items-center justify-between gap-3 px-2 py-1.5">
        <div className="flex items-center gap-3 min-w-0">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-on-primary" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 17 17" fill="none">
              <path d="M3 5.5h7.5M8.5 3.5l2 2-2 2M14 11.5H6.5M8.5 9.5l-2 2 2 2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <div className="min-w-0">
            <h2 className="text-[16px] font-bold text-primary">{label}</h2>
            <p className="text-[14px] text-ink-muted">Faça em sequência, descanse ao final</p>
          </div>
        </div>
        <span className="num shrink-0 text-[14px] font-bold text-ink-muted">{sequence}</span>
      </div>
      {children}
    </section>
  );
}

/* ─── ExercicioAccordion ─────────────────────────────── */
const GRADE_SERIES = 'grid grid-cols-[2.5rem_1fr_1fr_3.5rem] gap-2';
// 48px de altura e número grande: dá para acertar o campo com a mão suada.
const CAMPO_SERIE = 'input-dark num w-full min-w-0 h-12 rounded-xl bg-surface-2 border border-line text-center text-[18px] font-bold outline-none placeholder:text-ink-dim [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none';

export function ExercicioAccordion({ prescricao, numero, groupPosition, doneSets, onToggle, isOpen, onOpen, valores, onValor }) {
  const sets    = useMemo(() => Array.from({ length: prescricao.series || 0 }, (_, i) => i + 1), [prescricao.series]);
  const doneCnt = sets.filter(n => doneSets[chaveSerie(prescricao.id, n)]).length;
  const allDone = doneCnt === sets.length && sets.length > 0;

  const cargaBruta = prescricao.carga_kg || prescricao.carga || '';
  // Carga só com número ganha a unidade; texto livre do personal ("60kg", "leve") fica como veio.
  const cargaPrescrita = /^\d+([.,]\d+)?$/.test(String(cargaBruta)) ? `${cargaBruta} kg` : cargaBruta;

  const descanso = prescricao.tempo_descanso_segundos ?? prescricao.descanso;

  return (
    <div className={`overflow-hidden rounded-2xl border transition-colors ${allDone ? 'bg-primary/5 border-primary/30' : 'bg-surface border-line'}`}>
      <button
        onClick={onOpen}
        className="w-full min-h-16 flex items-center gap-3 px-4 py-3 text-left"
        aria-expanded={isOpen}
      >
        <span
          className={`num w-10 h-10 flex items-center justify-center rounded-xl text-[15px] font-bold shrink-0 ${
            allDone ? 'bg-primary text-on-primary animate-[checkReveal_0.24s_var(--ease-out-quint)]' : 'bg-surface-2 text-ink-muted'
          }`}
        >
          {allDone ? <CheckIcon /> : groupPosition ?? numero}
        </span>
        <span className="flex-1 min-w-0">
          <span className="block text-[17px] leading-snug font-bold text-ink line-clamp-2">
            {prescricao.nome_exercicio ?? `Exercício ${prescricao.exercicio_id}`}
          </span>
          <span className="num block text-[14px] text-ink-muted mt-0.5">
            {prescricao.series}×{prescricao.repeticoes}
            {cargaPrescrita ? ` · ${cargaPrescrita}` : ''}
            {descanso ? ` · ${descanso}s` : ''}
          </span>
        </span>
        <span className={`num text-[15px] font-bold shrink-0 ${allDone ? 'text-primary' : 'text-ink-muted'}`}>
          {doneCnt}/{sets.length}
        </span>
        <svg
          width="16" height="16" viewBox="0 0 14 14" fill="none" aria-hidden="true"
          className={`shrink-0 text-ink-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        >
          <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Expansão animada via grid-template-rows (0fr → 1fr) — sem animar height. */}
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[var(--ease-out-quint)] ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
        inert={!isOpen}
      >
        <div className="overflow-hidden min-h-0">
          <div className="border-t border-line">
            {/* Vídeo de execução — montado só quando aberto (evita carregar iframes ocultos) */}
            {isOpen && prescricao.exercicio?.video_url && (
              <div className="px-4 py-3 border-b border-line">
                <p className="text-[13px] font-semibold text-ink-muted mb-2">Execução</p>
                <VideoExercicio url={prescricao.exercicio.video_url} />
              </div>
            )}

            {/* Cabeçalho das séries */}
            <div className={`${GRADE_SERIES} px-4 pt-3 pb-1 text-[13px] font-semibold text-ink-muted`} aria-hidden="true">
              <span>Série</span>
              <span className="text-center">Reps</span>
              <span className="text-center">Kg</span>
              <span className="text-center">Feito</span>
            </div>

            {/* Linhas de série */}
            {sets.map(n => {
              const key  = chaveSerie(prescricao.id, n);
              const done = !!doneSets[key];
              const campo = `${CAMPO_SERIE} ${done ? 'text-primary' : 'text-ink'}`;
              return (
                <div key={n} className={`${GRADE_SERIES} px-4 py-2 items-center transition-colors ${done ? 'bg-primary/5' : ''}`}>
                  <span className={`num text-[17px] font-bold ${done ? 'text-primary' : 'text-ink-muted'}`}>{n}</span>
                  <input
                    type="number" inputMode="numeric" min="0"
                    aria-label={`Série ${n}, repetições`}
                    placeholder={prescricao.repeticoes || '—'}
                    value={valores?.[key]?.reps ?? ''}
                    onChange={e => onValor(key, 'reps', e.target.value)}
                    className={campo}
                  />
                  <input
                    type="number" inputMode="decimal" min="0" step="0.5"
                    aria-label={`Série ${n}, carga em kg`}
                    placeholder="kg"
                    value={valores?.[key]?.kg ?? ''}
                    onChange={e => onValor(key, 'kg', e.target.value)}
                    className={campo}
                  />
                  <button
                    onClick={() => onToggle(prescricao.id, n, descanso ?? 60)}
                    aria-pressed={done}
                    aria-label={`Série ${n} feita`}
                    className={`w-12 h-12 justify-self-center flex items-center justify-center rounded-xl border-2 transition-colors ${
                      done ? 'bg-primary border-primary text-on-primary' : 'border-ink-dim text-transparent'
                    }`}
                  >
                    <CheckIcon size={20} />
                  </button>
                </div>
              );
            })}

            {/* Observações do personal */}
            {prescricao.observacoes && (
              <div className="px-4 py-3 mt-1 border-t border-line">
                <p className="text-[13px] font-semibold text-ink-muted mb-1">Nota do personal</p>
                <p className="text-[15px] leading-relaxed text-ink">{prescricao.observacoes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Rascunho ───────────────────────────────────────── */
const VALIDADE_RASCUNHO_MS = 24 * 60 * 60 * 1000;
const chaveRascunho = (treinoId) => `ptroster_rascunho_${getAlunoId()}_${treinoId}`;

function lerRascunho(treinoId) {
  try {
    const chave = chaveRascunho(treinoId);
    const rascunho = JSON.parse(localStorage.getItem(chave));
    if (rascunho && Date.now() - rascunho.salvoEm < VALIDADE_RASCUNHO_MS) return rascunho;
    localStorage.removeItem(chave);
    return null;
  } catch {
    return null;
  }
}

function gravarRascunho(treinoId, rascunho) {
  try {
    if (rascunho) localStorage.setItem(chaveRascunho(treinoId), JSON.stringify({ ...rascunho, salvoEm: Date.now() }));
    else localStorage.removeItem(chaveRascunho(treinoId));
  } catch {
    // modo privado ou storage cheio: segue sem rascunho
  }
}

/* ─── Main ───────────────────────────────────────────── */
export default function Treinos() {
  const navigate                                       = useNavigate();
  const [searchParams, setSearchParams]                = useSearchParams();
  const { planoAtivo, loading, error }                 = useAluno();
  const { toast, show }                                = useToast();

  const [selectedIdx, setSelectedIdx] = useState(0);
  const [openPrescId, setOpenPrescId] = useState(null);
  const [doneSets, setDoneSets]       = useState({});
  const [restSecs, setRestSecs]       = useState(null);
  const [restTotal, setRestTotal]     = useState(60);
  const [showModal, setShowModal]     = useState(false);
  const [valores, setValores]         = useState({});
  const [salvando, setSalvando]       = useState(false);
  const camposEditados = useRef({});
  const [treinoRascunhoId, setTreinoRascunhoId] = useState(null);
  const timerRef                      = useRef(null);

  // Card "Hoje" do Dashboard abre o treino sugerido via ?treino=<id>.
  // O índice é derivado da URL; a seleção manual limpa o parâmetro.
  const temTreinoNaUrl = searchParams.has('treino');
  const treinoParam = searchParams.get('treino');
  const indiceDaUrl = indiceTreinoDaUrl(planoAtivo?.treinos, treinoParam);
  const indiceAtivo = indiceDaUrl >= 0 ? indiceDaUrl : selectedIdx;

  const selectedTreino = planoAtivo?.treinos?.[indiceAtivo] ?? null;

  // Parâmetro antigo/inválido não pode deixar a tela presa no treino errado.
  useEffect(() => {
    if (!planoAtivo || !temTreinoNaUrl || indiceDaUrl >= 0) return;
    const proximos = new URLSearchParams(searchParams);
    proximos.delete('treino');
    setSearchParams(proximos, { replace: true });
  }, [planoAtivo, temTreinoNaUrl, indiceDaUrl, searchParams, setSearchParams]);

  const exerciseBlocks = useMemo(
    () => groupPrescricoes(selectedTreino?.prescricoes),
    [selectedTreino],
  );

  const totalSets = useMemo(
    () => selectedTreino?.prescricoes?.reduce((s, p) => s + (p.series || 0), 0) ?? 0,
    [selectedTreino],
  );

  const doneCnt      = Object.values(doneSets).filter(Boolean).length;
  const pct          = totalSets > 0 ? Math.round((doneCnt / totalSets) * 100) : 0;
  const milestoneMsg = pct >= 100 ? null : pct >= 75 ? 'Quase lá!' : pct >= 50 ? 'Metade, ótimo ritmo!' : pct >= 25 ? 'Aquecido!' : null;

  useEffect(() => {
    setOpenPrescId(selectedTreino?.prescricoes?.[0]?.id ?? null);
    setRestSecs(null);
    clearTimeout(timerRef.current);
    if (!selectedTreino) return;

    camposEditados.current = {};
    setTreinoRascunhoId(selectedTreino.id);
    const rascunho = lerRascunho(selectedTreino.id);
    setDoneSets(rascunho?.doneSets ?? {});
    if (rascunho?.valores) {
      setValores(rascunho.valores);
      return;
    }
    setValores(valoresIniciais(selectedTreino.prescricoes, []));
    let ativo = true;
    api.get('/alunos/me/ultima-execucao', { params: { treino_id: selectedTreino.id } })
      .then(({ data }) => {
        if (!ativo) return;
        const iniciais = valoresIniciais(selectedTreino.prescricoes, data);
        for (const [chave, campos] of Object.entries(camposEditados.current)) {
          iniciais[chave] = { ...iniciais[chave], ...campos };
        }
        setValores(iniciais);
      })
      .catch(() => {});  // sem histórico: fica o prescrito
    return () => { ativo = false; };
  }, [selectedTreino?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Guarda edições e marcações apenas no rascunho do treino carregado.
  useEffect(() => {
    if (selectedTreino && treinoRascunhoId === selectedTreino.id &&
        (Object.keys(doneSets).length > 0 || Object.keys(camposEditados.current).length > 0)) {
      gravarRascunho(selectedTreino.id, { doneSets, valores });
    }
  }, [doneSets, valores, treinoRascunhoId, selectedTreino]);

  function mudarValor(chave, campo, valor) {
    camposEditados.current[chave] = { ...camposEditados.current[chave], [campo]: valor };
    setValores(prev => ({ ...prev, [chave]: { ...prev[chave], [campo]: valor } }));
  }

  async function salvarTreino() {
    if (Object.entries(valores).some(([chave, { reps, kg }]) =>
      doneSets[chave] && (Number(reps) < 0 || Number(String(kg).replace(',', '.')) < 0),
    )) {
      show('Repetições e carga devem ser zero ou maiores nas séries marcadas.', 'error');
      return;
    }
    const series = seriesParaEnvio(selectedTreino.prescricoes, valores, chave => doneSets[chave]);
    if (series.length === 0) {
      show('Marque ao menos uma série com repetições.', 'error');
      return;
    }
    setSalvando(true);
    try {
      await api.post('/sessoes/execucao', { treino_id: selectedTreino.id, series });
      gravarRascunho(selectedTreino.id, null);
      setShowModal(false);
      setDoneSets({});
      show('Treino salvo!');
      navigate('/historico');
    } catch (erro) {
      if (erro.response?.status === 422) {
        show('Confira as repetições e a carga das séries marcadas.', 'error');
        return;
      }
      // Rascunho continua salvo; o botão do modal é o "tentar de novo"
      show('Não foi possível salvar. Toque em "Salvar treino" para tentar de novo.', 'error');
    } finally {
      setSalvando(false);
    }
  }

  useEffect(() => {
    if (restSecs === null || restSecs <= 0) {
      if (restSecs === 0) setRestSecs(null);
      return;
    }
    timerRef.current = setTimeout(() => setRestSecs(s => s - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [restSecs]);

  function toggleSet(prescId, setNum, descanso) {
    const key = chaveSerie(prescId, setNum);
    setDoneSets(prev => {
      const nowDone  = !prev[key];
      const next     = { ...prev, [key]: nowDone };
      const newCount = Object.values(next).filter(Boolean).length;

      if (nowDone) {
        clearTimeout(timerRef.current);
        if (newCount === totalSets) {
          setRestSecs(null);
          setTimeout(() => setShowModal(true), 300);
        } else {
          const secs = descanso || 60;
          setRestTotal(secs);
          setRestSecs(secs);
        }
      }
      return next;
    });
  }

  if (loading) return <PageLoader />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg px-6">
        <p role="alert" className="text-danger text-center text-[17px] font-semibold">{error}</p>
      </div>
    );
  }

  if (!planoAtivo || !planoAtivo.treinos?.length) {
    return (
      <div className="min-h-screen bg-bg px-5 pt-5 max-w-lg mx-auto">
        <h1 className="text-[32px] font-black tracking-[-0.02em] text-ink">Meus treinos</h1>
        <p className="mt-3 text-[17px] text-ink-muted">
          Você ainda não tem um plano ativo. Peça ao seu personal trainer para liberar seu treino.
        </p>
      </div>
    );
  }

  const treinos = planoAtivo.treinos;
  const pularDescanso = () => { clearTimeout(timerRef.current); setRestSecs(null); };

  return (
    <div className="min-h-screen bg-bg pb-28 max-w-lg mx-auto">

      {!showModal && <Toast toast={toast} />}

      {showModal && (
        <CompletionModal
          feitas={doneCnt}
          totalSets={totalSets}
          treinoNome={selectedTreino?.nome ?? 'Treino'}
          onSalvar={salvarTreino}
          salvando={salvando}
          onClose={() => setShowModal(false)}
        >
          {/* O <dialog> cobre a página; o aviso de erro precisa estar dentro dele para aparecer. */}
          <Toast toast={toast} />
        </CompletionModal>
      )}

      <header className="px-5 pt-5">
        {treinos.length > 1 && (
          <div className="flex gap-2 overflow-x-auto -mx-5 px-5 pb-4 [scrollbar-width:none]" role="group" aria-label="Escolher treino">
            {treinos.map((t, i) => (
              <button
                key={t.id}
                onClick={() => {
                  setSelectedIdx(i);
                  if (searchParams.has('treino')) {
                    const proximos = new URLSearchParams(searchParams);
                    proximos.delete('treino');
                    setSearchParams(proximos, { replace: true });
                  }
                }}
                aria-pressed={indiceAtivo === i}
                className={`shrink-0 min-h-11 px-4 rounded-full text-[15px] font-semibold border transition-colors ${
                  indiceAtivo === i ? 'bg-primary border-primary text-on-primary' : 'bg-surface border-line text-ink-muted'
                }`}
              >
                {t.nome || `Treino ${String.fromCharCode(65 + i)}`}
              </button>
            ))}
          </div>
        )}

        <h1 className="text-[30px] leading-[1.1] font-black tracking-[-0.02em] text-ink text-balance">
          {selectedTreino?.nome ?? 'Treino'}
        </h1>
        <p className="num mt-1.5 text-[15px] text-ink-muted">
          {selectedTreino?.prescricoes?.length ?? 0} exercícios · {totalSets} séries
        </p>
      </header>

      {/* Progresso: gruda no topo para continuar visível enquanto a lista rola */}
      <div className="sticky top-0 z-20 bg-bg px-5 pt-4 pb-3">
        <div className="flex justify-between items-baseline mb-2">
          <span className="num text-[15px] text-ink-muted">
            {doneCnt} de {totalSets} séries{milestoneMsg ? ` · ${milestoneMsg}` : ''}
          </span>
          <span className={`num text-[17px] font-black ${pct > 0 ? 'text-primary' : 'text-ink-dim'}`}>{pct}%</span>
        </div>
        <div
          className="h-2 rounded-full overflow-hidden bg-surface-2"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progresso do treino"
        >
          <div
            className="h-full rounded-full bg-primary origin-left transition-transform duration-300 ease-[var(--ease-out-quint)]"
            style={{ transform: `scaleX(${pct / 100})` }}
          />
        </div>
      </div>

      {restSecs !== null && <RestTimer seconds={restSecs} total={restTotal} onSkip={pularDescanso} />}

      {/* Lista de exercícios */}
      <div className="px-4 mt-2 flex flex-col gap-3">
        {exerciseBlocks.map((block, blockIndex) => {
          const exercises = block.items.map(({ prescricao: p, index }, groupIndex) => (
            <ExercicioAccordion
              key={p.id}
              prescricao={p}
              numero={index + 1}
              groupPosition={block.type ? String.fromCharCode(65 + groupIndex) : null}
              doneSets={doneSets}
              onToggle={toggleSet}
              isOpen={openPrescId === p.id}
              onOpen={() => setOpenPrescId(openPrescId === p.id ? null : p.id)}
              valores={valores}
              onValor={mudarValor}
            />
          ));

          return block.type ? (
            <SetGroup key={`${block.type}-${block.groupId ?? blockIndex}`} type={block.type} itemCount={block.items.length}>
              {exercises}
            </SetGroup>
          ) : exercises;
        })}

        {pct > 0 && (
          <div className="mt-2">
            <Button
              variant={pct === 100 ? 'primary' : 'secondary'}
              size="lg"
              width="100%"
              className="min-h-14 text-[17px] font-bold"
              label={pct === 100 ? 'Ver resumo do treino' : `Finalizar com ${pct}% concluído`}
              onClick={() => setShowModal(true)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
