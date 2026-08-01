type ProgressGaugeProps = {
  percent: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  className?: string;
};

/*
  Anneau de progression. Une seule série (le pourcentage terminé) : pas de
  légende nécessaire, le libellé sous le chiffre suffit à nommer ce qui est
  affiché. Remplissage en accent, piste en accent-bg (même rampe, plus
  claire) pour que l'état se lise sur tout l'anneau.
*/
export default function ProgressGauge({ percent, size = 160, strokeWidth = 12, label, className = "" }: ProgressGaugeProps) {
  const clamped = Math.min(100, Math.max(0, percent));
  const radius = 50 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped / 100);

  return (
    <div className={`relative inline-flex flex-col items-center justify-center ${className}`.trim()} style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" width={size} height={size} className="-rotate-90">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#FFECD8" strokeWidth={strokeWidth} />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#F07020"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-2 text-center">
        <span className="font-sans font-semibold text-espresso-900" style={{ fontSize: size * 0.24 }}>
          {clamped}%
        </span>
        {label && <span className="mt-1 text-xs text-espresso-400">{label}</span>}
      </div>
    </div>
  );
}
