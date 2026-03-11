import { useState } from 'react';
import { projects } from '../data/projects';
import ProjectTile from '../components/ProjectTile';
import ProjectModal from '../components/ProjectModal';

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <div style={{ paddingTop: 56 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '5rem 2rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '3rem' }}>
          <div
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: '0.58rem',
              letterSpacing: '0.25em',
              color: '#9090b8',
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
              fontSize: '0.72rem',
              color: '#888898',
              maxWidth: 500,
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            A collection of tools, games, and systems — many started at hackathons,
            all built with the goal of making something real.
          </p>
        </div>

        {/* Thin rule */}
        <div style={{ borderTop: '1px solid #2a2a2e', marginBottom: '2.5rem' }} />

        {/* Project tiles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
            marginTop: '4rem',
            fontFamily: 'Outfit, sans-serif',
            fontSize: '0.6rem',
            color: '#3f3f46',
            letterSpacing: '0.1em',
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
