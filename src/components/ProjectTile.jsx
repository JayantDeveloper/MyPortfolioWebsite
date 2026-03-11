import { useState } from 'react';
import useResponsive from '../hooks/useResponsive';

export default function ProjectTile({ project, index, onClick }) {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const { isMobile } = useResponsive();

  return (
    <div
      className="project-tile"
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        background: '#12111a',
        border: '1px solid #2a2a2e',
        borderRadius: 4,
        overflow: 'hidden',
        cursor: 'pointer',
        minHeight: isMobile ? 'auto' : 180,
      }}
    >
      {/* Left: blurb */}
      <div
        style={{
          flex: 1,
          padding: isMobile ? '1.25rem' : '2rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderRight: isMobile ? 'none' : '1px solid #2a2a2e',
        }}
      >
        {/* Top */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <span
              style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: isMobile ? '0.68rem' : '0.72rem',
                color: '#9e9eb0',
                letterSpacing: '0.08em',
              }}
            >
              {String(index + 1).padStart(2, '0')}
            </span>
            {project.origin && (
              <span
                style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: isMobile ? '0.68rem' : '0.72rem',
                  color: project.color,
                  opacity: 0.8,
                  letterSpacing: '0.08em',
                }}
              >
                {project.origin}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
            {project.logo && (
              <img 
                src={project.logo} 
                alt={`${project.name} logo`} 
                style={{ width: 26, height: 26, borderRadius: 6, objectFit: 'contain', background: '#fff', padding: 2 }} 
              />
            )}
            <h3
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 700,
                fontSize: isMobile ? '1.2rem' : '1.5rem',
                margin: 0,
                background: 'linear-gradient(135deg, #c8c8d4 0%, #f0f0f8 40%, #9090a8 60%, #e0e0ec 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {project.name}
            </h3>
          </div>

          <p
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: isMobile ? '0.88rem' : '0.98rem',
              color: '#b0b0c2',
              margin: '0 0 1rem 0',
              lineHeight: 1.7,
              maxWidth: isMobile ? '100%' : 420,
            }}
          >
            {project.description}
          </p>
        </div>

        {/* Bottom: tags + arrow */}
        <div
          style={{
            display: 'flex',
            alignItems: isMobile ? 'flex-start' : 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem',
            flexDirection: isMobile ? 'column' : 'row',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {project.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
          <span
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: isMobile ? '0.72rem' : '0.8rem',
              color: '#a8a8d0',
              letterSpacing: '0.1em',
              whiteSpace: 'nowrap',
            }}
          >
            VIEW →
          </span>
        </div>
      </div>

      {/* Right: thumbnail */}
      <div
        style={{
          width: isMobile ? '100%' : '38%',
          flexShrink: 0,
          minHeight: isMobile ? 220 : undefined,
          height: isMobile ? 220 : 'auto',
          background: '#0f0e16',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          order: isMobile ? -1 : 0,
          borderBottom: isMobile ? '1px solid #2a2a2e' : 'none',
        }}
      >
        {/* Color accent strip */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 2,
            background: project.color,
            opacity: 0.5,
          }}
        />

        {!imgError ? (
          <>
            {!imgLoaded && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    border: '1px solid #2a2a2e',
                    borderTopColor: project.color,
                    animation: 'spin 1s linear infinite',
                  }}
                />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            )}
            <img
              src={project.thumbnailImg}
              alt={project.name}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'top',
                opacity: imgLoaded ? 0.85 : 0,
                transition: 'opacity 0.3s ease',
              }}
            />
          </>
        ) : (
          /* Fallback: geometric placeholder */
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '1.5rem',
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                border: `1px solid ${project.color}`,
                borderRadius: 4,
                opacity: 0.4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: '1.2rem', fontFamily: 'Inter', fontWeight: 700, color: project.color, opacity: 0.8 }}>
                {project.name[0]}
              </span>
            </div>
            <span style={{ fontFamily: 'Outfit', fontSize: '0.6rem', color: '#888898', textAlign: 'center' }}>
              {project.thumbnail || 'Preview unavailable'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
