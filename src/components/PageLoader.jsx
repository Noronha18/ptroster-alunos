export function PageLoader() {
  return (
    <div role="status" aria-label="Carregando" className="min-h-screen flex items-center justify-center bg-bg">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
