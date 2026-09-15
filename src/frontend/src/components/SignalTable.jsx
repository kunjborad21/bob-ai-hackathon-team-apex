import { useState } from 'react'

const STRENGTH_STYLE = {
  High:   { row: 'bg-red-50',    badge: 'bg-red-100 text-red-800 border-red-200' },
  Medium: { row: 'bg-orange-50', badge: 'bg-orange-100 text-orange-800 border-orange-200' },
  Low:    { row: 'bg-yellow-50', badge: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  None:   { row: '',             badge: 'bg-gray-100 text-gray-400 border-gray-200' },
}

/**
 * SignalTable — sortable PRR results table.
 * Signal rows are visually highlighted.
 * Props:
 *   results  — array of PRRResult objects
 *   onSelect — called with a result row when clicked
 */
export default function SignalTable({ results = [], onSelect }) {
  const [sortKey, setSortKey] = useState('prr')
  const [sortDir, setSortDir] = useState('desc')
  const [showAll, setShowAll] = useState(false)

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center py-10 gap-2 text-gray-400">
        <span className="text-3xl">📊</span>
        <p className="text-sm">No results yet.</p>
      </div>
    )
  }

  const toggle = (key) => {
    if (sortKey === key) setSortDir(d => d === 'desc' ? 'asc' : 'desc')
    else { setSortKey(key); setSortDir('desc') }
  }

  const sorted = [...results].sort((a, b) => {
    const mul = sortDir === 'desc' ? -1 : 1
    return mul * (a[sortKey] > b[sortKey] ? 1 : -1)
  })

  const signalCount = results.filter(r => r.is_signal).length
  const displayed   = showAll ? sorted : sorted.slice(0, 12)

  const Th = ({ col, label }) => (
    <th
      onClick={() => toggle(col)}
      className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:text-gray-900 whitespace-nowrap"
    >
      {label}{sortKey === col && <span className="ml-1">{sortDir === 'desc' ? '▼' : '▲'}</span>}
    </th>
  )

  return (
    <div className="space-y-2">
      {signalCount > 0 && (
        <p className="text-xs text-gray-500">
          <span className="font-semibold text-red-600">{signalCount} signal{signalCount !== 1 ? 's' : ''}</span> highlighted
          &nbsp;— click any row for a full explanation.
        </p>
      )}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <Th col="event_term"     label="Adverse Event" />
              <Th col="event_soc"      label="System Organ Class" />
              <Th col="case_count"     label="Cases (n)" />
              <Th col="prr"            label="PRR" />
              <Th col="chi2"           label="χ²" />
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Signal
              </th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {displayed.map(row => {
              const sty = STRENGTH_STYLE[row.signal_strength] ?? STRENGTH_STYLE.None
              return (
                <tr
                  key={row.event_term}
                  onClick={() => onSelect?.(row)}
                  className={`cursor-pointer transition-colors hover:brightness-95 ${row.is_signal ? sty.row : 'hover:bg-gray-50'}`}
                >
                  <td className={`px-3 py-2 font-medium ${row.is_signal ? 'text-gray-900' : 'text-gray-500'}`}>
                    {row.event_term}
                  </td>
                  <td className="px-3 py-2 text-xs text-gray-400">{row.event_soc}</td>
                  <td className="px-3 py-2 text-center text-gray-700">{row.case_count}</td>
                  <td className={`px-3 py-2 text-center font-mono font-bold ${
                    row.prr >= 5 ? 'text-red-600' : row.prr >= 3 ? 'text-orange-600' : 'text-gray-600'
                  }`}>
                    {row.prr.toFixed(2)}
                  </td>
                  <td className="px-3 py-2 text-center font-mono text-gray-500">{row.chi2.toFixed(2)}</td>
                  <td className="px-3 py-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${sty.badge}`}>
                      {row.is_signal ? row.signal_strength : '—'}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    {row.is_signal && (
                      <span className="text-xs text-blue-500 font-medium whitespace-nowrap">Explain →</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {results.length > 12 && (
        <button onClick={() => setShowAll(v => !v)} className="text-xs text-blue-600 hover:underline">
          {showAll ? 'Show fewer' : `Show all ${results.length} event terms`}
        </button>
      )}
    </div>
  )
}
