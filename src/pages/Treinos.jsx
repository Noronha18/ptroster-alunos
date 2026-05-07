import { useState } from 'react';
import { useAluno } from '../hooks/useAluno';

function GrupoTag({ grupo }) {
  if (!grupo) return null;
  return (
    <span className="text-[10px] font-bold text-ios-blue bg-blue-50 px-2 py-0.5 rounded-md uppercase tracking-wide">
      {grupo}
    </span>
  );
}

function ExercicioRow({ prescricao, numero }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-ios-border last:border-0">
      <div className="w-8 h-8 bg-ios-gray rounded-xl flex items-center justify-center font-black text-ios-text-secondary text-sm shrink-0 mt-0.5">
        {numero}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-gray-900 leading-tight truncate">
          {prescricao.nome_exercicio || `Exercício ${prescricao.exercicio_id}`}
        </p>
        <div className="flex flex-wrap gap-1.5 mt-1.5">
          <span className="text-xs font-bold text-gray-600 bg-ios-gray px-2 py-0.5 rounded-md">
            {prescricao.series}x{prescricao.repeticoes}
          </span>
          {prescricao.carga && (
            <span className="text-xs font-bold text-gray-600 bg-ios-gray px-2 py-0.5 rounded-md">
              {prescricao.carga}
            </span>
          )}
          <span className="text-xs font-bold text-ios-blue bg-blue-50 px-2 py-0.5 rounded-md">
            {prescricao.descanso}s descanso
          </span>
        </div>
      </div>
    </div>
  );
}

function TreinoCard({ treino, defaultOpen }) {
  const [aberto, setAberto] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-2xl border border-ios-border overflow-hidden mb-3">
      <button
        onClick={() => setAberto(a => !a)}
        className="w-full flex items-center justify-between p-5 active:bg-ios-gray transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <span className="text-sm font-black text-primary">{treino.nome.charAt(0)}</span>
          </div>
          <div className="text-left">
            <p className="font-black text-gray-900">{treino.nome}</p>
            <p className="text-xs text-ios-text-secondary font-medium">
              {treino.prescricoes?.length ?? 0} exercícios
            </p>
          </div>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className={`w-4 h-4 text-ios-text-secondary transition-transform duration-200 ${aberto ? 'rotate-90' : ''}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      {aberto && (
        <div className="px-5 pb-3 border-t border-ios-border">
          {treino.prescricoes?.map((p, idx) => (
            <ExercicioRow key={p.id} prescricao={p} numero={idx + 1} />
          ))}
          {(!treino.prescricoes || treino.prescricoes.length === 0) && (
            <p className="text-ios-text-secondary text-sm py-4 text-center">Nenhum exercício cadastrado.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function Treinos() {
  const { planoAtivo, loading, error } = useAluno();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ios-background">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ios-background px-6">
        <p className="text-ios-red text-center font-bold">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ios-background px-4 pt-14 pb-6">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Meus Treinos</h1>
        {planoAtivo && (
          <p className="text-ios-text-secondary text-sm font-bold uppercase tracking-widest mt-1">
            {planoAtivo.titulo}
          </p>
        )}
      </div>

      {!planoAtivo ? (
        <div className="bg-white rounded-2xl border border-ios-border p-8 text-center">
          <p className="text-ios-text-secondary font-medium">Nenhum plano ativo no momento.</p>
          <p className="text-xs text-ios-text-secondary mt-1">Fale com seu personal trainer.</p>
        </div>
      ) : (
        <>
          {/* Info do plano */}
          <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 mb-5">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black text-primary uppercase tracking-widest">Plano atual</p>
                <p className="font-black text-gray-900 mt-0.5">{planoAtivo.titulo}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-ios-text-secondary uppercase tracking-widest">Duração</p>
                <p className="font-black text-gray-900">{planoAtivo.duracao_semanas} sem.</p>
              </div>
            </div>
            {planoAtivo.objetivo_estrategico && (
              <p className="text-xs text-ios-text-secondary mt-2 border-t border-primary/20 pt-2">
                {planoAtivo.objetivo_estrategico}
              </p>
            )}
          </div>

          {/* Lista de treinos */}
          {planoAtivo.treinos?.length > 0 ? (
            planoAtivo.treinos.map((treino, idx) => (
              <TreinoCard key={treino.id} treino={treino} defaultOpen={idx === 0} />
            ))
          ) : (
            <div className="bg-white rounded-2xl border border-ios-border p-8 text-center">
              <p className="text-ios-text-secondary font-medium">Nenhum treino no plano ainda.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
