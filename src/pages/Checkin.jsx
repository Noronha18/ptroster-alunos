import { useEffect, useState } from 'react';
import { useAluno } from '../hooks/useAluno';
import { useSessoes } from '../hooks/useSessoes';
import { useToast } from '../hooks/useToast';
import { Toast } from '../components/Toast';

const ATIVIDADES_LIVRES = ['Corrida', 'Cardio', 'Natação', 'Funcional'];

const ICONES_ATIVIDADE = {
  Corrida:   '🏃',
  Cardio:    '🔥',
  Natação:   '🏊',
  Funcional: '⚡',
  Outro:     '🏋️',
};

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

const labelSessao = (sessao, planos) => {
  if (sessao.tipo_atividade) return sessao.tipo_atividade;
  if (sessao.plano_treino_id) {
    const plano = planos?.find(p => p.id === sessao.plano_treino_id);
    if (plano) return plano.titulo;
  }
  return 'Sessão Presencial';
};

export default function Checkin() {
  const { aluno, loading }                                                        = useAluno();
  const { sessaoHoje, loadingSessao, checkingIn, buscarSessaoHoje, fazerCheckin } = useSessoes();
  const { toast, show }                                                           = useToast();

  const planos = aluno?.planos_treino?.filter(p => p.esta_ativo) ?? [];

  const [modo, setModo]                           = useState('plano');
  const [planoSelecionado, setPlanoSelecionado]   = useState(null);
  const [atividadeSelecionada, setAtividadeSelecionada] = useState(null);
  const [outraAtividade, setOutraAtividade]       = useState('');
  const [mostrarOutro, setMostrarOutro]           = useState(false);

  useEffect(() => { buscarSessaoHoje(); }, [buscarSessaoHoje]);

  useEffect(() => {
    if (planos.length === 1) setPlanoSelecionado(planos[0].id);
  }, [aluno]);

  const podeConcluir = modo === 'plano'
    ? (planoSelecionado !== null || planos.length === 0)
    : (atividadeSelecionada !== null && (!mostrarOutro || outraAtividade.trim() !== ''));

  const handleCheckin = async () => {
    let payload;
    if (modo === 'plano') {
      payload = { planoTreinoId: planoSelecionado, tipoAtividade: null };
    } else {
      const label = mostrarOutro ? outraAtividade.trim() : atividadeSelecionada;
      payload = { planoTreinoId: null, tipoAtividade: label };
    }

    const resultado = await fazerCheckin(payload);
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
    const nomeAtividade = labelSessao(sessaoHoje, aluno?.planos_treino);
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
            <p className="text-[16px] font-black text-white">{nomeAtividade}</p>
          </div>
        </div>
        <Toast toast={toast} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ios-background px-5 pt-6 pb-6 flex flex-col" style={{ animation: 'fadeIn 0.25s ease' }}>
      <div className="mb-5">
        <h1 className="text-[28px] font-black text-white mb-1" style={{ letterSpacing: '-0.02em' }}>Check-in</h1>
        <p className="text-[14px] text-ios-text-secondary">{formatarDataCompleta()}</p>
      </div>

      {/* Toggle de modo */}
      <div
        className="flex rounded-2xl p-1 mb-5"
        style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        {[
          { key: 'plano', label: 'Plano Prescrito' },
          { key: 'livre', label: 'Atividade Livre' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setModo(key)}
            className="flex-1 py-2.5 rounded-xl text-[13px] font-bold transition-all"
            style={{
              background: modo === key ? '#00FF7F' : 'transparent',
              color: modo === key ? '#000' : '#888',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Conteúdo do modo selecionado */}
      {modo === 'plano' ? (
        <div className="flex-1">
          {planos.length === 0 ? (
            <div
              className="rounded-2xl p-4 text-center"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <p className="text-ios-text-secondary text-sm">Nenhum plano ativo. O check-in será registrado sem plano.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {planos.map(plano => {
                const ativo = planoSelecionado === plano.id;
                return (
                  <button
                    key={plano.id}
                    onClick={() => setPlanoSelecionado(plano.id)}
                    className="w-full rounded-2xl p-4 text-left transition-all"
                    style={{
                      background: ativo ? 'rgba(0,255,127,0.08)' : '#1A1A1A',
                      border: `1px solid ${ativo ? 'rgba(0,255,127,0.3)' : 'rgba(255,255,255,0.07)'}`,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[15px] font-black text-white">{plano.titulo}</p>
                        {plano.objetivo_estrategico && (
                          <p className="text-xs text-ios-text-secondary mt-0.5 line-clamp-1">{plano.objetivo_estrategico}</p>
                        )}
                      </div>
                      {ativo && (
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 ml-3"
                          style={{ background: '#00FF7F' }}
                        >
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6l3 3 5-5" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1">
          <p className="text-[13px] text-ios-text-secondary mb-3 font-medium">Qual atividade você fez?</p>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {ATIVIDADES_LIVRES.map(atividade => {
              const ativo = atividadeSelecionada === atividade && !mostrarOutro;
              return (
                <button
                  key={atividade}
                  onClick={() => { setAtividadeSelecionada(atividade); setMostrarOutro(false); }}
                  className="rounded-2xl p-4 flex flex-col items-center gap-2 transition-all"
                  style={{
                    background: ativo ? 'rgba(0,255,127,0.08)' : '#1A1A1A',
                    border: `1px solid ${ativo ? 'rgba(0,255,127,0.3)' : 'rgba(255,255,255,0.07)'}`,
                  }}
                >
                  <span className="text-2xl">{ICONES_ATIVIDADE[atividade]}</span>
                  <span className="text-[13px] font-bold" style={{ color: ativo ? '#00FF7F' : '#fff' }}>
                    {atividade}
                  </span>
                </button>
              );
            })}
            <button
              onClick={() => { setAtividadeSelecionada('Outro'); setMostrarOutro(true); }}
              className="rounded-2xl p-4 flex flex-col items-center gap-2 transition-all"
              style={{
                background: mostrarOutro ? 'rgba(0,255,127,0.08)' : '#1A1A1A',
                border: `1px solid ${mostrarOutro ? 'rgba(0,255,127,0.3)' : 'rgba(255,255,255,0.07)'}`,
              }}
            >
              <span className="text-2xl">{ICONES_ATIVIDADE['Outro']}</span>
              <span className="text-[13px] font-bold" style={{ color: mostrarOutro ? '#00FF7F' : '#fff' }}>Outro</span>
            </button>
          </div>

          {mostrarOutro && (
            <input
              type="text"
              placeholder="Ex: Muay Thai, Yoga, Caminhada..."
              value={outraAtividade}
              onChange={e => setOutraAtividade(e.target.value)}
              maxLength={60}
              className="w-full rounded-2xl px-4 py-3.5 text-white text-[14px] font-medium outline-none"
              style={{
                background: '#1A1A1A',
                border: '1px solid rgba(0,255,127,0.3)',
              }}
            />
          )}
        </div>
      )}

      {/* Botão CTA */}
      <div className="pt-5">
        <button
          onClick={handleCheckin}
          disabled={checkingIn || !podeConcluir}
          className="w-full font-black text-black rounded-2xl flex items-center justify-center gap-2"
          style={{
            padding: '18px',
            fontSize: 17,
            background: (checkingIn || !podeConcluir) ? 'rgba(0,255,127,0.4)' : '#00FF7F',
            cursor: (checkingIn || !podeConcluir) ? 'default' : 'pointer',
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
