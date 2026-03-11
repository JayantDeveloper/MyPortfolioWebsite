import useResponsive from '../hooks/useResponsive';

const experience = [
  {
    company: 'Booz Allen Hamilton',
    iconUrl: '/experiencelogos/booz_allen_hamilton_logo.jpeg',
    role: 'Machine Learning Engineer (Contract)',
    period: 'Feb 2026 – Present',
    bullets: [
      'Building a vision + OCR pipeline to analyze eligibility-system screen recordings and auto-extract relevant screenshots for case documentation.',
      'Implementing frame sampling, screen classification, and trigger detection to generate structured outputs for Word/PDF export.',
    ],
  },
  {
    company: 'Wise Cities',
    iconUrl: '/experiencelogos/wise_cities_logo.jpeg',
    role: 'Software Engineering Intern',
    period: 'Jan 2025 – Sept 2025',
    bullets: [
      'Built a search pipeline (inverted indexing, edit-distance ranking) powering an AI recommendation system, reducing query latency by ~35%.',
      'Implemented backend services in TypeScript and integrated Typesense to support scalable search over tens of thousands of entities.',
    ],
  },
  {
    company: 'Johns Hopkins Applied Physics Laboratory',
    iconUrl: '/experiencelogos/johns_hopkins_university_applied_physics_laboratory_logo.jpeg',
    role: 'Machine Learning Intern',
    period: 'Jun 2023 – Jan 2024',
    bullets: [
      'Built and tuned LR, Random Forest, XGBoost, and MLP models for credit card fraud detection, improving AUROC to ~0.85–0.90.',
      'Optimized ensemble and neural models to reduce false positives while maintaining high recall on imbalanced data.',
    ],
  },
  {
    company: 'Johns Hopkins Applied Physics Laboratory',
    iconUrl: '/experiencelogos/johns_hopkins_university_applied_physics_laboratory_logo.jpeg',
    role: 'Research Intern (Medical Triage)',
    period: 'Jan 2022 – Jan 2023',
    bullets: [
      'Developed ML models to predict hospital admission from ED triage data (74,749 patients), achieving AUROC of up to 0.81 using XGBoost.',
      'Identified key predictors (ambulance arrival, age, visit reason); presented findings at IEEE 2023.',
    ],
  },
  {
    company: 'Johns Hopkins University',
    iconUrl: '/experiencelogos/johns_hopkins_biomedical_engineering_logo.jpeg',
    role: 'Software Engineering Intern',
    period: 'Jan 2020 – Oct 2020',
    bullets: [
      'Implemented Swift-based camera optimization and image-processing features for an iPhone sickle cell anemia detection app.',
    ],
  },
];

const skills = {
  Languages: ['Python', 'TypeScript', 'JavaScript', 'Java', 'C', 'OCaml', 'Swift', 'R'],
  'Frameworks & Libraries': ['React', 'Next.js', 'Node.js', 'Express', 'PyTorch', 'scikit-learn', 'XGBoost'],
  'Databases & Infra': ['MongoDB', 'Neo4j', 'SQL', 'Typesense', 'Docker', 'Render', 'Vercel', 'Git'],
};

const awards = [
  'US Chess Expert (~2050 rating)',
  'Maryland State Chess Champion (2019, 2020)',
  'Represented Maryland at the Barber Tournament of National Champions',
  'Tied 3rd Place, National K–12 Showdown (~2,800 participants)',
  '2nd Place, MD Sweet 16 Invitational (2023)',
];

