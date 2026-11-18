import { useState, useCallback } from 'react';
import api from '../services/api';
import { getAlunoId } from '../utils/auth';
import { dataLocalISO } from '../utils/date';

export function useSessoes() {
  const [sessaoHoje, setSessaoHoje] = useState(null);
  const [loadingSessao, setLoadingSessao] = useState(true);
  const [erroSessao, setErroSessao] = useState(null);
  const [checkingIn, setCheckingIn] = useState(false);

  const [historico, setHistorico] = useState([]);
  const [loadingHistorico, setLoadingHistorico] = useState(true);
  const [erroHistorico, setErroHistorico] = useState(null);

  const buscarSessaoHoje = useCallback(async () => {
    const alunoId = getAlunoId();
    if (!alunoId) {
      setLoadingSessao(false);
      return;
    }
    setLoadingSessao(true);
    setErroSessao(null);
    try {
      const hoje = dataLocalISO();
      const { data } = await api.get('/sessoes/', {
        params: { aluno_id: alunoId, de: hoje, ate: hoje, realizada: true },
      });
      setSessaoHoje(data[0] ?? null);
    } catch {
      setSessaoHoje(null);
      setErroSessao("Não foi possível verificar sua presença de hoje.");
    } finally {
      setLoadingSessao(false);
    }
  }, []);

  const buscarHistorico = useCallback(async () => {
    const alunoId = getAlunoId();
    if (!alunoId) {
      setLoadingHistorico(false);
      return;
    }
    setLoadingHistorico(true);
    setErroHistorico(null);
    try {
      const { data } = await api.get('/sessoes/', {
        params: { aluno_id: alunoId, realizada: true, limit: 30 },
      });
      // Ordenar por data decrescente (mais recentes primeiro)
      const ordenado = [...data].sort((a, b) => new Date(b.data_hora) - new Date(a.data_hora));
      setHistorico(ordenado);
    } catch {
      setHistorico([]);
      setErroHistorico("Não foi possível carregar suas sessões recentes.");
    } finally {
      setLoadingHistorico(false);
    }
  }, []);

  const fazerCheckin = useCallback(async ({ planoTreinoId = null, tipoAtividade = null } = {}) => {
    const alunoId = getAlunoId();
    setCheckingIn(true);
    try {
      const { data } = await api.post('/sessoes/', {
        aluno_id: alunoId,
        plano_treino_id: planoTreinoId,
        tipo_atividade: tipoAtividade,
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
    erroSessao,
    erroHistorico,
    checkingIn, 
    buscarSessaoHoje, 
    buscarHistorico,
    fazerCheckin 
  };
}
