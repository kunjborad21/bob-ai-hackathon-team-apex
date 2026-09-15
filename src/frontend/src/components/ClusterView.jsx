import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

/**
 * ClusterView — visual summary of K-Means cluster groups for one drug.
 * Props:
 *   clusters  — array of ClusterGroup objects from /api/signals/cluster
 *   drugName  — string, used in headings
 */

const PALETTE = ['#3b82f6', '#f97316', '#10b981', '#8b5cf6', '#ef4444', '#eab308']

const SOC_ICON = {
  'Gastrointestinal disorders':               '🫁',
  'Nervous system disorders':                 '🧠',
  'Cardiac disorders':                        '❤️',
  'Skin and subcutaneous tissue disorders':   '🩹',
  'Musculoskeletal disorders':                '🦴',
  'Respiratory disorders':                    '🫀',
  'Psychiatric disorders':                    '🧩',
  'Vascular disorders':                       '🩸',
}

export default function ClusterView({ clusters = [], drugName = '' }) {
  if (clusters.length === 0) {
    return <p className="text-gray-400 text-sm py-4 text-center">No cluster data.</p>
  }

  const pieData = clusters.map((c, i) => ({
    name:  c.cluster_label,
    value: c.report_count,
    fill:  PALETTE[i % PALETTE.length],
  }))

  return (
    <div className="space-y-4">
      {/* Pie chart overview */}
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Report Distribution across {clusters.length} Clusters — {drugName}
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {pieData.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip formatter={(v) => [`${v} reports`, 'Count']} />
            <Legend
              formatter={(value) => (
                <span className="text-xs text-gray-600">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Cluster cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {clusters.map((c, i) => {
          const icon  = SOC_ICON[c.dominant_soc] ?? '📋'
          const color = PALETTE[i % PALETTE.length]
          return (
            <div
              key={c.cluster_id}
              className="bg-white rounded-lg border border-gray-200 p-4"
              style={{ borderLeftColor: color, borderLeftWidth: 4 }}
            >
              {/* Card header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{icon}</span>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{c.cluster_label}</p>
                    <p className="text-xs text-gray-400">{c.dominant_soc}</p>
                  </div>
                </div>
                <span
                  className="text-xs font-bold px-2 py-1 rounded-full text-white"
                  style={{ backgroundColor: color }}
                >
                  {c.report_count} reports
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                {c.centroid_description}
              </p>

              {/* Representative events */}
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                  Top adverse events
                </p>
                <div className="flex flex-wrap gap-1">
                  {c.representative_events.map(ev => (
                    <span
                      key={ev}
                      className="text-xs px-2 py-0.5 rounded-full border border-gray-200 bg-gray-50 text-gray-700"
                    >
                      {ev}
                    </span>
                  ))}
                </div>
              </div>

              {/* Severity badge */}
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-gray-400">Dominant severity:</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  c.dominant_severity === 'Severe'   ? 'bg-red-100 text-red-700' :
                  c.dominant_severity === 'Moderate' ? 'bg-orange-100 text-orange-700' :
                                                       'bg-green-100 text-green-700'
                }`}>
                  {c.dominant_severity}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
