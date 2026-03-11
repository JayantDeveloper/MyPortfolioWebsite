const links = [
  {
    label: 'Email',
    value: 'jmaheshw@terpmail.umd.edu',
    href: 'mailto:jmaheshw@terpmail.umd.edu',
    desc: 'Best for professional inquiries',
  },
  {
    label: 'GitHub',
    value: 'github.com/JayantDeveloper',
    href: 'https://github.com/JayantDeveloper',
    desc: 'Open source & project code',
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/jayant-maheshwari6114',
    href: 'https://www.linkedin.com/in/jayant-maheshwari6114/',
    desc: 'Professional network',
  },
  {
    label: 'Phone',
    value: '443-741-0470',
    href: 'tel:4437410470',
    desc: 'Available by arrangement',
  },
];

export default function Contact() {
  return (
    <div style={{ paddingTop: 56 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '5rem 2rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '4rem' }}>
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
            Get In Touch
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
            Contact
          </h1>
          <p
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: '0.75rem',
              color: '#888898',
              maxWidth: 480,
              lineHeight: 1.8,
              margin: 0,
            }}
          >
            Open to interesting projects, internships, full-time opportunities, or just a
            good conversation about ML, chess, or building things.
          </p>
        </div>

        <div style={{ borderTop: '1px solid #2a2a2e', marginBottom: '4rem' }} />

        {/* Contact cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1rem',
            maxWidth: 800,
          }}
        >
          {links.map(({ label, value, href, desc }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              style={{
                textDecoration: 'none',
                display: 'block',
                background: '#111113',
                border: '1px solid #2a2a2e',
                borderRadius: 4,
                padding: '1.5rem',
                transition: 'border-color 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#3f3f46';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(144,144,184,0.05)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#2a2a2e';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div
                style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '0.58rem',
                  color: '#9090b8',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  marginBottom: '0.5rem',
                }}
              >
                {label}
              </div>
              <div
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  color: '#dddde8',
                  marginBottom: '0.4rem',
                  wordBreak: 'break-all',
                }}
              >
                {value}
              </div>
              <div
                style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '0.62rem',
                  color: '#3f3f46',
                }}
              >
                {desc}
              </div>
            </a>
          ))}
        </div>

        {/* Bottom location note */}
        <div
          style={{
            marginTop: '5rem',
            fontFamily: 'Outfit, sans-serif',
            fontSize: '0.6rem',
            color: '#3f3f46',
            letterSpacing: '0.1em',
          }}
        >
          Based in College Park, MD · University of Maryland
        </div>
      </div>
    </div>
  );
}
