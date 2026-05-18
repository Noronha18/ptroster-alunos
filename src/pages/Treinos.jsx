import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAluno } from '../hooks/useAluno';
import api from '../services/api';

/* ─── RestTimer ─────────────────────────────────────── */
function RestTimer({ seconds, total, onSkip }) {
  const pct    = total > 0 ? seconds / total : 0;
  const R      = 18;
  const circ   = 2 * Math.PI * R;
  const urgent = seconds <= 10;

  return (
    <div
      className="flex items-center gap-3 p-3 rounded-2xl mb-3"
      style={{
        background: urgent ? 'rgba(255,107,53,0.12)' : 'rgba(0,255,127,0.08)',
        border: `1px solid ${urgent ? 'rgba(255,107,53,0.4)' : 'rgba(0,255,127,0.2)'}`,
        animation: urgent ? 'timerPulse 0.8s ease-in-out infinite' : 'slideUp 0.2s ease',
      }}
    >
      <div className="relative w-11 h-11 shrink-0">
        <svg width="44" height="44" viewBox="0 0 44 44">
          <circle cx="22" cy="22" r={R} fill="none" stroke="#222" strokeWidth="3" />
          <circle
            cx="22" cy="22" r={R} fill="none"
            stroke={urgent ? '#FF6B35' : '#00FF7F'}
            strokeWidth="3"
            strokeDasharray={circ}
            strokeDashoffset={circ * (1 - pct)}
            strokeLinecap="round"
            transform="rotate(-90 22 22)"
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <span
          className="absolute inset-0 flex items-center justify-center text-[13px] font-bold"
          style={{ color: urgent ? '#FF6B35' : '#00FF7F' }}
        >
          {seconds}
        </span>
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold text-white">Descanso</p>
        <p className="text-xs text-ios-text-secondary">{urgent ? 'Prepare-se!' : 'Próxima série em breve'}</p>
      </div>
      <button
        onClick={onSkip}
        className="px-3 py-1.5 rounded-lg text-xs font-bold text-ios-text-secondary"
        style={{ background: '#222', border: '1px solid #333' }}
        aria-label="Pular descanso"
      >
        Pular
      </button>
    </div>
  );
}

/* ─── CompletionModal ────────────────────────────────── */
function CompletionModal({ onCheckin, onClose, totalSets, treinoNome }) {
  const COLORS = ['#00FF7F', '#FFD700', '#FF6B35', '#00BFFF', '#FF453A'];

  return (
    <div
      className="absolute inset-0 flex items-center justify-center px-6"
      style={{ background: 'rgba(0,0,0,0.88)', zIndex: 200, animation: 'fadeIn 0.2s ease' }}
    >
      {Array.from({ length: 14 }, (_, i) => (
        <div
          key={i}
          className="absolute pointer-events-none"
          style={{
            left: `${10 + (i / 14) * 80}%`,
            top: `${20 + (i % 3) * 15}%`,
            width: i % 2 === 0 ? 8 : 5,
            height: i % 2 === 0 ? 8 : 5,
            background: COLORS[i % COLORS.length],
            borderRadius: i % 3 === 0 ? '50%' : 2,
            animation: `confetti ${0.6 + (i % 3) * 0.2}s ease-out ${i * 0.05}s forwards`,
          }}
        />
      ))}
      <div
        className="bg-card rounded-3xl p-7 w-full max-w-xs text-center"
        style={{ border: '1px solid rgba(255,255,255,0.1)', animation: 'pop 0.35s cubic-bezier(0.16,1,0.3,1)' }}
      >
        <div className="text-5xl mb-3">🎉</div>
        <h2 className="text-2xl font-black text-white mb-1">Treino Concluído!</h2>
        <p className="text-sm text-ios-text-secondary mb-5">Excelente performance!</p>
        <div className="grid grid-cols-2 gap-2 mb-5">
          <div className="bg-card2 rounded-2xl p-3">
            <p className="text-lg font-black text-primary">{totalSets}</p>
            <p className="text-[11px] text-ios-text-secondary mt-0.5">Séries</p>
          </div>
          <div className="bg-card2 rounded-2xl p-3">
            <p className="text-sm font-black text-primary truncate">{treinoNome}</p>
            <p className="text-[11px] text-ios-text-secondary mt-0.5">Treino</p>
          </div>
        </div>
        <button
          onClick={onCheckin}
          className="w-full py-3.5 bg-primary text-black font-black rounded-2xl text-sm mb-2"
        >
          Fazer Check-in ✓
        </button>
        <button
          onClick={onClose}
          className="w-full py-2.5 font-bold text-sm rounded-2xl"
          style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: '#888' }}
        >
          Fechar
        </button>
      </div>
    </div>
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
      <div style={{ position: 'relative', paddingBottom: '56.25%', borderRadius: 10, overflow: 'hidden' }}>
        <iframe
          src={`https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1`}
          title="Execução do exercício"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
        />
      </div>
    );
  }

  return (
    <video
      src={url}
      controls
      playsInline
      style={{ width: '100%', borderRadius: 10, maxHeight: 220, background: '#000' }}
    />
  );
}

