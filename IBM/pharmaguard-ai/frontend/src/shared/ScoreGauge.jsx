/**
 * ScoreGauge — circular progress indicator for a completeness percentage.
 * Props:
 *   score    — number 0-100
 *   size     — "sm" | "md" | "lg" (default "md")
 *   label    — text below the gauge
 */
const SIZE = {
  sm: { r: 28, stroke: 5,  text: 'text-sm',  wrap: 72  },
  md: { r: 40, stroke: 6,  text: 'text-xl',  wrap: 100 },
  lg: { r: 52, stroke: 8,  text: 'text-2xl', wrap: 128 },
}

function scoreColour(score) {
  if (score >= 80) return '#10b981'  // green
  if (score >= 50) return '#f97316'  // orange
  return '#ef4444'                   // red
}

export default function ScoreGauge({ score = 0, size = 'md', label = '' }) {
  const { r, stroke, text, wrap } = SIZE[size] ?? SIZE.md
  const cx = wrap / 2
  const cy = wrap / 2
  const circumference = 2 * Math.PI * r
  const filled = circumference * (score / 100)
  const colour = scoreColour(score)

  return (
    <div className="flex flex-col items-center gap-1">
      {/* SVG + score text in a relative container so text sits centred over the ring */}
      <div className="relative" style={{ width: wrap, height: wrap }}>
        <svg width={wrap} height={wrap} className="-rotate-90 absolute inset-0">
          {/* Background track */}
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={stroke}
          />
          {/* Progress arc */}
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={colour}
            strokeWidth={stroke}
            strokeDasharray={`${filled} ${circumference - filled}`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 0.5s ease' }}
          />
        </svg>
        {/* Score text centred over the ring */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-bold leading-none ${text}`} style={{ color: colour }}>
            {score}%
          </span>
        </div>
      </div>
      {label && (
        <p className="text-xs text-gray-500 text-center leading-tight max-w-[90px]">{label}</p>
      )}
    </div>
  )
}
