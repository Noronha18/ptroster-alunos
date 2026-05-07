export function Header({ title, subtitle, onLogout }) {
  return (
    <header className="flex justify-between items-start mb-10 pt-4">
      <div className="flex-1">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-tight">{title}</h1>
        <p className="text-ios-text-secondary text-sm font-bold uppercase tracking-widest mt-1">{subtitle}</p>
      </div>
      <button
        onClick={onLogout}
        className="ml-4 p-3 bg-white text-ios-text-secondary hover:text-ios-red active:bg-ios-gray rounded-2xl border border-ios-border shadow-sm transition-all"
        aria-label="Sair"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
        </svg>
      </button>
    </header>
  );
}
