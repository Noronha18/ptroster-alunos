// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ExercicioAccordion } from './Treinos';

const prescricao = {
  id: 42,
  nome_exercicio: 'Supino reto',
  series: 3,
  repeticoes: '10',
  carga: null,
};

function renderExercicio(onSalvarCarga) {
  render(
    <ExercicioAccordion
      prescricao={prescricao}
      numero={1}
      doneSets={{}}
      onToggle={() => {}}
      isOpen
      onOpen={() => {}}
      onSalvarCarga={onSalvarCarga}
      onErroCarga={() => {}}
    />,
  );
}

describe('ExercicioAccordion', () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it('salva a carga após o aluno parar de digitar, mesmo sem desfocar o campo', async () => {
    vi.useFakeTimers();
    const onSalvarCarga = vi.fn().mockResolvedValue(undefined);
    renderExercicio(onSalvarCarga);

    fireEvent.change(screen.getByPlaceholderText('Ex: 60kg'), {
      target: { value: '72kg' },
    });

    expect(onSalvarCarga).not.toHaveBeenCalled();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(700);
    });

    expect(onSalvarCarga).toHaveBeenCalledOnce();
    expect(onSalvarCarga).toHaveBeenCalledWith(42, '72kg');
  });

  it('não duplica o salvamento se o campo desfocar durante uma gravação automática', async () => {
    vi.useFakeTimers();
    const onSalvarCarga = vi.fn(() => new Promise(() => {}));
    renderExercicio(onSalvarCarga);
    const input = screen.getByPlaceholderText('Ex: 60kg');

    fireEvent.change(input, { target: { value: '80kg' } });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(700);
    });
    fireEvent.blur(input);

    expect(onSalvarCarga).toHaveBeenCalledOnce();
  });
});
