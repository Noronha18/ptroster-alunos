import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { getToken, setToken, clearAuth, getAlunoId, setAlunoId, decodeToken } from '../utils/auth';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    const alunoId = getAlunoId();
    if (token && alunoId) {
      setUser({ authenticated: true, alunoId });
    }
    setLoading(false);
  }, []);

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
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
