// Ícones do app: SVG desenhado, herdam a cor do texto (currentColor).
const base = { viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': true };

export function DumbbellIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} {...base}>
      <rect x="2" y="9" width="3" height="6" rx="1.5" fill="currentColor" />
      <rect x="6" y="7" width="3" height="10" rx="1.5" fill="currentColor" />
      <rect x="15" y="7" width="3" height="10" rx="1.5" fill="currentColor" />
      <rect x="19" y="9" width="3" height="6" rx="1.5" fill="currentColor" />
      <rect x="9" y="11" width="6" height="2" rx="1" fill="currentColor" />
    </svg>
  );
}

const stroke = { stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round' };

export function CheckIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} {...base} {...stroke}>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

export function FlameIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} {...base} {...stroke}>
      <path d="M12 3c.5 3.5 4.5 5.5 4.5 10a4.5 4.5 0 0 1-9 0c0-1.6.6-2.8 1.5-3.8.3 1.3 1 2.1 2 2.3C10.500 9 10.500 6 12 3z" />
    </svg>
  );
}

export function TargetIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} {...base} {...stroke}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="0.6" fill="currentColor" />
    </svg>
  );
}
