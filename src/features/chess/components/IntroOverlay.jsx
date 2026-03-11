export default function IntroOverlay({ visible, onStart }) {
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
        background:
          "linear-gradient(180deg,rgba(6,2,0,.78) 0%,rgba(6,2,0,.36) 50%,rgba(6,2,0,.78) 100%)",
        backdropFilter: "blur(1px)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1.2rem",
          marginBottom: "2rem",
        }}
      >
        <div
          style={{
            width: 72,
            height: 1,
            background: "linear-gradient(90deg,transparent,#c8a96e)",
          }}
        />
        <span style={{ color: "#c8a96e", fontSize: "1.1rem", opacity: 0.9 }}>♔</span>
        <div
          style={{
            width: 72,
            height: 1,
            background: "linear-gradient(90deg,#c8a96e,transparent)",
          }}
        />
      </div>

      <div
        style={{
          fontFamily: '"Palatino Linotype","Book Antiqua",Palatino,serif',
          textAlign: "center",
          userSelect: "none",
          marginBottom: ".6rem",
        }}
      >
        <div
          style={{
            color: "#f5dfa8",
            fontSize: "clamp(3.2rem,9vw,7.5rem)",
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
            fontSize: "clamp(1.8rem,5vw,4.2rem)",
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
          fontFamily: '"Palatino Linotype","Book Antiqua",Palatino,serif',
          color: "#d9bf92",
          fontSize: "clamp(.92rem,2vw,1.2rem)",
          letterSpacing: ".08em",
          lineHeight: 1.7,
          textAlign: "center",
          textShadow: "0 2px 18px rgba(100,60,10,.22)",
        }}
      >
        Chess Expert · Web Developer · Computer Science Student @ UMD
      </div>

      <div style={{ height: "3rem" }} />

      <button
        onClick={onStart}
        style={{
          fontFamily: '"Palatino Linotype",Palatino,serif',
          fontSize: "1.08rem",
          letterSpacing: ".3em",
          textTransform: "uppercase",
          color: "#150800",
          background:
            "linear-gradient(135deg,#a87e28 0%,#e8c870 42%,#b88a30 100%)",
          border: "none",
          padding: "18px 64px",
          borderRadius: 4,
          cursor: "pointer",
          boxShadow:
            "0 6px 36px rgba(200,169,110,.5),inset 0 1px 0 rgba(255,255,255,.28)",
          transition: "all .22s ease",
          fontWeight: "bold",
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
    </div>
  );
}
