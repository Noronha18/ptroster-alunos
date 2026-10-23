import { dataLocalISO } from './date';

const DIAS_CURTOS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const datasDasSessoes = (historico = []) => new Set(
  historico
    .map((sessao) => sessao.data_hora?.split('T')[0])
    .filter(Boolean),
);

export function calcularStreak(historico = [], hoje = new Date()) {
  const datas = datasDasSessoes(historico);
  let streak = 0;
  while (streak < 365) {
    const dia = new Date(hoje);
    dia.setDate(dia.getDate() - streak);
    if (datas.has(dataLocalISO(dia))) streak++;
    else break;
  }
  return streak;
}

export function getUltimos7Dias(historico = [], hoje = new Date()) {
  const datas = datasDasSessoes(historico);
  return Array.from({ length: 7 }, (_, i) => {
    const dia = new Date(hoje);
    dia.setDate(dia.getDate() - (6 - i));
    return {
      label: DIAS_CURTOS[dia.getDay()],
      done: datas.has(dataLocalISO(dia)),
      isToday: i === 6,
    };
  });
}

/**
 * Resolve o card "Hoje" sem depender da ordem em que os requests terminam.
 * Se o aluno já treinou, o treino da sessão tem prioridade sobre a sugestão.
 */
export function resolverCardHoje({
  sessaoHoje,
  treinoSugerido,
  planoAtivo,
  treinosSemana = [],
  carregando = false,
}) {
  const treinoDoPlano = sessaoHoje?.treino_id != null
    ? planoAtivo?.treinos?.find((treino) => treino.id === sessaoHoje.treino_id) ?? null
    : null;
  const treinoDaSemana = sessaoHoje?.treino_id != null
    ? treinosSemana.find((treino) => treino.treino_id === sessaoHoje.treino_id) ?? null
    : null;
  const treinoFeito = treinoDoPlano ?? treinoDaSemana;

  const nomeTreino = treinoFeito?.nome
    ?? treinoFeito?.treino_nome
    ?? treinoSugerido?.treino_nome
    ?? planoAtivo?.titulo
    ?? 'Nenhum plano ativo';

  const subtitulo = carregando
    ? 'Buscando seu treino de hoje...'
    : sessaoHoje
      ? (treinoFeito
        ? `Concluído hoje${planoAtivo?.titulo ? ` · ${planoAtivo.titulo}` : ''}`
        : 'Check-in registrado')
      : treinoSugerido
        ? `Sugerido para hoje${planoAtivo?.titulo ? ` · ${planoAtivo.titulo}` : ''}`
        : planoAtivo?.objetivo_estrategico ?? null;

  const destino = sessaoHoje
    ? `/treinos${treinoDoPlano ? `?treino=${treinoDoPlano.id}` : ''}`
    : treinoSugerido
      ? `/treinos?treino=${treinoSugerido.treino_id}`
      : '/checkin';

  const cta = carregando
    ? 'Carregando...'
    : sessaoHoje
      ? (treinoDoPlano ? 'Ver Treino de Hoje →' : 'Ver Treinos →')
      : treinoSugerido
        ? 'Começar Treino →'
        : 'Fazer Check-in →';

  const badge = carregando
    ? 'Carregando'
    : sessaoHoje
      ? '✓ Presença Confirmada'
      : (treinoSugerido || planoAtivo ? 'Treino de Hoje' : 'Sem Plano');

  return {
    treinoFeito,
    nomeTreino,
    subtitulo,
    destino,
    cta,
    badge,
    desabilitado: carregando,
  };
}
