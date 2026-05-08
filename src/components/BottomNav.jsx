import { NavLink } from 'react-router-dom';

const HomeIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <rect x="3"  y="3"  width="8" height="8" rx="2.5" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8}/>
    <rect x="13" y="3"  width="8" height="8" rx="2.5" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8}/>
    <rect x="3"  y="13" width="8" height="8" rx="2.5" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8}/>
    <rect x="13" y="13" width="8" height="8" rx="2.5" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8}/>
  </svg>
);

const DumbbellIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <rect x="2"  y="9"  width="3" height="6" rx="1.5" fill="currentColor" opacity={active ? 1 : 0.5}/>
    <rect x="6"  y="7"  width="3" height="10" rx="1.5" fill="currentColor" opacity={active ? 1 : 0.5}/>
    <rect x="15" y="7"  width="3" height="10" rx="1.5" fill="currentColor" opacity={active ? 1 : 0.5}/>
    <rect x="19" y="9"  width="3" height="6" rx="1.5" fill="currentColor" opacity={active ? 1 : 0.5}/>
    <rect x="9"  y="11" width="6" height="2" rx="1" fill="currentColor" opacity={active ? 1 : 0.5}/>
  </svg>
);

const CheckinIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z" fill={active ? 'currentColor' : 'none'} strokeWidth={active ? 0 : 1.8}/>
    <circle cx="12" cy="10" r="3" fill={active ? '#000' : 'none'} stroke={active ? 'none' : 'currentColor'} strokeWidth="1.8"/>
  </svg>
);

const HistoricoIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" strokeWidth={active ? 2.5 : 1.8}/>
  </svg>
);

const PerfilIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeWidth={active ? 2.5 : 1.8}/>
    <circle cx="12" cy="7" r="4" fill={active ? 'currentColor' : 'none'} strokeWidth={active ? 0 : 1.8}/>
  </svg>
);

const navItems = [
  { to: '/',          label: 'Início',    Icon: HomeIcon      },
  { to: '/treinos',   label: 'Treinos',   Icon: DumbbellIcon  },
  { to: '/checkin',   label: 'Check-in',  Icon: CheckinIcon   },
  { to: '/historico', label: 'Histórico', Icon: HistoricoIcon },
  { to: '/perfil',    label: 'Perfil',    Icon: PerfilIcon    },
];

export function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40"
      aria-label="Navegação principal"
      style={{ background: 'rgba(13,13,13,0.97)', backdropFilter: 'blur(24px)', borderTop: '1px solid rgba(255,255,255,0.07)' }}
    >
      <div className="flex items-stretch max-w-lg mx-auto" style={{ height: 64 }}>
        {navItems.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            aria-label={label}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center gap-0.5 relative transition-colors ${
                isActive ? 'text-primary' : 'text-ios-text-secondary'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 rounded-b"
                    style={{ width: 28, height: 2.5, background: '#00FF7F' }}
                  />
                )}
                <Icon active={isActive} />
                <span className="text-[10px] font-bold" style={{ letterSpacing: '0.02em' }}>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
