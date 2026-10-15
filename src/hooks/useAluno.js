import { useAuth } from '../contexts/AuthContext';

export function useAluno() {
  const { aluno, setAluno, alunoLoading: loading, alunoError: error } = useAuth();

  const planoAtivo = aluno?.planos_treino?.find(p => p.esta_ativo) ?? null;

  return { aluno, setAluno, planoAtivo, loading, error };
}
