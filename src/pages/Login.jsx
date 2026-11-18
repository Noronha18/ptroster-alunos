import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@astryxdesign/core/Button';
import { TextInput } from '@astryxdesign/core/TextInput';
import { useAuth } from '../contexts/AuthContext';
import { DumbbellIcon } from '../components/icons';

// Campos altos (56px) e texto de 17px: digitação com uma mão, em pé, na academia.
const controle = 'min-h-14 [&_input]:text-[17px]';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [shake, setShake]       = useState(false);
  const { login }               = useAuth();
  const navigate                = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('Informe seu usuário e sua senha.');
      return;
    }
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
    <div className="min-h-dvh flex flex-col justify-center gap-10 px-6 py-10 bg-bg max-w-md mx-auto">
      <header>
        <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-primary text-on-primary">
          <DumbbellIcon size={30} />
        </div>
        <h1 className="mt-6 text-[40px] leading-none font-black tracking-[-0.03em] text-ink">PTRoster</h1>
        <p className="mt-2 text-[17px] text-ink-muted">Portal do aluno</p>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {error && (
          <p
            role="alert"
            className={`px-4 py-3 rounded-xl bg-danger/10 border border-danger/30 text-danger text-[15px] font-semibold ${
              shake ? 'animate-[shake_0.4s_ease]' : ''
            }`}
          >
            {error}
          </p>
        )}

        <TextInput
          label="CPF ou usuário"
          value={username}
          onChange={setUsername}
          size="lg"
          width="100%"
          controlClassName={controle}
          autoComplete="username"
          autoCapitalize="none"
          hasAutoCorrect={false}
          hasSpellCheck={false}
          enterKeyHint="next"
          htmlName="username"
        />

        <div>
          <TextInput
            label="Senha"
            type={mostrarSenha ? 'text' : 'password'}
            value={password}
            onChange={setPassword}
            size="lg"
            width="100%"
            controlClassName={controle}
            autoComplete="current-password"
            enterKeyHint="go"
            htmlName="password"
          />
          <button type="button" onClick={() => setMostrarSenha(!mostrarSenha)}
            className="min-h-11 text-sm font-semibold text-primary underline">
            {mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
          </button>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          width="100%"
          className="min-h-14 text-[17px] font-bold mt-1"
          label="Entrar"
          isLoading={loading}
        />
      </form>

      <p className="text-[14px] leading-relaxed text-ink-dim">
        Ainda não tem acesso? Peça seu usuário e senha ao seu personal trainer.
      </p>
    </div>
  );
}
