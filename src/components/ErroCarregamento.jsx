export function ErroCarregamento({ mensagem, tentarNovamente }) {
  return (
    <div className="rounded-xl border border-line bg-surface p-4">
      <p role="alert" className="text-sm text-ink">{mensagem}</p>
      <button type="button" onClick={tentarNovamente} className="mt-1 min-h-11 text-sm font-semibold text-primary underline">
        Tentar novamente
      </button>
    </div>
  );
}
