// Signature visual motif for Arogya Care: three concentric rings that
// close as the day's hydration, steps, and overall goal progress rise —
// a single glance at "how is my day going".
const Ring = ({ radius, stroke, progress, color, trackColor }) => {
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(progress, 100) / 100) * circumference;
  return (
    <>
      <circle cx="100" cy="100" r={radius} fill="none" stroke={trackColor} strokeWidth={stroke} />
      <circle
        cx="100"
        cy="100"
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 100 100)"
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
    </>
  );
};

const WellnessRing = ({ hydration = 0, steps = 0, overall = 0, size = 200 }) => {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox="0 0 200 200" width={size} height={size}>
        <Ring radius={88} stroke={10} progress={overall} color="#F4A835" trackColor="#F4A83522" />
        <Ring radius={68} stroke={10} progress={hydration} color="#0F766E" trackColor="#0F766E1A" />
        <Ring radius={48} stroke={10} progress={steps} color="#E8604C" trackColor="#E8604C1A" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-display font-semibold text-ink">{overall}%</span>
        <span className="text-xs text-ink/50">today's goals</span>
      </div>
    </div>
  );
};

export default WellnessRing;
