import { useCallback, useState } from 'react';
import api from '../services/api';

export function useSemana() {
  const [semana, setSemana] = useState(null);
  const [loadingSemana, setLoadingSemana] = useState(true);

  const [erroSemana, setErroSemana] = useState(null);

  const buscarSemana = useCallback(async () => {
    setLoadingSemana(true);
    setErroSemana(null);
    try {
      const { data } = await api.get('/alunos/me/semana');
      setSemana(data);
    } catch {
      setSemana(null);
      setErroSemana("Não foi possível carregar a programação da semana.");
    } finally {
      setLoadingSemana(false);
    }
  }, []);

  return { semana, loadingSemana, erroSemana, buscarSemana };
}
