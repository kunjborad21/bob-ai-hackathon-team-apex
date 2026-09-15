/**
 * GapReport — filterable table of all gap items from a CompletenessReport.
 * Props:
 *   gaps         — array of GapItem objects
 *   onSelectGap  — called with a gap item when clicked
 */
import { useState } from 'react'

const SEV_ORDER = { Critical: 0, Major: 1, Minor: 2 }

export default function GapReport({ gaps = [], onSelectGap }) {
  const [filter, setFilter] = useState('All')  // 'All' | 'Critical' | 'Major' | 'Minor'
  const [search, setSearch] = useState('')

  const visible = gaps
    .filter(g => filter === 'All' || g.severity === filter)
    .filter(g =>
      !search ||
      g.section_name.toLowerCase().includes(search.toLowerCase()) ||
      g.section_id.toLowerCase().includes(search.toLowerCase())
    )

  const counts = {
    Critical: gaps.filter(g => g.severity === 'Critical').length,
    Major:    gaps.filter(g => g.severity === 'Major').length,
    Minor:    gaps.filter(g => g.severity === 'Minor').length,
  }

  const severityStyle = {
    Critical: 'bg-red-100 text-red-700 border-red-200',
    Major:    'bg-orange-100 text-orange-700 border-orange-200',
    Minor:    'bg-gray-100 text-gray-500 border-gray-200',
  }

  if (gaps.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <p className="text-green-700 font-medium">No gaps detected — dossier is complete!</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="text"
          placeholder="Search sections…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-gray-200 rounded-md px-3 py-1.5 text-sm w-48 focus:outline-none focus:ring-1 focus:ring-blue-400"
        />
        {['All', 'Critical', 'Major', 'Minor'].map(sev => (
          <button
            key={sev}
            onClick={() => setFilter(sev)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
              filter === sev
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
            }`}
          >
            {sev}{sev !== 'All' && ` (${counts[sev]})`}
          </button>
        ))}
        <span className="text-xs text-gray-400 ml-auto">{visible.length} of {gaps.length} gaps shown</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {['Module', 'Section', 'Section Name', 'Severity', ''].map(h => (
                <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {visible.map(gap => (
              <tr
                key={`${gap.module_id}-${gap.section_id}`}
                className="hover:bg-blue-50 transition-colors"
              >
                <td className="px-3 py-2 text-xs text-gray-400 font-mono">{gap.module_id.replace('module_', 'M')}</td>
                <td className="px-3 py-2 text-xs font-mono text-gray-600">{gap.section_id}</td>
                <td className="px-3 py-2 text-gray-800">{gap.section_name}</td>
                <td className="px-3 py-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${severityStyle[gap.severity]}`}>
                    {gap.severity}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <button
                    onClick={() => onSelectGap?.(gap)}
                    className="text-xs text-blue-500 hover:underline whitespace-nowrap"
                  >
                    Recommend →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
