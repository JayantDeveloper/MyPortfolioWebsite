import useResponsive from "../../../hooks/useResponsive";

function formatTime(milliseconds) {
  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const minutes = (totalSeconds / 60) | 0;
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function Clock({ time, active, label }) {
  const { isMobile, isCompact } = useResponsive();
  const urgent = time < 30000;

  return (
    <div
      style={{
        fontFamily: 'Inter, sans-serif',
        color: active ? (urgent ? "#ffb2aa" : "#f8ebcf") : "#b49877",
        background: active
          ? urgent
            ? "linear-gradient(180deg,rgba(95,22,12,.95),rgba(45,10,8,.95))"
            : "linear-gradient(180deg,rgba(42,24,10,.94),rgba(19,10,4,.94))"
          : "linear-gradient(180deg,rgba(22,14,7,.82),rgba(12,8,4,.82))",
        border: `1px solid ${active ? (urgent ? "#c5584d" : "#b58a54") : "#5a4028"}`,
        borderRadius: 10,
        padding: isMobile ? "9px 12px 10px" : "12px 18px 14px",
        minWidth: isCompact ? 112 : isMobile ? 132 : 176,
        textAlign: "left",
        transition: "all .3s",
        boxShadow: active
          ? `0 12px 30px ${urgent ? "rgba(120,24,18,.28)" : "rgba(70,42,12,.25)"}`
          : undefined,
        backdropFilter: "blur(10px)",
      }}
    >
      <div
        style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: isMobile ? ".46rem" : ".58rem",
          letterSpacing: ".28em",
          textTransform: "uppercase",
          opacity: 0.78,
          marginBottom: isMobile ? 6 : 8,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: isCompact ? "1.2rem" : isMobile ? "1.45rem" : "1.95rem",
          lineHeight: 1,
          letterSpacing: ".04em",
          fontWeight: 700,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {formatTime(time)}
      </div>
    </div>
  );
}
