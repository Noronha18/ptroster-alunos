import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [shake, setShake]       = useState(false);
  const { login }               = useAuth();
  const navigate                = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(username, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-ios-background">
      <div className="w-full max-w-sm">

        {/* Marca */}
        <div className="flex flex-col items-center mb-12">
          <div className="w-20 h-20 bg-primary rounded-[2rem] flex items-center justify-center mb-6">
            <span className="text-4xl font-black text-black italic">PT</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">PTROSTER</h1>
          <p className="text-ios-text-secondary font-bold text-xs uppercase tracking-[0.2em] mt-2">Portal do Aluno</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div
              className="p-4 bg-danger/10 border border-danger/20 text-danger rounded-2xl text-sm font-bold text-center"
              style={{ animation: shake ? 'shake 0.4s ease' : 'none' }}
            >
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-[11px] font-black text-ios-text-secondary uppercase tracking-widest ml-1">
              Acesso
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-4 bg-card border border-ios-border rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-medium text-white placeholder:text-ios-text-secondary"
              placeholder="CPF ou Usuário"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-black text-ios-text-secondary uppercase tracking-widest ml-1">
              Sua Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-card border border-ios-border rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-medium text-white placeholder:text-ios-text-secondary"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 mt-4 bg-primary text-black font-black rounded-2xl active:scale-[0.98] active:opacity-90 transition-all uppercase tracking-widest text-sm"
          >
            Entrar no Treino
          </button>
        </form>

        <p className="mt-12 text-center text-[10px] text-ios-text-secondary font-bold uppercase tracking-widest leading-relaxed">
          Peça suas credenciais para o seu<br />Personal Trainer responsável.
        </p>
      </div>
    </div>
  );
}
