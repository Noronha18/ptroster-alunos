import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAluno } from '../hooks/useAluno';
import { useSessoes } from '../hooks/useSessoes';

const primeiroNome = (nome) => nome?.split(' ')[0] ?? 'Atleta';

const formatarData = () => {
  const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  const d = new Date();
  return `${dias[d.getDay()]}, ${d.getDate()} de ${meses[d.getMonth()]}`;
};

function StatCard({ label, value, sub, accent = false }) {
  return (
    <div className="bg-card rounded-2xl p-4 border border-ios-border flex-1">
      <p className="text-[10px] font-black text-ios-text-secondary uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-2xl font-bold ${accent ? 'text-primary' : 'text-white'}`}>{value}</p>
      {sub && <p className="text-[11px] text-ios-text-secondary font-medium mt-0.5">{sub}</p>}
    </div>
  );
}

export default function Dashboard() {
  const { logout } = useAuth();
  const { aluno, planoAtivo, loading } = useAluno();
  const { sessaoHoje, buscarSessaoHoje } = useSessoes();

  useEffect(() => { buscarSessaoHoje(); }, [buscarSessaoHoje]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ios-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-ios-text-secondary text-sm font-bold">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ios-background px-4 pt-14 pb-6">

      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-xs font-bold text-ios-text-secondary uppercase tracking-widest">{formatarData()}</p>
          <h1 className="text-3xl font-black text-white tracking-tight mt-0.5">
            Olá, {primeiroNome(aluno?.nome)}!
          </h1>
        </div>
        <button
          onClick={logout}
          className="p-3 bg-card border border-ios-border rounded-2xl text-ios-text-secondary active:bg-card2 transition-colors"
          aria-label="Sair"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
          </svg>
        </button>
      </div>

      {/* Status do check-in */}
      <div className={`rounded-2xl p-4 mb-5 flex items-center gap-3 ${sessaoHoje ? 'bg-primary/10 border border-primary/20' : 'bg-card border border-ios-border'}`}>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${sessaoHoje ? 'bg-primary' : 'bg-card2'}`}>
          {sessaoHoje ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" className="w-5 h-5">
              <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#888888" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>
        <div className="flex-1">
          <p className={`font-black text-sm ${sessaoHoje ? 'text-primary' : 'text-white'}`}>
            {sessaoHoje ? 'Presença confirmada hoje!' : 'Você ainda não fez check-in hoje'}
          </p>
          <p className="text-xs text-ios-text-secondary font-medium mt-0.5">
            {sessaoHoje
              ? new Date(sessaoHoje.data_hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
              : 'Confirme sua presença na aula'}
          </p>
        </div>
        {!sessaoHoje && (
          <Link to="/checkin" className="shrink-0 bg-primary text-black text-xs font-black px-3 py-2 rounded-xl">
            Ir
          </Link>
        )}
      </div>

      {/* Cards de estatísticas */}
      <div className="flex gap-3 mb-5">
        <StatCard
          label="Aulas no mês"
          value={aluno?.aulas_feitas_mes ?? '—'}
          sub={`meta: ${aluno?.frequencia_semanal_plano ?? '?'}x/semana`}
        />
        <StatCard
          label="Saldo"
          value={aluno?.saldo_aulas ?? '—'}
          sub="aulas restantes"
          accent={(aluno?.saldo_aulas ?? 1) > 0}
        />
      </div>

      {/* Plano ativo */}
      {planoAtivo ? (
        <div className="bg-card rounded-2xl border border-ios-border p-5 mb-5">
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="text-[10px] font-black text-primary uppercase tracking-widest">Plano ativo</span>
              <h2 className="text-lg font-black text-white mt-0.5">{planoAtivo.titulo}</h2>
            </div>
            <span className="bg-primary/10 text-primary text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wide">
              {planoAtivo.treinos?.length ?? 0} treinos
            </span>
          </div>
          {planoAtivo.objetivo_estrategico && (
            <p className="text-sm text-ios-text-secondary">{planoAtivo.objetivo_estrategico}</p>
          )}
          <Link
            to="/treinos"
            className="mt-4 flex items-center justify-between p-3 bg-card2 rounded-xl active:opacity-70 transition-opacity"
          >
            <span className="text-sm font-bold text-white">Ver exercícios</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-ios-text-secondary">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-ios-border p-5 mb-5 text-center">
          <p className="text-ios-text-secondary text-sm font-medium">Nenhum plano ativo. Fale com seu personal trainer.</p>
        </div>
      )}

      {aluno?.objetivo && (
        <div className="bg-card rounded-2xl border border-ios-border p-4">
          <p className="text-[10px] font-black text-ios-text-secondary uppercase tracking-widest mb-1">Seu objetivo</p>
          <p className="text-sm font-medium text-white/80">{aluno.objetivo}</p>
        </div>
      )}
    </div>
  );
}
