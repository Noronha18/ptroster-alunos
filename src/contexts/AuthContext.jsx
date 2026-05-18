import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../services/api';
import { getToken, setToken, clearAuth, getAlunoId, setAlunoId, decodeToken } from '../utils/auth';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aluno, setAluno] = useState(null);
  const [alunoLoading, setAlunoLoading] = useState(false);
  const [alunoError, setAlunoError] = useState(null);

  const loadAluno = useCallback(async (alunoId) => {
    setAlunoLoading(true);
    try {
      let data;
      try {
        ({ data } = await api.get('/alunos/me'));
      } catch {
        ({ data } = await api.get(`/alunos/${alunoId}`));
      }
      setAluno(data);
      setAlunoError(null);
    } catch {
      const decoded = decodeToken(getToken());
      if (decoded?.nome) {
        setAluno({ nome: decoded.nome, id: alunoId });
        setAlunoError(null);
      } else {
        setAlunoError('Não foi possível carregar seus dados.');
      }
    } finally {
      setAlunoLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = getToken();
    const alunoId = getAlunoId();
    if (token && alunoId) {
      setUser({ authenticated: true, alunoId });
      loadAluno(alunoId);
    }
    setLoading(false);
  }, [loadAluno]);

  const login = async (username, password) => {
    try {
      const { data } = await api.post(
        '/auth/token',
        new URLSearchParams({ username, password }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      const { access_token } = data;
      setToken(access_token);

      const decoded = decodeToken(access_token);
      const alunoId = decoded?.aluno_id;

      if (!alunoId) {
        clearAuth();
        return { success: false, message: 'Usuário não vinculado a um aluno. Contate seu personal trainer.' };
      }

      setAlunoId(alunoId);
      setUser({ authenticated: true, alunoId });
      loadAluno(alunoId);
      return { success: true };
    } catch (error) {
      clearAuth();
      const detail = error.response?.data?.detail;
      return {
        success: false,
        message: typeof detail === 'string' ? detail : 'Usuário ou senha inválidos.',
      };
    }
  };

  const logout = () => {
    clearAuth();
    setUser(null);
    setAluno(null);
    setAlunoError(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, aluno, setAluno, alunoLoading, alunoError }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
