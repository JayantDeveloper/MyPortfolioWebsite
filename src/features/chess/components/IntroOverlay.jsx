import { Link } from 'react-router-dom';
import useResponsive from '../../../hooks/useResponsive';

export default function IntroOverlay({ visible, onStart }) {
  const { isMobile, isCompact } = useResponsive();
  if (!visible) return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: isMobile ? '1.25rem 1rem' : undefined,
        background:
          "linear-gradient(180deg,rgba(6,2,0,.78) 0%,rgba(6,2,0,.36) 50%,rgba(6,2,0,.78) 100%)",
        backdropFilter: "blur(1px)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: isMobile ? '0.85rem' : "1.2rem",
          marginBottom: isMobile ? '1.5rem' : "2rem",
        }}
      >
        <div
          style={{
            width: isMobile ? 46 : 72,
            height: 1,
            background: "linear-gradient(90deg,transparent,#c8a96e)",
          }}
        />
        <span style={{ color: "#c8a96e", fontSize: "1.1rem", opacity: 0.9 }}>♔</span>
        <div
          style={{
            width: isMobile ? 46 : 72,
            height: 1,
            background: "linear-gradient(90deg,#c8a96e,transparent)",
          }}
        />
      </div>

      <div
        style={{
          textAlign: "center",
          userSelect: "none",
          marginBottom: isMobile ? "1rem" : "1.45rem",
          fontFamily: '"Palatino Linotype","Book Antiqua",Palatino,serif',
        }}
      >
        <div
          style={{
            color: "#f5dfa8",
            fontSize: "clamp(4rem,10vw,7.8rem)",
            fontWeight: 400,
            lineHeight: 1,
            letterSpacing: ".08em",
            textShadow:
              "0 2px 50px rgba(200,169,110,.6),0 0 100px rgba(180,110,20,.22)",
          }}
        >
          JAYANT
        </div>
        <div
          style={{
            color: "#d4a85a",
            fontSize: "clamp(2.4rem,6vw,4.8rem)",
            fontWeight: 400,
            lineHeight: 1.1,
            letterSpacing: ".16em",
            textShadow: "0 2px 30px rgba(180,140,60,.4)",
          }}
        >
          MAHESHWARI
        </div>
      </div>

      <div
        style={{
          fontFamily: 'Outfit, sans-serif',
          color: "#d9bf92",
          fontSize: "clamp(.92rem,2vw,1.2rem)",
          letterSpacing: ".08em",
          lineHeight: isMobile ? 1.55 : 1.7,
          textAlign: "center",
          textShadow: "0 2px 18px rgba(100,60,10,.22)",
          maxWidth: isMobile ? 340 : 'none',
        }}
      >
        Chess Expert · Web Developer · Computer Science Student @ UMD
      </div>

      <div style={{ height: isMobile ? '2rem' : "3rem" }} />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: isMobile ? '0.75rem' : '1rem',
          flexWrap: 'wrap',
          width: '100%',
          maxWidth: isMobile ? 360 : 'none',
        }}
      >
        <button
          onClick={onStart}
          style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: isMobile ? '0.92rem' : "1.08rem",
            letterSpacing: isMobile ? '.12em' : ".16em",
            textTransform: "uppercase",
            color: "#150800",
            background:
              "linear-gradient(135deg,#a87e28 0%,#e8c870 42%,#b88a30 100%)",
            border: "none",
            padding: isMobile ? '16px 22px' : "18px 64px",
            borderRadius: 4,
            cursor: "pointer",
            boxShadow:
              "0 6px 36px rgba(200,169,110,.5),inset 0 1px 0 rgba(255,255,255,.28)",
            transition: "all .22s ease",
            fontWeight: "bold",
            width: isMobile ? '100%' : 'auto',
          }}
          onMouseEnter={(event) => {
            event.currentTarget.style.transform = "scale(1.07) translateY(-2px)";
            event.currentTarget.style.boxShadow =
              "0 12px 48px rgba(200,169,110,.7),inset 0 1px 0 rgba(255,255,255,.28)";
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.transform = "scale(1) translateY(0)";
            event.currentTarget.style.boxShadow =
              "0 6px 36px rgba(200,169,110,.5),inset 0 1px 0 rgba(255,255,255,.28)";
          }}
        >
          ♟ &nbsp;Play Chess
        </button>

        <Link
          to="/projects"
          style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: isMobile ? '0.9rem' : "1.02rem",
            letterSpacing: isMobile ? '.1em' : ".14em",
            textTransform: "uppercase",
            color: "#ead7b3",
            background:
              "linear-gradient(135deg,rgba(49,27,10,.96) 0%,rgba(90,55,26,.9) 100%)",
            border: "1px solid rgba(200,169,110,.34)",
            padding: isMobile ? '16px 22px' : "17px 34px",
            borderRadius: 4,
            cursor: "pointer",
            boxShadow:
              "0 6px 28px rgba(68,36,14,.28),inset 0 1px 0 rgba(255,255,255,.08)",
            transition: "all .22s ease",
            fontWeight: 700,
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.7rem',
            width: isMobile ? '100%' : 'auto',
          }}
          onMouseEnter={(event) => {
            event.currentTarget.style.transform = "translateY(-2px)";
            event.currentTarget.style.borderColor = 'rgba(232,200,132,.58)';
            event.currentTarget.style.boxShadow =
              "0 10px 32px rgba(92,51,19,.36),inset 0 1px 0 rgba(255,255,255,.12)";
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.transform = "translateY(0)";
            event.currentTarget.style.borderColor = 'rgba(200,169,110,.34)';
            event.currentTarget.style.boxShadow =
              "0 6px 28px rgba(68,36,14,.28),inset 0 1px 0 rgba(255,255,255,.08)";
          }}
        >
          <span>View Projects</span>
          <span
            style={{
              fontSize: isCompact ? '1rem' : '1.12rem',
              color: '#d7b072',
              lineHeight: 1,
            }}
          >
            →
          </span>
        </Link>
      </div>
    </div>
  );
}
