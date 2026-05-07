import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(username, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-ios-background">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-12">
          <div className="w-20 h-20 bg-primary rounded-[2rem] flex items-center justify-center shadow-2xl shadow-green-200 mb-6">
            <span className="text-4xl font-black text-white italic">PT</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">PTROSTER</h1>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.2em] mt-2">Portal do Aluno</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-4 bg-ios-red/10 border border-ios-red/20 text-ios-red rounded-2xl text-sm font-bold text-center animate-shake">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-[11px] font-black text-ios-text-secondary uppercase tracking-widest ml-1">Acesso</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-4 bg-white border border-ios-border rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-medium text-gray-800 placeholder:text-gray-300 shadow-sm"
              placeholder="CPF ou Usuário"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-black text-ios-text-secondary uppercase tracking-widest ml-1">Sua Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-white border border-ios-border rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-medium text-gray-800 placeholder:text-gray-300 shadow-sm"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 mt-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-green-100 active:scale-[0.98] active:opacity-90 transition-all uppercase tracking-widest text-sm"
          >
            Entrar no Treino
          </button>
        </form>

        <p className="mt-12 text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
          Peça suas credenciais para o seu<br />Personal Trainer responsável.
        </p>
      </div>
    </div>
  );
}
