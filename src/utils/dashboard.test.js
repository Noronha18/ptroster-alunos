import { describe, expect, it } from 'vitest';
import { dataLocalISO } from './date';
import { calcularStreak, getUltimos7Dias, resolverCardHoje } from './dashboard';

const plano = {
  titulo: 'Plano Atual',
  objetivo_estrategico: 'Hipertrofia',
  treinos: [
    { id: 10, nome: 'Treino A' },
    { id: 20, nome: 'Treino B' },
  ],
};

describe('dataLocalISO', () => {
  it('formata usando os componentes locais da data', () => {
    const d = new Date(2026, 9, 22, 23, 30);
    expect(dataLocalISO(d)).toBe('2026-10-22');
  });
});

describe('resolverCardHoje', () => {
  it('enquanto carrega, mantém o CTA desabilitado', () => {
    const card = resolverCardHoje({
      sessaoHoje: null,
      treinoSugerido: null,
      planoAtivo: plano,
      carregando: true,
    });

    expect(card.desabilitado).toBe(true);
    expect(card.cta).toBe('Carregando...');
  });

  it('prioriza o treino realmente feito hoje sobre o treino sugerido', () => {
    const card = resolverCardHoje({
      sessaoHoje: { treino_id: 20 },
      treinoSugerido: { treino_id: 10, treino_nome: 'Treino A' },
      planoAtivo: plano,
      carregando: false,
    });

    expect(card.nomeTreino).toBe('Treino B');
    expect(card.destino).toBe('/treinos?treino=20');
    expect(card.cta).toBe('Ver Treino de Hoje →');
  });

  it('mostra o treino da sessão mesmo quando ele veio de um plano anterior', () => {
    const card = resolverCardHoje({
      sessaoHoje: { treino_id: 99 },
      treinoSugerido: { treino_id: 10, treino_nome: 'Treino A' },
      planoAtivo: plano,
      treinosSemana: [{ treino_id: 99, treino_nome: 'Treino Antigo' }],
      carregando: false,
    });

    expect(card.nomeTreino).toBe('Treino Antigo');
    expect(card.destino).toBe('/treinos');
    expect(card.cta).toBe('Ver Treinos →');
  });

  it('sem treino na sessão, aponta para a lista de treinos', () => {
    const card = resolverCardHoje({
      sessaoHoje: { treino_id: null },
      treinoSugerido: { treino_id: 10, treino_nome: 'Treino A' },
      planoAtivo: plano,
      carregando: false,
    });

    expect(card.destino).toBe('/treinos');
    expect(card.cta).toBe('Ver Treinos →');
  });

  it('sem sessão, usa o treino sugerido', () => {
    const card = resolverCardHoje({
      sessaoHoje: null,
      treinoSugerido: { treino_id: 10, treino_nome: 'Treino A' },
      planoAtivo: plano,
      carregando: false,
    });

    expect(card.destino).toBe('/treinos?treino=10');
    expect(card.cta).toBe('Começar Treino →');
  });

  it('sem sessão nem sugestão, cai no check-in', () => {
    const card = resolverCardHoje({
      sessaoHoje: null,
      treinoSugerido: null,
      planoAtivo: plano,
      carregando: false,
    });

    expect(card.destino).toBe('/checkin');
    expect(card.cta).toBe('Fazer Check-in →');
  });
});

describe('progresso local', () => {
  const base = new Date(2026, 9, 22, 12, 0);
  const historico = [
    { data_hora: '2026-10-22T10:00:00' },
    { data_hora: '2026-10-21T10:00:00' },
    { data_hora: '2026-10-20T10:00:00' },
    { data_hora: '2026-10-18T10:00:00' },
  ];

  it('calcula a sequência a partir do dia local', () => {
    expect(calcularStreak(historico, base)).toBe(3);
  });

  it('marca os últimos sete dias incluindo hoje', () => {
    const dias = getUltimos7Dias(historico, base);
    expect(dias).toHaveLength(7);
    expect(dias.at(-1)).toMatchObject({ done: true, isToday: true });
    expect(dias.at(-3)).toMatchObject({ done: true, isToday: false });
  });
});
