import { useEffect } from 'react';
import { useSessoes } from '../hooks/useSessoes';

const formatarData = (dataHora) => {
  const d = new Date(dataHora);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
};

const formatarHora = (dataHora) => {
  const d = new Date(dataHora);
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

const getDiaSemana = (dataHora) => {
  const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  return dias[new Date(dataHora).getDay()];
};

export default function Historico() {
  const { historico, loadingHistorico, buscarHistorico } = useSessoes();

  useEffect(() => {
    buscarHistorico();
  }, [buscarHistorico]);

  if (loadingHistorico) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ios-background">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ios-background px-4 pt-14 pb-6">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white tracking-tight">Histórico</h1>
        <p className="text-ios-text-secondary text-sm font-bold uppercase tracking-widest mt-1">
          Suas aulas realizadas
        </p>
      </div>

      {historico.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-card rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-ios-text-secondary">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-ios-text-secondary font-medium">Nenhuma aula registrada ainda.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {historico.map((sessao) => (
            <div key={sessao.id} className="bg-card rounded-2xl border border-ios-border p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex flex-col items-center justify-center text-primary">
                <span className="text-[10px] font-black uppercase leading-none">{getDiaSemana(sessao.data_hora).substring(0, 3)}</span>
                <span className="text-lg font-black">{new Date(sessao.data_hora).getDate()}</span>
              </div>
              
              <div className="flex-1">
                <p className="font-black text-white leading-tight">
                  {sessao.plano_treino?.titulo || 'Aula Presencial'}
                </p>
                <p className="text-xs text-ios-text-secondary font-medium mt-0.5">
                  {formatarData(sessao.data_hora)} às {formatarHora(sessao.data_hora)}
                </p>
              </div>

              <div className="flex flex-col items-end">
                <span className="px-2 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-lg uppercase tracking-wider">
                  Realizada
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
