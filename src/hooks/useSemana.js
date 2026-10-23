import { useCallback, useState } from 'react';
import api from '../services/api';

export function useSemana() {
  const [semana, setSemana] = useState(null);
  const [loadingSemana, setLoadingSemana] = useState(true);

  const buscarSemana = useCallback(async () => {
    setLoadingSemana(true);
    try {
      const { data } = await api.get('/alunos/me/semana');
      setSemana(data);
    } catch {
      // Endpoint indisponível não pode derrubar o Dashboard; o plano atual é o fallback.
      setSemana(null);
    } finally {
      setLoadingSemana(false);
    }
  }, []);

  return { semana, loadingSemana, buscarSemana };
}
