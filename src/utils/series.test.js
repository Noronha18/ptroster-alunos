import { describe, expect, it } from 'vitest';
import { seriesParaEnvio, valoresIniciais } from './series';

const prescricoes = [{ id: 7, exercicio_id: 3, series: 2, repeticoes: '12-15', carga: '60kg' }];

describe('valoresIniciais', () => {
  it('sem histórico usa o limite inferior das reps e a carga prescrita', () => {
    expect(valoresIniciais(prescricoes, [])).toEqual({
      p7_s1: { reps: '12', kg: '60' },
      p7_s2: { reps: '12', kg: '60' },
    });
  });

  it('com histórico repete a última execução; série a mais copia a última', () => {
    const ultimas = [{ exercicio_id: 3, series: [{ numero_serie: 1, repeticoes: 10, carga_kg: 62.5 }] }];
    expect(valoresIniciais(prescricoes, ultimas).p7_s2).toEqual({ reps: '10', kg: '62.5' });
  });

  it('prescrição sem número fica em branco', () => {
    const p = [{ id: 1, exercicio_id: 1, series: 1, repeticoes: 'até a falha', carga: null }];
    expect(valoresIniciais(p, [])).toEqual({ p1_s1: { reps: '', kg: '' } });
  });
});

describe('seriesParaEnvio', () => {
  it('ignora série sem reps e aceita vírgula decimal', () => {
    const valores = { p7_s1: { reps: '10', kg: '42,5' }, p7_s2: { reps: '', kg: '40' } };
    expect(seriesParaEnvio(prescricoes, valores)).toEqual([
      { exercicio_id: 3, prescricao_id: 7, numero_serie: 1, repeticoes: 10, carga_kg: 42.5 },
    ]);
  });

  it('kg vazio vira peso corporal e o filtro escolhe as séries', () => {
    const valores = { p7_s1: { reps: '8', kg: '' }, p7_s2: { reps: '8', kg: '' } };
    const series = seriesParaEnvio(prescricoes, valores, chave => chave === 'p7_s2');
    expect(series).toHaveLength(1);
    expect(series[0]).toMatchObject({ numero_serie: 2, carga_kg: null });
  });
});