/* ─── ExercicioAccordion ─────────────────────────────── */
function ExercicioAccordion({ prescricao, numero, doneSets, onToggle, isOpen, onOpen, onCargaUpdate }) {
  const sets    = useMemo(() => Array.from({ length: prescricao.series || 0 }, (_, i) => i + 1), [prescricao.series]);
  const doneCnt = sets.filter(n => doneSets[`p${prescricao.id}_s${n}`]).length;
  const allDone = doneCnt === sets.length && sets.length > 0;

  const cargaInicial = prescricao.carga_kg || prescricao.carga || '';
  const [cargaInput, setCargaInput] = useState(cargaInicial);
  const [salvando, setSalvando]     = useState(false);
  const [salvo, setSalvo]           = useState(false);
  const cargaSalvaRef               = useRef(cargaInicial);

  async function handleSalvarCarga() {
    if (cargaInput === cargaSalvaRef.current) return;
    setSalvando(true);
    try {
      await api.patch(`/prescricoes/${prescricao.id}/carga`, { carga: cargaInput || null });
      cargaSalvaRef.current = cargaInput;
      onCargaUpdate(prescricao.id, cargaInput);
      setSalvo(true);
      setTimeout(() => setSalvo(false), 2000);
    } catch {
      setCargaInput(cargaSalvaRef.current);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="mb-2">
      <button
        onClick={onOpen}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
        style={{
          background: allDone ? 'rgba(0,255,127,0.08)' : isOpen ? 'rgba(255,255,255,0.04)' : '#1A1A1A',
          borderRadius: isOpen ? '14px 14px 0 0' : 14,
          border: `1px solid ${allDone ? 'rgba(0,255,127,0.25)' : isOpen ? 'rgba(255,255,255,0.1)' : '#2A2A2A'}`,
          borderBottom: isOpen ? '1px solid rgba(255,255,255,0.05)' : undefined,
          transition: 'background 0.15s',
        }}
        aria-expanded={isOpen}
      >
        <div
          className="w-9 h-9 flex items-center justify-center text-[13px] font-bold shrink-0"
          style={{
            borderRadius: 10,
            background: allDone ? 'rgba(0,255,127,0.1)' : '#222',
            border: `1px solid ${allDone ? 'rgba(0,255,127,0.3)' : '#333'}`,
            color: allDone ? '#00FF7F' : '#888',
            animation: allDone ? 'checkBounce 0.4s ease' : 'none',
          }}
        >
          {allDone ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2.5 7l3 3L11.5 4" stroke="#00FF7F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : numero}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-bold text-white truncate">
            {prescricao.nome_exercicio ?? `Exercício ${prescricao.exercicio_id}`}
          </p>
          <p className="text-xs text-ios-text-secondary mt-0.5">
            {prescricao.series}×{prescricao.repeticoes}
            {cargaInput ? ` · ${cargaInput}` : ''}
            {(prescricao.tempo_descanso_segundos ?? prescricao.descanso)
              ? ` · ${prescricao.tempo_descanso_segundos ?? prescricao.descanso}s`
              : ''}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-bold" style={{ color: allDone ? '#00FF7F' : '#888' }}>
            {doneCnt}/{sets.length}
          </span>
          <svg
            width="14" height="14" viewBox="0 0 14 14" fill="none"
            style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
          >
            <path d="M3 5l4 4 4-4" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </button>

      {isOpen && (
        <div style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.07)', borderTop: 'none', borderRadius: '0 0 14px 14px' }}>
          {/* Vídeo de execução */}
          {prescricao.exercicio?.video_url && (
            <div className="px-4 pt-3 pb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <p className="text-[11px] font-bold uppercase mb-2" style={{ color: '#555', letterSpacing: '0.05em' }}>
                Execução
              </p>
              <VideoExercicio url={prescricao.exercicio.video_url} />
            </div>
          )}
          {/* Input de carga */}
          <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-[11px] font-bold uppercase mb-1.5" style={{ color: '#555', letterSpacing: '0.05em' }}>
              Minha Carga
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={cargaInput}
                onChange={e => setCargaInput(e.target.value)}
                onBlur={handleSalvarCarga}
                onKeyDown={e => e.key === 'Enter' && e.target.blur()}
                placeholder="Ex: 60kg"
                className="flex-1 px-3 py-2 text-sm font-bold rounded-xl"
                style={{
                  background: '#222',
                  border: '1.5px solid #333',
                  color: '#fff',
                  outline: 'none',
                }}
              />
              {salvando && (
                <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#00FF7F', borderTopColor: 'transparent' }} />
              )}
              {salvo && !salvando && (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M3 9l4 4L15 5" stroke="#00FF7F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
          </div>
          {/* Cabeçalho das séries */}
          <div
            className="grid px-4 py-2"
            style={{ gridTemplateColumns: '28px 1fr 1fr 48px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
          >
            {['#', 'Reps', 'Carga', '✓'].map((h, i) => (
              <span
                key={i}
                className="text-[11px] font-bold uppercase"
                style={{ color: '#555', letterSpacing: '0.05em', textAlign: i === 0 ? 'left' : 'center' }}
              >
                {h}
              </span>
            ))}
          </div>
          {/* Linhas de série */}
          {sets.map(n => {
            const key  = `p${prescricao.id}_s${n}`;
            const done = !!doneSets[key];
            return (
              <div
                key={n}
                className="grid px-4 py-3 items-center"
                style={{
                  gridTemplateColumns: '28px 1fr 1fr 48px',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  background: done ? 'rgba(0,255,127,0.04)' : 'transparent',
                  transition: 'background 0.2s',
                }}
              >
                <span className="text-[13px] font-bold" style={{ color: done ? '#00FF7F' : '#888' }}>{n}</span>
                <span className="text-[15px] font-bold text-center" style={{ color: done ? '#00FF7F' : '#fff' }}>
                  {prescricao.repeticoes || '—'}
                </span>
                <span className="text-[13px] font-medium text-center text-ios-text-secondary">
                  {cargaInput || '—'}
                </span>
                <div className="flex justify-center">
                  <button
                    onClick={() => onToggle(prescricao.id, n, prescricao.tempo_descanso_segundos ?? prescricao.descanso ?? 60)}
                    aria-pressed={done}
                    className="w-11 h-11 flex items-center justify-center"
                    style={{
                      borderRadius: 10,
                      background: done ? '#00FF7F' : '#222',
                      border: `1.5px solid ${done ? '#00FF7F' : '#555'}`,
                      transition: 'all 0.15s',
                    }}
                  >
                    {done && (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2.5 7l3 3L11.5 4" stroke="#000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
          {/* Observações do personal */}
          {prescricao.observacoes && (
            <div
              className="px-4 py-3"
              style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
            >
              <p className="text-[11px] font-bold uppercase" style={{ color: '#555', letterSpacing: '0.05em', marginBottom: 4 }}>
                Nota do Personal
              </p>
              <p className="text-[13px]" style={{ color: '#aaa', lineHeight: 1.5 }}>
                {prescricao.observacoes}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Main ───────────────────────────────────────────── */
export default function Treinos() {
  const navigate                       = useNavigate();
  const { planoAtivo, loading, error } = useAluno();

  const [selectedIdx, setSelectedIdx]     = useState(0);
  const [openPrescId, setOpenPrescId]     = useState(null);
  const [doneSets, setDoneSets]           = useState({});
  const [restSecs, setRestSecs]           = useState(null);
  const [restTotal, setRestTotal]         = useState(60);
  const [showModal, setShowModal]         = useState(false);
  const [cargaOverrides, setCargaOverrides] = useState({});
  const timerRef                          = useRef(null);

  function handleCargaUpdate(prescricaoId, novaCarga) {
    setCargaOverrides(prev => ({ ...prev, [prescricaoId]: novaCarga }));
  }

  const selectedTreino = planoAtivo?.treinos?.[selectedIdx] ?? null;

  const totalSets = useMemo(
    () => selectedTreino?.prescricoes?.reduce((s, p) => s + (p.series || 0), 0) ?? 0,
    [selectedTreino],
  );

  const doneCnt      = Object.values(doneSets).filter(Boolean).length;
  const pct          = totalSets > 0 ? Math.round((doneCnt / totalSets) * 100) : 0;
  const milestoneMsg = pct >= 75 ? '💪 Quase lá!' : pct >= 50 ? '⚡ Metade, ótimo ritmo!' : pct >= 25 ? '🔥 Aquecido!' : null;

  useEffect(() => {
    setOpenPrescId(selectedTreino?.prescricoes?.[0]?.id ?? null);
    setDoneSets({});
    setRestSecs(null);
    clearTimeout(timerRef.current);
  }, [selectedIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (restSecs === null || restSecs <= 0) {
      if (restSecs === 0) setRestSecs(null);
      return;
    }
    timerRef.current = setTimeout(() => setRestSecs(s => s - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [restSecs]);

  function toggleSet(prescId, setNum, descanso) {
    const key = `p${prescId}_s${setNum}`;
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ios-background">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ios-background px-6">
        <p className="text-danger text-center font-bold">{error}</p>
      </div>
    );
  }

  if (!planoAtivo || !planoAtivo.treinos?.length) {
    return (
      <div className="min-h-screen bg-ios-background px-4 pt-14 pb-6">
        <h1 className="text-3xl font-black text-white tracking-tight mb-6">Meus Treinos</h1>
        <div className="bg-card rounded-2xl border border-ios-border p-8 text-center">
          <p className="text-ios-text-secondary">Nenhum plano ativo. Fale com seu personal trainer.</p>
        </div>
      </div>
    );
  }

  const treinos = planoAtivo.treinos;

  return (
    <div className="min-h-screen bg-ios-background pb-4 relative" style={{ animation: 'fadeIn 0.25s ease' }}>

      {showModal && (
        <CompletionModal
          totalSets={totalSets}
          treinoNome={selectedTreino?.nome ?? 'Treino'}
          onCheckin={() => { setShowModal(false); navigate('/checkin'); }}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* Header */}
      <div className="px-5 pt-5 pb-0" style={{ background: 'linear-gradient(180deg, rgba(0,255,127,0.05) 0%, transparent 100%)' }}>
        {/* Tabs de treinos */}
        {treinos.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-3" style={{ scrollbarWidth: 'none' }}>
            {treinos.map((t, i) => (
              <button
                key={t.id}
                onClick={() => setSelectedIdx(i)}
                className="shrink-0 px-4 py-1.5 rounded-full text-xs font-bold"
                style={{
                  background: selectedIdx === i ? '#00FF7F' : 'rgba(255,255,255,0.06)',
                  color: selectedIdx === i ? '#000' : '#888',
                  transition: 'all 0.15s',
                }}
              >
                {t.nome || `Treino ${String.fromCharCode(65 + i)}`}
              </button>
            ))}
          </div>
        )}

        <h1 className="text-[26px] font-black text-white mt-1 mb-0.5" style={{ letterSpacing: '-0.02em' }}>
          {selectedTreino?.nome ?? 'Treino'}
        </h1>
        <p className="text-[13px] text-ios-text-secondary mb-3">
          {selectedTreino?.prescricoes?.length ?? 0} exercícios · {totalSets} séries
        </p>

        {/* Progresso */}
        <div className="flex justify-between mb-2">
          <span className="text-[13px] font-medium text-ios-text-secondary">
            {milestoneMsg || `${doneCnt} / ${totalSets} séries`}
          </span>
          <span className="text-sm font-black" style={{ color: pct > 0 ? '#00FF7F' : '#555' }}>
            {pct}%
          </span>
        </div>
        <div
          className="h-2 rounded-full overflow-hidden mb-3"
          style={{ background: '#222' }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progresso do treino"
        >
          <div
            className="h-full rounded-full"
            style={{
              background: '#00FF7F',
              transform: `scaleX(${pct / 100})`,
              transformOrigin: 'left',
              transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1)',
            }}
          />
        </div>

        {restSecs !== null && (
          <RestTimer
            seconds={restSecs}
            total={restTotal}
            onSkip={() => { clearTimeout(timerRef.current); setRestSecs(null); }}
          />
        )}
      </div>

      {/* Lista de exercícios */}
      <div className="px-4 mt-2 pb-4">
        {selectedTreino?.prescricoes?.map((p, idx) => (
          <ExercicioAccordion
            key={p.id}
            prescricao={p}
            numero={idx + 1}
            doneSets={doneSets}
            onToggle={toggleSet}
            isOpen={openPrescId === p.id}
            onOpen={() => setOpenPrescId(openPrescId === p.id ? null : p.id)}
            onCargaUpdate={handleCargaUpdate}
          />
        ))}

        {pct > 0 && (
          <button
            onClick={() => setShowModal(true)}
            className="w-full py-4 mt-2 rounded-2xl text-[15px] font-bold"
            style={{
              background: pct === 100 ? '#00FF7F' : '#1A1A1A',
              border: `1px solid ${pct === 100 ? '#00FF7F' : '#2A2A2A'}`,
              color: pct === 100 ? '#000' : '#888',
              transition: 'all 0.2s',
            }}
          >
            {pct === 100 ? '🎉 Ver Resumo do Treino' : `Finalizar com ${pct}% concluído`}
          </button>
        )}
      </div>
    </div>
  );
}
