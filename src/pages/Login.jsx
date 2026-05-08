import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function DumbbellIcon({ color = '#fff', size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2"  y="9"  width="3" height="6" rx="1.5" fill={color}/>
      <rect x="6"  y="7"  width="3" height="10" rx="1.5" fill={color}/>
      <rect x="15" y="7"  width="3" height="10" rx="1.5" fill={color}/>
      <rect x="19" y="9"  width="3" height="6" rx="1.5" fill={color}/>
      <rect x="9"  y="11" width="6" height="2" rx="1" fill={color}/>
    </svg>
  );
}

const inputStyle = {
  width: '100%',
  padding: '16px',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 16,
  fontSize: 16,
  fontWeight: 500,
  color: '#fff',
  outline: 'none',
};

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [shake, setShake]       = useState(false);
  const { login }               = useAuth();
  const navigate                = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(username, password);
    setLoading(false);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-7 bg-ios-background"
      style={{ animation: 'fadeIn 0.3s ease' }}
    >
      {/* Logo */}
      <div className="text-center mb-12">
        <div
          className="w-[72px] h-[72px] flex items-center justify-center mx-auto mb-5"
          style={{ background: '#00FF7F', borderRadius: 22 }}
        >
          <DumbbellIcon color="#000" size={34} />
        </div>
        <h1 className="text-[28px] font-black text-white" style={{ letterSpacing: '-0.02em' }}>
          PTRoster
        </h1>
        <p className="text-[12px] font-bold text-ios-text-secondary mt-1 uppercase" style={{ letterSpacing: '0.12em' }}>
          Portal do Aluno
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        {error && (
          <div
            className="p-3 mb-4 text-[13px] font-bold text-center rounded-2xl"
            style={{
              background: 'rgba(255,69,58,0.1)',
              border: '1px solid rgba(255,69,58,0.25)',
              color: '#FF453A',
              animation: shake ? 'shake 0.4s ease' : 'none',
            }}
          >
            {error}
          </div>
        )}

        <div className="mb-3">
          <label className="block text-[11px] font-bold text-ios-text-secondary uppercase mb-2" style={{ letterSpacing: '0.1em' }}>
            CPF ou Usuário
          </label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Ex.: 123.456.789-00"
            style={inputStyle}
            autoComplete="username"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-[11px] font-bold text-ios-text-secondary uppercase mb-2" style={{ letterSpacing: '0.1em' }}>
            Senha
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            style={inputStyle}
            autoComplete="current-password"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full font-black text-black border-none cursor-pointer"
          style={{
            padding: '18px',
            borderRadius: 16,
            fontSize: 16,
            background: loading ? 'rgba(0,255,127,0.55)' : '#00FF7F',
            animation: !loading ? 'pulse 2.5s ease-in-out infinite' : 'none',
          }}
        >
          {loading ? 'Entrando...' : 'Entrar no Treino →'}
        </button>
      </form>

      <p className="mt-10 text-center text-[11px] font-medium leading-relaxed" style={{ color: '#555' }}>
        Peça suas credenciais ao seu<br />Personal Trainer responsável
      </p>
    </div>
  );
}
