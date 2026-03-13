import { useState } from 'react';
import { projects } from '../data/projects';
import ProjectTile from '../components/ProjectTile';
import ProjectModal from '../components/ProjectModal';
import useResponsive from '../hooks/useResponsive';

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);
  const { isMobile } = useResponsive();

  return (
    <div style={{ paddingTop: 56 }}>
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: isMobile ? '4.5rem 1rem 3.5rem' : '6.5rem 2rem 5rem',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: isMobile ? '2.25rem' : '3rem' }}>
          <div
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: isMobile ? '1.04rem' : '0.92rem',
              letterSpacing: '0.15em',
              color: '#e95f59',
              textTransform: 'uppercase',
              marginBottom: '0.5rem',
            }}
          >
            Portfolio
          </div>
          <h1
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              margin: '0 0 1rem 0',
              background: 'linear-gradient(135deg, #c8c8d4 0%, #f0f0f8 40%, #9090a8 60%, #e0e0ec 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: 1.1,
            }}
          >
            All Projects
          </h1>
          <p
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: isMobile ? '0.92rem' : '1rem',
              color: '#b4b4c6',
              maxWidth: 500,
              lineHeight: 1.8,
              margin: 0,
            }}
          >
            Projects I have worked on for the last few years, including games, web-apps, and scrapers. 
          </p>
        </div>

        {/* Thin rule */}
        <div
          style={{
            borderTop: '1px solid #2a2a2e',
            marginBottom: isMobile ? '1.75rem' : '2.5rem',
          }}
        />

        {/* Project tiles */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: isMobile ? '0.75rem' : '1rem',
          }}
        >
          {projects.map((project, i) => (
            <ProjectTile
              key={project.id}
              project={project}
              index={i}
              onClick={() => setSelectedProject(project)}
            />
          ))}
        </div>

        {/* Footer note */}
        <div
          style={{
            marginTop: isMobile ? '3rem' : '4rem',
            fontFamily: 'Outfit, sans-serif',
            fontSize: isMobile ? '0.72rem' : '0.72rem',
            color: '#3f3f46',
            letterSpacing: '0.1em',
            textAlign: isMobile ? 'center' : 'left',
          }}
        >
          {projects.length} projects · Click any tile to expand
        </div>
      </div>

      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </div>
  );
}
