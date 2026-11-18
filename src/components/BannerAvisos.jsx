const JANELA = 7;

const emDias = (d) => (d === 0 ? 'hoje' : `em ${d} dia${d === 1 ? '' : 's'}`);

export function BannerAvisos({ aluno }) {
  if (!aluno) return null;
  const avisos = [];
  const venc = aluno.dias_para_vencimento_consultoria;
  const fim = aluno.dias_para_fim_programa;
  if (venc != null && venc <= JANELA) {
    avisos.push(venc < 0 ? 'Sua consultoria venceu. Fale com seu personal.' : `Sua consultoria vence ${emDias(venc)}.`);
  }
  if (fim != null && fim <= JANELA) {
    avisos.push(fim < 0 ? 'Seu programa de treino terminou. Fale com seu treinador.' : `Seu programa termina ${emDias(fim)}.`);
  }
  if (avisos.length === 0) return null;
  return (
    <div role="status" className="rounded-2xl px-4 py-3 bg-alert/15 border border-alert/30 text-ink text-[15px] font-medium space-y-1">
      {avisos.map((t) => <p key={t}>{t}</p>)}
    </div>
  );
}
