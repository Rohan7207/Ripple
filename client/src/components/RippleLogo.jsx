function RippleLogo({ size = "md", showText = true }) {
  const sizes = {
    sm: {
      wrapper: "w-7 h-7",
      outer: "inset-0",
      ring1: "inset-[4px]",
      ring2: "inset-[7px]",
      core: "w-2 h-2",
      orbit: "w-8 h-3",
      text: "text-[16px]",
    },
    md: {
      wrapper: "w-8 h-8",
      outer: "inset-0",
      ring1: "inset-[5px]",
      ring2: "inset-[8px]",
      core: "w-2.5 h-2.5",
      orbit: "w-9 h-3.5",
      text: "text-[17px]",
    },
    lg: {
      wrapper: "w-10 h-10",
      outer: "inset-0",
      ring1: "inset-[6px]",
      ring2: "inset-[10px]",
      core: "w-3 h-3",
      orbit: "w-11 h-4",
      text: "text-xl",
    },
  };

  const s = sizes[size] || sizes.md;

  return (
    <div className="flex items-center gap-2.5">
      {/* Logo */}
      <div className={`relative ${s.wrapper} flex-shrink-0`}>
        {/* Outer ring */}
        <div
          className={`absolute ${s.outer} rounded-full border border-cyan-400/70`}
        />

        {/* Second ring */}
        <div
          className={`absolute ${s.ring1} rounded-full border border-cyan-400/45`}
        />

        {/* Inner ring */}
        <div
          className={`absolute ${s.ring2} rounded-full border border-cyan-400/60`}
        />

        {/* Center */}
        <div
          className={`absolute ${s.core} rounded-full bg-cyan-400 shadow-[0_0_14px_rgba(34,211,238,0.9)] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`}
        />

        {/* Orbit */}
        <div
          className={`absolute ${s.orbit} left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border border-cyan-400/50 rounded-[50%] rotate-[-25deg]`}
        />

        {/* Orbit dot */}
        <div className="absolute w-1.5 h-1.5 bg-slate-200 rounded-full top-[18%] right-[10%]" />

        {/* Subtle glow */}
        <div className="absolute inset-1/4 rounded-full bg-cyan-400/10 blur-md" />
      </div>

      {/* Logo text */}
      {showText && (
        <span
          className={`${s.text} font-semibold tracking-tight text-white`}
        >
          Ripple
        </span>
      )}
    </div>
  );
}

export default RippleLogo;