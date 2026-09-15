import ScoreGauge from '../shared/ScoreGauge.jsx'

/**
 * CTDModuleTree — renders each ICH M4 module as a collapsible row
 * showing its score gauge + section-level present/missing breakdown.
 *
 * Props:
 *   report     — CompletenessReport from /api/dossier/check/sample
 *   onModuleClick — called with module_id when user clicks Recommend
 */
export default function CTDModuleTree({ report, onModuleClick }) {
  if (!report) return null

  return (
    <div className="space-y-3">
      {report.modules.map(mod => (
        <ModuleRow
          key={mod.module_id}
          mod={mod}
          gaps={report.gaps.filter(g => g.module_id === mod.module_id)}
          onRecommend={() => onModuleClick?.(mod.module_id)}
        />
      ))}
    </div>
  )
}

function ModuleRow({ mod, gaps, onRecommend }) {
  const criticalCount = gaps.filter(g => g.severity === 'Critical').length
  const majorCount    = gaps.filter(g => g.severity === 'Major').length
  const minorCount    = gaps.filter(g => g.severity === 'Minor').length

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Module header */}
      <div className="flex items-center gap-4 px-4 py-3 bg-gray-50 border-b border-gray-100">
        <ScoreGauge score={mod.score_pct} size="sm" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-gray-900 truncate">{mod.module_name}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {mod.present_count}/{mod.total_count} sections present
          </p>
          {/* Gap badges */}
          <div className="flex gap-1 mt-1 flex-wrap">
            {criticalCount > 0 && (
              <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full border border-red-200">
                {criticalCount} Critical
              </span>
            )}
            {majorCount > 0 && (
              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full border border-orange-200">
                {majorCount} Major
              </span>
            )}
            {minorCount > 0 && (
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full border border-gray-200">
                {minorCount} Minor
              </span>
            )}
            {gaps.length === 0 && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full border border-green-200">
                Complete
              </span>
            )}
          </div>
        </div>
        {gaps.length > 0 && (
          <button
            onClick={onRecommend}
            className="text-xs text-blue-600 hover:underline whitespace-nowrap"
          >
            View recommendations →
          </button>
        )}
      </div>

      {/* Section grid — only missing sections */}
      {gaps.length > 0 && (
        <div className="px-4 py-3">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Missing sections</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
            {gaps.map(gap => (
              <div key={gap.section_id} className="flex items-start gap-2 text-xs">
                <span className={`mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                  gap.severity === 'Critical' ? 'bg-red-500' :
                  gap.severity === 'Major'    ? 'bg-orange-400' : 'bg-gray-300'
                }`} />
                <span className="text-gray-400 font-mono w-12 flex-shrink-0">{gap.section_id}</span>
                <span className="text-gray-600 leading-tight">{gap.section_name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
