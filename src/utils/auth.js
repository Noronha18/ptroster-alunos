const TOKEN_KEY = 'access_token';
const ALUNO_ID_KEY = 'aluno_id';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);

export const getAlunoId = () => {
  const id = localStorage.getItem(ALUNO_ID_KEY);
  return id ? parseInt(id, 10) : null;
};
export const setAlunoId = (id) => localStorage.setItem(ALUNO_ID_KEY, String(id));

export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ALUNO_ID_KEY);
};

export const decodeToken = (token) => {
  try {
    const payload = token.split('.')[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
};
