import { Link, useLocation } from 'react-router-dom';
import useResponsive from '../hooks/useResponsive';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/projects', label: 'Projects' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Nav() {
  const { pathname } = useLocation();
  const { isMobile, isCompact } = useResponsive();

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: 'rgba(10,10,11,0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid #2a2a2e',
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: isMobile ? '0 1rem' : '0 2rem',
          height: isMobile ? 52 : 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
              fontSize: isCompact ? '0.96rem' : '1.08rem',
              letterSpacing: '0.05em',
              background: 'linear-gradient(135deg, #c8c8d4 0%, #f0f0f8 40%, #9090a8 60%, #e0e0ec 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            JM
          </span>
        </Link>

        {/* Links */}
        <div
          style={{
            display: 'flex',
            gap: isCompact ? '0.75rem' : isMobile ? '1rem' : '2rem',
            alignItems: 'center',
          }}
        >
          {navLinks.map(({ to, label }) => {
            const active = pathname === to || (to !== '/' && pathname.startsWith(to));
            return (
              <Link
                key={to}
                to={to}
                style={{
                  textDecoration: 'none',
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: isCompact ? '0.68rem' : isMobile ? '0.8rem' : '0.94rem',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  color: active ? '#e8e8f4' : '#888898',
                  transition: 'color 0.15s ease',
                  paddingBottom: 2,
                  borderBottom: active ? '1px solid #9090b8' : '1px solid transparent',
                  whiteSpace: 'nowrap',
                }}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
