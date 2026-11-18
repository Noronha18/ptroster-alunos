// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react';
import { beforeEach, expect, it, vi } from 'vitest';
import api from '../services/api';
import { useSemana } from './useSemana';
import { useSessoes } from './useSessoes';

vi.mock('../services/api', () => ({ default: { get: vi.fn() } }));
vi.mock('../utils/auth', () => ({ getAlunoId: () => 42 }));

beforeEach(() => api.get.mockReset());

it('distingue semana indisponível de semana vazia e permite nova tentativa', async () => {
  api.get.mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce({ data: { treinos: [] } });
  const { result } = renderHook(useSemana);
  await act(() => result.current.buscarSemana());
  expect(result.current.erroSemana).toBeTruthy();
  expect(result.current.semana).toBeNull();
  await act(() => result.current.buscarSemana());
  expect(result.current.erroSemana).toBeNull();
  expect(result.current.semana.treinos).toEqual([]);
});

it('separa falha de presença e histórico da ausência confirmada', async () => {
  api.get.mockRejectedValueOnce(new Error('offline'))
    .mockRejectedValueOnce(new Error('offline'))
    .mockResolvedValue({ data: [] });
  const { result } = renderHook(useSessoes);
  await act(() => result.current.buscarSessaoHoje());
  await act(() => result.current.buscarHistorico());
  expect(result.current.erroSessao).toBeTruthy();
  expect(result.current.erroHistorico).toBeTruthy();
  await act(() => result.current.buscarSessaoHoje());
  expect(result.current.erroSessao).toBeNull();
  expect(result.current.erroHistorico).toBeTruthy();
  await act(() => result.current.buscarHistorico());
  expect(result.current.erroHistorico).toBeNull();
  expect(result.current.sessaoHoje).toBeNull();
  expect(result.current.historico).toEqual([]);
});
