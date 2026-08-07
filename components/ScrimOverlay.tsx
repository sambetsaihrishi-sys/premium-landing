export default function ScrimOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[5]">
      {/* Left scrim — anchors the headline copy */}
      <div
        className="absolute inset-y-0 left-0 w-1/2"
        style={{
          background:
            "linear-gradient(90deg, rgba(10,10,11,0.55) 0%, rgba(10,10,11,0.28) 35%, rgba(10,10,11,0) 100%)",
        }}
      />
      {/* Right scrim — subtle, keeps CTA area legible */}
      <div
        className="absolute inset-y-0 right-0 w-1/3"
        style={{
          background:
            "linear-gradient(270deg, rgba(10,10,11,0.35) 0%, rgba(10,10,11,0) 100%)",
        }}
      />
      {/* Top scrim — protects the nav */}
      <div
        className="absolute inset-x-0 top-0 h-40"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,10,11,0.5) 0%, rgba(10,10,11,0) 100%)",
        }}
      />
    </div>
  );
}
