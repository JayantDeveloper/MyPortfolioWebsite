import { useEffect, useState } from 'react';

export default function ProjectModal({ project, onClose }) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!project) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '85vw',
          height: '85vh',
          maxWidth: 1500,
          maxHeight: '85vh',
          background: '#111113',
          border: '1px solid #3f3f46',
          borderRadius: 6,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.2rem 1.75rem',
            borderBottom: '1px solid #2a2a2e',
            background: '#0d0d0f',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {project.logo ? (
              <img 
                src={project.logo} 
                alt={`${project.name} logo`} 
                style={{ width: 22, height: 22, borderRadius: 4, objectFit: 'contain', background: '#fff', padding: 2 }} 
              />
            ) : (
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: project.color }} />
            )}
            <span
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 700,
                fontSize: '1.35rem',
                background: 'linear-gradient(135deg, #c8c8d4 0%, #f0f0f8 40%, #9090a8 60%, #e0e0ec 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {project.name}
            </span>
            {project.origin && (
              <span
                style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '0.68rem',
                  color: '#888898',
                  letterSpacing: '0.1em',
                  background: 'rgba(144,144,184,0.08)',
                  border: '1px solid #2a2a2e',
                  padding: '4px 10px',
                  borderRadius: 2,
                }}
              >
                {project.origin}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: '1px solid #2a2a2e',
              color: '#888898',
              cursor: 'pointer',
              padding: '7px 14px',
              fontFamily: 'Outfit, sans-serif',
              fontSize: '0.8rem',
              borderRadius: 2,
              transition: 'border-color 0.15s, color 0.15s',
            }}
            onMouseEnter={e => { e.target.style.borderColor = '#3f3f46'; e.target.style.color = '#e8e8f4'; }}
            onMouseLeave={e => { e.target.style.borderColor = '#2a2a2e'; e.target.style.color = '#888898'; }}
          >
            ESC
          </button>
        </div>

        {/* Body: scrollable */}
        <div
          style={{
            display: 'flex',
            flex: 1,
            overflow: 'hidden',
          }}
        >
          {/* Left content */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '2.25rem 2.5rem',
              borderRight: '1px solid #2a2a2e',
            }}
          >
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '1.22rem',
                color: '#dddde8',
                fontWeight: 500,
                margin: '0 0 1.5rem 0',
                lineHeight: 1.6,
              }}
            >
              {project.tagline}
            </p>

            <div
              style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: '0.84rem',
                color: '#888898',
                lineHeight: 1.95,
                whiteSpace: 'pre-line',
              }}
            >
              {project.longDescription}
            </div>

            {/* Tech tags */}
            <div style={{ marginTop: '1.75rem' }}>
              <div
                style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '0.66rem',
                  letterSpacing: '0.2em',
                  color: '#9090b8',
                  textTransform: 'uppercase',
                  marginBottom: '0.75rem',
                }}
              >
                Tech Stack
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {project.tags.map((tag) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </div>

            {/* Links */}
            {project.links?.length > 0 && (
              <div style={{ marginTop: '1.75rem' }}>
                <div
                  style={{
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: '0.66rem',
                    letterSpacing: '0.2em',
                    color: '#9090b8',
                    textTransform: 'uppercase',
                    marginBottom: '0.75rem',
                  }}
                >
                  Links
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                  {project.links.map(({ label, url }) => (
                    <a
                      key={label}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontFamily: 'Outfit, sans-serif',
                        fontSize: '0.78rem',
                        color: project.color,
                        textDecoration: 'none',
                        border: `1px solid ${project.color}44`,
                        padding: '8px 14px',
                        borderRadius: 2,
                        background: `${project.color}0d`,
                        transition: 'background 0.15s',
                        letterSpacing: '0.05em',
                      }}
                      onMouseEnter={e => e.target.style.background = `${project.color}1a`}
                      onMouseLeave={e => e.target.style.background = `${project.color}0d`}
                    >
                      {label} ↗
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: screenshot */}
          <div
            style={{
              width: '44%',
              flexShrink: 0,
              background: '#0a0a0b',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              padding: '2rem',
              overflowY: 'auto',
            }}
          >
            {!imgError ? (
              <img
                src={project.thumbnailImg}
                alt={project.name}
                onError={() => setImgError(true)}
                style={{
                  width: '100%',
                  borderRadius: 4,
                  border: '1px solid #2a2a2e',
                  display: 'block',
                }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  aspectRatio: '16/9',
                  border: `1px solid ${project.color}33`,
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  background: '#0d0d0f',
                }}
              >
                <span style={{ fontSize: '2rem', fontFamily: 'Inter', fontWeight: 800, color: project.color, opacity: 0.3 }}>
                  {project.name[0]}
                </span>
                <span style={{ fontFamily: 'Outfit', fontSize: '0.6rem', color: '#888898' }}>Preview unavailable</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
