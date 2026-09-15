import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer, Cell
} from 'recharts'

/**
 * PRRChart — horizontal bar chart of PRR values for a drug's adverse events.
 * Props:
 *   results — array of PRRResult objects (already sorted by PRR desc)
 *   topN    — how many events to show (default 12)
 */
export default function PRRChart({ results = [], topN = 12 }) {
  if (results.length === 0) {
    return <p className="text-gray-400 text-sm py-4 text-center">No data to chart.</p>
  }

  // Show top-N only (already sorted by PRR desc from API)
  const data = results.slice(0, topN).map(r => ({
    name:     r.event_term,
    prr:      r.prr,
    signal:   r.is_signal,
    strength: r.signal_strength,
  }))

  const colourOf = (entry) => {
    if (!entry.signal)            return '#9ca3af' // gray
    if (entry.strength === 'High')   return '#ef4444' // red
    if (entry.strength === 'Medium') return '#f97316' // orange
    return '#eab308'                                  // yellow
  }

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null
    const d = payload[0].payload
    return (
      <div className="bg-white border border-gray-200 rounded shadow-sm p-2 text-xs">
        <p className="font-semibold text-gray-900 mb-1">{d.name}</p>
        <p>PRR: <span className="font-mono">{d.prr.toFixed(3)}</span></p>
        <p>Signal: <span className={d.signal ? 'text-red-600 font-medium' : 'text-gray-500'}>
          {d.signal ? `Yes (${d.strength})` : 'No'}
        </span></p>
        {!d.signal && <p className="text-gray-400 mt-1">Below Evans threshold (PRR≥2, χ²≥4, n≥3)</p>}
      </div>
    )
  }

  return (
    <div>
      <p className="text-xs text-gray-400 mb-2">
        Reference line at PRR = 2.0 (Evans signal threshold). Top {Math.min(topN, results.length)} events shown.
      </p>
      <ResponsiveContainer width="100%" height={Math.max(240, data.length * 28)}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 32, bottom: 4, left: 120 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis
            type="number"
            domain={[0, 'auto']}
            tickLine={false}
            tick={{ fontSize: 11 }}
            label={{ value: 'PRR', position: 'insideBottomRight', offset: -4, fontSize: 11 }}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={115}
            tick={{ fontSize: 11 }}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine x={2} stroke="#6b7280" strokeDasharray="4 2" label={{ value: 'PRR=2', fontSize: 10, fill: '#6b7280' }} />
          <Bar dataKey="prr" radius={[0, 3, 3, 0]} maxBarSize={18}>
            {data.map((entry, i) => (
              <Cell key={i} fill={colourOf(entry)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
