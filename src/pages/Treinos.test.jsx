// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ExercicioAccordion } from './Treinos';

const prescricao = {
  id: 42,
  nome_exercicio: 'Supino reto',
  series: 2,
  repeticoes: '10',
  carga: '60',
};

function renderExercicio(onValor, valores = {}) {
  render(
    <ExercicioAccordion
      prescricao={prescricao}
      numero={1}
      doneSets={{}}
      onToggle={() => {}}
      isOpen
      onOpen={() => {}}
      valores={valores}
      onValor={onValor}
    />,
  );
}

describe('ExercicioAccordion', () => {
  afterEach(cleanup);

  it('mostra reps e kg de cada série vindos do pré-preenchimento', () => {
    renderExercicio(() => {}, { p42_s1: { reps: '12', kg: '62.5' } });
    expect(screen.getByLabelText('Série 1, repetições')).toHaveProperty('value', '12');
    expect(screen.getByLabelText('Série 1, carga em kg')).toHaveProperty('value', '62.5');
    expect(screen.getByLabelText('Série 2, repetições')).toHaveProperty('value', '');
  });

  it('avisa a mudança de reps e kg pela chave da série', () => {
    const onValor = vi.fn();
    renderExercicio(onValor);

    fireEvent.change(screen.getByLabelText('Série 2, repetições'), { target: { value: '8' } });
    fireEvent.change(screen.getByLabelText('Série 2, carga em kg'), { target: { value: '70' } });

    expect(onValor).toHaveBeenNthCalledWith(1, 'p42_s2', 'reps', '8');
    expect(onValor).toHaveBeenNthCalledWith(2, 'p42_s2', 'kg', '70');
  });
});
