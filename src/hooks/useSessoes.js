import { useState, useCallback } from 'react';
import api from '../services/api';
import { getAlunoId } from '../utils/auth';

export function useSessoes() {
  const [sessaoHoje, setSessaoHoje] = useState(null);
  const [loadingSessao, setLoadingSessao] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);

  const [historico, setHistorico] = useState([]);
  const [loadingHistorico, setLoadingHistorico] = useState(false);

  const buscarSessaoHoje = useCallback(async () => {
    const alunoId = getAlunoId();
    if (!alunoId) return;
    setLoadingSessao(true);
    try {
      const hoje = new Date().toISOString().split('T')[0];
      const { data } = await api.get('/sessoes/', {
        params: { aluno_id: alunoId, de: hoje, ate: hoje, realizada: true },
      });
      setSessaoHoje(data[0] ?? null);
    } catch {
      // sem sessão hoje é ok
    } finally {
      setLoadingSessao(false);
    }
  }, []);

  const buscarHistorico = useCallback(async () => {
    const alunoId = getAlunoId();
    if (!alunoId) return;
    setLoadingHistorico(true);
    try {
      const { data } = await api.get('/sessoes/', {
        params: { aluno_id: alunoId, realizada: true, limit: 100 },
      });
      // Ordenar por data decrescente (mais recentes primeiro)
      const ordenado = [...data].sort((a, b) => new Date(b.data_hora) - new Date(a.data_hora));
      setHistorico(ordenado);
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
    } finally {
      setLoadingHistorico(false);
    }
  }, []);

  const fazerCheckin = useCallback(async (planoTreinoId = null) => {
    const alunoId = getAlunoId();
    setCheckingIn(true);
    try {
      const { data } = await api.post('/sessoes/', {
        aluno_id: alunoId,
        plano_treino_id: planoTreinoId,
        realizada: true,
      });
      setSessaoHoje(data);
      // Atualizar o histórico se ele estiver sendo exibido
      setHistorico(prev => [data, ...prev]);
      return { success: true };
    } catch (error) {
      const detail = error.response?.data?.detail;
      return {
        success: false,
        message: typeof detail === 'string' ? detail : 'Erro ao registrar presença.',
      };
    } finally {
      setCheckingIn(false);
    }
  }, []);

  return { 
    sessaoHoje, 
    historico,
    loadingSessao, 
    loadingHistorico,
    checkingIn, 
    buscarSessaoHoje, 
    buscarHistorico,
    fazerCheckin 
  };
}
