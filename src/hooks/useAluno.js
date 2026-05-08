import { useState, useEffect } from 'react';
import api from '../services/api';
import { getAlunoId, getToken, decodeToken } from '../utils/auth';

export function useAluno() {
  const [aluno, setAluno] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const alunoId = getAlunoId();
    if (!alunoId) { setLoading(false); return; }

    api.get('/alunos/me')
      .then(({ data }) => setAluno(data))
      .catch(() =>
        api.get(`/alunos/${alunoId}`)
          .then(({ data }) => setAluno(data))
          .catch(() => {
            const decoded = decodeToken(getToken());
            if (decoded?.nome) {
              setAluno({ nome: decoded.nome, id: alunoId });
            } else {
              setError('Não foi possível carregar seus dados.');
            }
          })
      )
      .finally(() => setLoading(false));
  }, []);

  const planoAtivo = aluno?.planos_treino?.find(p => p.esta_ativo) ?? null;

  return { aluno, planoAtivo, loading, error };
}
