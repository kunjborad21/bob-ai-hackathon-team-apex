import { useState, useEffect } from 'react'
import { getRecommendations } from '../api/dossierApi.js'

/**
 * RecommendationPanel — fetches and shows recommendations for a given module
 * or for a specific gap section.
 *
 * Props:
 *   moduleId   — e.g. "module_2"
 *   sectionId  — optional; if provided, filters to that section only
 *   onClose    — callback to dismiss
 */
export default function RecommendationPanel({ moduleId, sectionId, onClose }) {
  const [recs, setRecs]       = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  useEffect(() => {
    if (!moduleId) return
    setLoading(true)
    setError(null)
    getRecommendations(moduleId)
      .then(data => {
        setRecs(sectionId ? data.filter(r => r.section_id === sectionId) : data)
        setLoading(false)
      })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [moduleId, sectionId])

  const sevStyle = {
    Critical: { border: 'border-l-red-500',    bg: 'bg-red-50',    badge: 'bg-red-100 text-red-700 border-red-200' },
    Major:    { border: 'border-l-orange-400',  bg: 'bg-orange-50', badge: 'bg-orange-100 text-orange-700 border-orange-200' },
    Minor:    { border: 'border-l-gray-300',    bg: 'bg-gray-50',   badge: 'bg-gray-100 text-gray-500 border-gray-200' },
  }

  const moduleLabel = moduleId
    ? moduleId.replace('module_', 'Module ').replace('_', ' ')
    : ''

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            💡 AI-Assisted Recommendations
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {moduleLabel}{sectionId ? ` · §${sectionId}` : ' — all gaps'}
          </p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none" aria-label="Close">
            ×
          </button>
        )}
      </div>

      <div className="p-4 space-y-3">
        {loading && <p className="text-gray-400 text-sm text-center py-4">Loading recommendations…</p>}
        {error   && <p className="text-red-500 text-sm text-center py-4">Error: {error}</p>}

        {!loading && !error && recs.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-4">No gaps found for this module.</p>
        )}

        {!loading && !error && recs.map(rec => {
          const style = sevStyle[rec.severity] ?? sevStyle.Minor
          return (
            <div
              key={rec.section_id}
              className={`rounded-lg border border-l-4 p-3 ${style.bg} ${style.border}`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <div>
                  <span className="text-xs font-mono text-gray-500 mr-2">{rec.section_id}</span>
                  <span className="text-sm font-medium text-gray-900">{rec.section_name}</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium flex-shrink-0 ${style.badge}`}>
                  {rec.severity}
                </span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{rec.recommendation_text}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
