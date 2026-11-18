import { useEffect, useState } from 'react';
import { useAluno } from '../hooks/useAluno';
import { useSessoes } from '../hooks/useSessoes';
import { useToast } from '../hooks/useToast';
import { Button } from '@astryxdesign/core/Button';
import { Toast } from '../components/Toast';
import { ErroCarregamento } from '../components/ErroCarregamento';
import { PageLoader } from '../components/PageLoader';
import { CheckIcon } from '../components/icons';

const ATIVIDADES_LIVRES = ['Corrida', 'Cardio', 'Natação', 'Funcional'];

// Cartão de escolha (plano ou atividade): 64px de altura, estado marcado por cor + ícone.
const opcao = (ativo) =>
  `press w-full min-h-16 rounded-2xl px-4 py-3 flex items-center justify-between gap-3 text-left border transition-colors ${
    ativo ? 'bg-primary/10 border-primary text-ink' : 'bg-surface border-line text-ink'
  }`;

function Marcado() {
  return (
    <span className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0">
      <CheckIcon size={16} />
    </span>
  );
}

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
  const { sessaoHoje, loadingSessao, erroSessao, checkingIn, buscarSessaoHoje, fazerCheckin } = useSessoes();
  const { toast, show }                                                           = useToast();

  const planos = aluno?.planos_treino?.filter(p => p.esta_ativo) ?? [];

  const [modo, setModo]                           = useState('plano');
  const [planoEscolhido, setPlanoSelecionado]   = useState(null);
  const [atividadeSelecionada, setAtividadeSelecionada] = useState(null);
  const [outraAtividade, setOutraAtividade]       = useState('');
  const [mostrarOutro, setMostrarOutro]           = useState(false);

  useEffect(() => { buscarSessaoHoje(); }, [buscarSessaoHoje]);

  const planoSelecionado = planos.length === 1
    ? planos[0].id
    : planos.find(plano => plano.id === planoEscolhido)?.id ?? null;

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
      show('Presença confirmada! Bom treino!', 'success');
    } else {
      show(resultado.message, 'error');
    }
  };

  if (loading || loadingSessao) return <PageLoader />;

  if (erroSessao) return (
    <div className="mx-auto max-w-lg space-y-4 px-5 pt-5">
      <h1 className="text-[32px] font-black text-ink">Presença</h1>
      <ErroCarregamento mensagem={erroSessao} tentarNovamente={buscarSessaoHoje} />
    </div>
  );

  if (sessaoHoje) {
    const nomeAtividade = labelSessao(sessaoHoje, aluno?.planos_treino);
    return (
      <div className="min-h-[calc(100dvh-5rem)] bg-bg flex flex-col justify-center px-5 py-8 max-w-lg mx-auto">
        <div className="animate-[pop_0.4s_var(--ease-out-quint)]">
          <span className="w-20 h-20 rounded-full bg-primary text-on-primary flex items-center justify-center">
            <CheckIcon size={40} />
          </span>
          <h1 className="mt-6 text-[32px] leading-[1.1] font-black tracking-[-0.02em] text-ink">
            Presença confirmada!
          </h1>
          <p className="mt-2 text-[17px] text-ink-muted">
            Presença registrada às <span className="num">{formatarHora(sessaoHoje.data_hora)}</span>. Continue assim!
          </p>

          <dl className="mt-8 rounded-2xl bg-surface border border-line p-5">
            <dt className="text-[14px] text-ink-muted">{formatarDataCompleta()}</dt>
            <dd className="mt-1 text-[20px] font-bold text-ink">{nomeAtividade}</dd>
          </dl>

          <div className="mt-6">
            <Button
              variant="secondary"
              size="lg"
              width="100%"
              className="min-h-14 text-[17px] font-bold"
              label="Ir para os treinos"
              href="/treinos"
            />
          </div>
        </div>
        <Toast toast={toast} />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100dvh-5rem)] bg-bg px-5 pt-5 pb-6 flex flex-col max-w-lg mx-auto">
      <header className="mb-6">
        <h1 className="text-[32px] leading-[1.1] font-black tracking-[-0.02em] text-ink">Presença</h1>
        <p className="mt-2 text-[15px] text-ink-muted">Aqui você registra a presença. Repetições e cargas ficam na tela Treinos.</p>
        <p className="mt-1 text-[15px] text-ink-muted">{formatarDataCompleta()}</p>
      </header>

      {/* Alternar entre plano e atividade livre */}
      <div className="flex rounded-2xl p-1 mb-5 bg-surface border border-line" role="group" aria-label="Tipo de check-in">
        {[
          { key: 'plano', label: 'Plano prescrito' },
          { key: 'livre', label: 'Atividade livre' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setModo(key)}
            aria-pressed={modo === key}
            className={`flex-1 min-h-12 rounded-xl text-[15px] font-bold transition-colors ${
              modo === key ? 'bg-primary text-on-primary' : 'text-ink-muted'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Conteúdo do modo selecionado — key reinicia o fade ao alternar */}
      <div key={modo} className="flex-1 animate-[fadeIn_0.2s_ease]">
        {modo === 'plano' ? (
          planos.length === 0 ? (
            <p className="rounded-2xl p-4 bg-surface border border-line text-[16px] text-ink-muted">
              Você não tem um plano ativo. O check-in será registrado sem plano.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {planos.map(plano => {
                const ativo = planoSelecionado === plano.id;
                return (
                  <button key={plano.id} onClick={() => setPlanoSelecionado(plano.id)} aria-pressed={ativo} className={opcao(ativo)}>
                    <span className="min-w-0">
                      <span className="block text-[17px] font-bold">{plano.titulo}</span>
                      {plano.objetivo_estrategico && (
                        <span className="block text-[14px] text-ink-muted mt-0.5 line-clamp-1">{plano.objetivo_estrategico}</span>
                      )}
                    </span>
                    {ativo && <Marcado />}
                  </button>
                );
              })}
            </div>
          )
        ) : (
          <>
            <h2 className="text-[16px] font-semibold text-ink-muted mb-3">Qual atividade você fez?</h2>
            <div className="grid grid-cols-2 gap-3">
              {ATIVIDADES_LIVRES.map(atividade => {
                const ativo = atividadeSelecionada === atividade && !mostrarOutro;
                return (
                  <button
                    key={atividade}
                    onClick={() => { setAtividadeSelecionada(atividade); setMostrarOutro(false); }}
                    aria-pressed={ativo}
                    className={opcao(ativo)}
                  >
                    <span className="text-[17px] font-bold">{atividade}</span>
                    {ativo && <Marcado />}
                  </button>
                );
              })}
              <button
                onClick={() => { setAtividadeSelecionada('Outro'); setMostrarOutro(true); }}
                aria-pressed={mostrarOutro}
                className={`${opcao(mostrarOutro)} col-span-2`}
              >
                <span className="text-[17px] font-bold">Outra atividade</span>
                {mostrarOutro && <Marcado />}
              </button>
            </div>

            {mostrarOutro && (
              <input
                type="text"
                aria-label="Nome da atividade"
                placeholder="Ex.: muay thai, yoga, caminhada"
                value={outraAtividade}
                onChange={e => setOutraAtividade(e.target.value)}
                maxLength={60}
                className="input-dark mt-3 w-full h-14 rounded-xl px-4 bg-surface border border-line text-ink text-[17px] outline-none placeholder:text-ink-dim"
              />
            )}
          </>
        )}
      </div>

      {/* Ação principal, sempre no fim da tela, ao alcance do polegar */}
      <div className="pt-6">
        <Button
          variant="primary"
          size="lg"
          width="100%"
          className="min-h-14 text-[17px] font-bold"
          label="Confirmar presença"
          onClick={handleCheckin}
          isLoading={checkingIn}
          isDisabled={!podeConcluir}
        />
        <p className="text-center text-[14px] text-ink-muted mt-3">Registra sua presença no treino de hoje.</p>
      </div>

      <Toast toast={toast} />
    </div>
  );
}
