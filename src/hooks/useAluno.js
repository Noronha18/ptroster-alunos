import { useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

export function useAluno() {
  const { aluno, setAluno, updateAluno, alunoLoading: loading, alunoError: error } = useAuth();

  const planoAtivo = aluno?.planos_treino?.find(p => p.esta_ativo) ?? null;

  // Salva a carga no backend e sincroniza o aluno em memória + cache local.
  const atualizarCarga = useCallback(async (prescricaoId, carga) => {
    const valor = carga || null;
    await api.patch(`/prescricoes/${prescricaoId}/carga`, { carga: valor });
    updateAluno(prev => {
      if (!prev?.planos_treino) return prev;
      return {
        ...prev,
        planos_treino: prev.planos_treino.map(pl => ({
          ...pl,
          treinos: pl.treinos?.map(t => ({
            ...t,
            prescricoes: t.prescricoes?.map(p =>
              p.id === prescricaoId ? { ...p, carga: valor, carga_kg: valor } : p
            ),
          })),
        })),
      };
    });
  }, [updateAluno]);

  return { aluno, setAluno, planoAtivo, loading, error, atualizarCarga };
}
