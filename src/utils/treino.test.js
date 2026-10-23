import { describe, expect, it } from 'vitest';
import { indiceTreinoDaUrl } from './treino';

const treinos = [{ id: 10 }, { id: 20 }];

describe('indiceTreinoDaUrl', () => {
  it('encontra o treino pelo id da URL', () => {
    expect(indiceTreinoDaUrl(treinos, '20')).toBe(1);
  });

  it('trata parâmetro ausente ou inválido como nenhum treino', () => {
    expect(indiceTreinoDaUrl(treinos, null)).toBe(-1);
    expect(indiceTreinoDaUrl(treinos, 'abc')).toBe(-1);
    expect(indiceTreinoDaUrl(treinos, '0')).toBe(-1);
  });

  it('trata treino antigo que não existe mais como nenhum treino', () => {
    expect(indiceTreinoDaUrl(treinos, '999')).toBe(-1);
  });
});