export default function About() {
  const { isMobile, isTablet } = useResponsive();

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
        <div style={{ marginBottom: isMobile ? '2.5rem' : '4rem' }}>
          <div
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: isMobile ? '0.74rem' : '0.66rem',
              letterSpacing: '0.15em',
              color: '#a8a8d0',
              textTransform: 'uppercase',
              marginBottom: '0.5rem',
            }}
          >
            Background
          </div>
          <h1
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              margin: '0 0 1.5rem 0',
              background: 'linear-gradient(135deg, #c8c8d4 0%, #f0f0f8 40%, #9090a8 60%, #e0e0ec 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: 1.1,
            }}
          >
            About Me
          </h1>
          <p
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: isMobile ? '0.96rem' : '1rem',
              color: '#bcbdcf',
              maxWidth: 620,
              lineHeight: 1.8,
              margin: 0,
            }}
          >
            I'm a CS student at the University of Maryland (graduating May 2028) with a
            minor in Computational Finance. I've been writing software since middle school — from
            an iPhone app at JHU to ML pipelines at national labs. I like building things that are
            fast, thoughtful, and occasionally weird. Outside of code I'm a chess expert
            and a former Maryland State Champion.
          </p>
        </div>

        <div
          style={{
            borderTop: '1px solid #2a2a2e',
            marginBottom: isMobile ? '2.5rem' : '4rem',
          }}
        />

        {/* Two-column: Experience + Skills */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isTablet ? '1fr' : '1fr 1fr',
            gap: isMobile ? '2.5rem' : '4rem',
          }}
        >

          {/* Experience */}
          <div>
            <div
              style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: isMobile ? '1.04rem' : '0.92rem',
                letterSpacing: '0.15em',
                color: '#b76e79', // Rose gold accent
                textTransform: 'uppercase',
                marginBottom: '2rem',
              }}
            >
              Experience
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {experience.map((job) => (
                <div 
                  key={job.company + job.role}
                  style={{
                    background: 'linear-gradient(145deg, rgba(30, 20, 22, 0.4) 0%, rgba(17, 17, 19, 0) 100%)',
                    border: '1px solid rgba(183, 110, 121, 0.1)',
                    borderRadius: '12px',
                    padding: isMobile ? '1.35rem' : '1.85rem',
                    transition: 'transform 0.2s ease, border-color 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.borderColor = 'rgba(183, 110, 121, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'rgba(183, 110, 121, 0.1)';
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: isMobile ? 'column' : 'row',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '1rem',
                      gap: isMobile ? '0.9rem' : '0.5rem',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        gap: '1rem',
                        alignItems: isMobile ? 'flex-start' : 'center',
                      }}
                    >
                      <div style={{
                        width: isMobile ? 40 : 44,
                        height: isMobile ? 40 : 44,
                        borderRadius: '8px',
                        background: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                        overflow: 'hidden',
                        padding: '4px'
                      }}>
                        <img 
                          src={job.iconUrl} 
                          alt={`${job.company} logo`} 
                          onError={(e) => { e.target.style.display = 'none'; }}
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                        />
                      </div>
                      <div>
                        <div
                          style={{
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 700,
                            fontSize: isMobile ? '1.02rem' : '1.08rem',
                            color: '#f5d0c5', // Warm text color
                          }}
                        >
                          {job.company}
                        </div>
                        <div
                          style={{
                            fontFamily: 'Outfit, sans-serif',
                            fontSize: isMobile ? '0.86rem' : '0.88rem',
                            color: '#b0b0d8',
                            marginTop: 4,
                          }}
                        >
                          {job.role}
                        </div>
                      </div>
                    </div>
                    <span
                      style={{
                        fontFamily: 'Outfit, sans-serif',
                        fontSize: isMobile ? '0.74rem' : '0.74rem',
                        color: '#888898',
                        whiteSpace: 'nowrap',
                        background: 'rgba(255,255,255,0.03)',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        border: '1px solid rgba(255,255,255,0.05)'
                      }}
                    >
                      {job.period}
                    </span>
                  </div>
                  <ul style={{ margin: '0', paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {job.bullets.map((b, i) => (
                      <li
                        key={i}
                        style={{
                          fontFamily: 'Outfit, sans-serif',
                          fontSize: isMobile ? '0.86rem' : '0.9rem',
                          color: '#bcbdcf',
                          lineHeight: 1.7,
                        }}
                      >
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Right column: Skills + Education + Awards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {/* Education */}
            <div>
              <div
                style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: isMobile ? '1.04rem' : '0.92rem',
                  letterSpacing: '0.15em',
                  color: '#b76e79',
                  textTransform: 'uppercase',
                  marginBottom: '1.25rem',
                }}
              >
                Education
              </div>
              <div style={{ 
                background: 'linear-gradient(145deg, rgba(30, 20, 22, 0.4) 0%, rgba(17, 17, 19, 0) 100%)',
                border: '1px solid rgba(183, 110, 121, 0.1)', 
                borderRadius: '12px', 
                padding: isMobile ? '1.35rem' : '1.85rem',
                transition: 'border-color 0.2s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(183, 110, 121, 0.3)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(183, 110, 121, 0.1)'; }}
              >
                <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: isMobile ? '1.02rem' : '1.08rem', color: '#f5d0c5' }}>
                  University of Maryland
                </div>
                <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: isMobile ? '0.86rem' : '0.9rem', color: '#c2c2df', marginTop: 8, lineHeight: 1.7 }}>
                  B.S. Computer Science · Minor: Computational Finance
                </div>
                <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: isMobile ? '0.72rem' : '0.65rem', color: '#888898', marginTop: 8, background: 'rgba(255,255,255,0.03)', padding: '4px 8px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)', display: 'inline-block' }}>
                  May 2028
                </div>
              </div>
            </div>

            {/* Skills */}
            <div>
              <div
                style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: isMobile ? '1.04rem' : '0.92rem',
                  letterSpacing: '0.15em',
                  color: '#b76e79',
                  textTransform: 'uppercase',
                  marginBottom: '1.25rem',
                }}
              >
                Skills
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {Object.entries(skills).map(([category, items]) => (
                  <div key={category}>
                    <div
                      style={{
                        fontFamily: 'Outfit, sans-serif',
                        fontSize: isMobile ? '0.74rem' : '0.7rem',
                        color: '#f5d0c5',
                        letterSpacing: '0.1em',
                        marginBottom: '0.75rem',
                        textTransform: 'uppercase',
                      }}
                    >
                      {category}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {items.map((item) => (
                        <span key={item} style={{
                          background: 'rgba(183, 110, 121, 0.08)',
                          border: '1px solid rgba(183, 110, 121, 0.2)',
                          color: '#f5d0c5',
                          fontFamily: 'Outfit, sans-serif',
                          fontSize: isMobile ? '0.82rem' : '0.8rem',
                          letterSpacing: '0.05em',
                          padding: '4px 10px',
                          borderRadius: '4px',
                        }}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Awards */}
            <div>
              <div
                style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: isMobile ? '1.04rem' : '0.92rem',
                  letterSpacing: '0.15em',
                  color: '#b76e79',
                  textTransform: 'uppercase',
                  marginBottom: '1.25rem',
                }}
              >
                Awards
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {awards.map((a) => (
                  <li
                    key={a}
                    style={{
                      fontFamily: 'Outfit, sans-serif',
                      fontSize: isMobile ? '0.86rem' : '0.9rem',
                      color: '#bcbdcf',
                      lineHeight: 1.7,
                      paddingLeft: '1.2rem',
                      position: 'relative',
                    }}
                  >
                    <span style={{ position: 'absolute', left: 0, color: '#b76e79' }}>—</span>
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
