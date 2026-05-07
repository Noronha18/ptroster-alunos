export function ButtonPrimary({ children, onClick, loading, variant = 'primary', className = '' }) {
  const variants = {
    primary: 'bg-ios-blue text-white active:opacity-80',
    success: 'bg-ios-green text-white active:opacity-80',
    outline: 'bg-transparent border border-ios-blue text-ios-blue active:bg-blue-50'
  };

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`
        w-full py-4 px-6 rounded-2xl font-semibold text-lg
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
        ${variants[variant]}
        ${className}
      `}
    >
      {loading ? (
        <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : children}
    </button>
  );
}
