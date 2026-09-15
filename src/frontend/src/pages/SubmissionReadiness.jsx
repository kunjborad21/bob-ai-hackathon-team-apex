import { useState, useEffect } from 'react'
import { checkSampleDossier } from '../api/dossierApi.js'
import ScoreGauge from '../shared/ScoreGauge.jsx'
import CTDModuleTree from '../components/CTDModuleTree.jsx'
import GapReport from '../components/GapReport.jsx'
import RecommendationPanel from '../components/RecommendationPanel.jsx'

export default function SubmissionReadiness() {
  const [report, setReport]       = useState(null)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(null)
  const [activeTab, setActiveTab] = useState('modules')
  const [recTarget, setRecTarget] = useState(null)

  const runDemo = () => {
    setLoading(true)
    setError(null)
    setReport(null)
    checkSampleDossier()
      .then(data => { setReport(data); setLoading(false) })
      .catch(e   => { setError(e.message); setLoading(false) })
  }

  // Auto-load on mount
  useEffect(() => { runDemo() }, []) // eslint-disable-line

  const criticalCount = report?.gaps.filter(g => g.severity === 'Critical').length ?? 0
  const majorCount    = report?.gaps.filter(g => g.severity === 'Major').length ?? 0
  const minorCount    = report?.gaps.filter(g => g.severity === 'Minor').length ?? 0

  return (
    <div className="space-y-6">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">📋</span>
            <h1 className="text-2xl font-bold text-gray-900">Submission Readiness</h1>
          </div>
          <p className="text-gray-500 text-sm max-w-xl">
            Checks a drug dossier against the ICH M4 Common Technical Document standard —
            scoring completeness across all 5 modules (82 required sections).
          </p>
        </div>
        <button
          onClick={runDemo}
          className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold transition-colors"
        >
          <span>▶</span> Run Demo Check
        </button>
      </div>

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-800">
        ℹ️ Analysing <strong>{report?.submission_name ?? 'DrugAlpha NDA-2024-001'}</strong> against the
        ICH M4 CTD structure. This dossier is intentionally incomplete to demonstrate the gap-analysis workflow.
        All data is synthetic.
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center py-12 gap-3">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Analysing dossier against ICH M4 schema…</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700 flex items-start gap-3">
          <span className="text-lg">⚠️</span>
          <div>
            <p className="font-medium">Failed to load dossier analysis</p>
            <p className="text-xs mt-1 text-red-500">{error}</p>
            <button onClick={runDemo} className="mt-2 text-xs underline text-red-600">Retry</button>
          </div>
        </div>
      )}

      {report && !loading && (
        <>
          {/* Readiness verdict banner */}
          <div className={`rounded-xl border-2 px-5 py-4 flex items-start gap-4 ${
            report.ready_for_submission
              ? 'bg-green-50 border-green-300'
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="text-3xl flex-shrink-0">
              {report.ready_for_submission ? '✅' : '❌'}
            </div>
            <div>
              <p className={`font-bold text-base ${report.ready_for_submission ? 'text-green-800' : 'text-red-800'}`}>
                {report.ready_for_submission
                  ? 'Dossier meets submission readiness threshold'
                  : 'Dossier is NOT ready for submission'}
              </p>
              <p className={`text-sm mt-0.5 ${report.ready_for_submission ? 'text-green-700' : 'text-red-700'}`}>
                Overall completeness: <strong>{report.overall_score_pct}%</strong>
                {!report.ready_for_submission && criticalCount > 0 && (
                  <> · <strong>{criticalCount} Critical</strong> gaps must be resolved before submission</>
                )}
              </p>
            </div>
          </div>

          {/* Score row — overall + per-module gauges */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            <div className={`col-span-3 sm:col-span-1 rounded-xl border p-4 flex flex-col items-center justify-center ${
              report.ready_for_submission ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
            }`}>
              <ScoreGauge score={report.overall_score_pct} size="md" label="Overall" />
            </div>
            {report.modules.map(mod => (
              <div key={mod.module_id} className="rounded-xl border border-gray-200 bg-white p-3 flex flex-col items-center gap-1">
                <ScoreGauge score={mod.score_pct} size="sm" label={mod.module_id.replace('module_', 'M')} />
                <p className="text-xs text-gray-400 text-center leading-tight" style={{ fontSize: 10 }}>
                  {mod.present_count}/{mod.total_count}
                </p>
              </div>
            ))}
          </div>

          {/* Gap summary strip */}
          <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold text-gray-700">Gap summary:</span>
            <SevBadge count={criticalCount} label="Critical" cls="bg-red-100 text-red-700 border-red-200" />
            <SevBadge count={majorCount}    label="Major"    cls="bg-orange-100 text-orange-700 border-orange-200" />
            <SevBadge count={minorCount}    label="Minor"    cls="bg-gray-100 text-gray-500 border-gray-200" />
            <span className="text-xs text-gray-400">
              {report.gaps.length} of 82 total sections missing
            </span>
          </div>

          {/* Main analysis panel */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Tab header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50">
              <h2 className="text-base font-semibold text-gray-900">Dossier Analysis</h2>
              <div className="flex rounded-lg border border-gray-200 overflow-hidden text-sm bg-white">
                {[
                  { id: 'modules', label: '🗂 Module Tree' },
                  { id: 'gaps',    label: '📋 Gap Report'  },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-1.5 font-medium transition-colors ${
                      activeTab === tab.id ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-5">
              {activeTab === 'modules' && (
                <CTDModuleTree
                  report={report}
                  onModuleClick={modId => {
                    setRecTarget({ moduleId: modId })
                    setTimeout(() => document.getElementById('rec-panel')?.scrollIntoView({ behavior: 'smooth' }), 100)
                  }}
                />
              )}
              {activeTab === 'gaps' && (
                <GapReport
                  gaps={report.gaps}
                  onSelectGap={gap => {
                    setRecTarget({ moduleId: gap.module_id, sectionId: gap.section_id })
                    setTimeout(() => document.getElementById('rec-panel')?.scrollIntoView({ behavior: 'smooth' }), 100)
                  }}
                />
              )}
            </div>
          </div>

          {/* Recommendation Panel */}
          {recTarget && (
            <div id="rec-panel">
              <RecommendationPanel
                moduleId={recTarget.moduleId}
                sectionId={recTarget.sectionId}
                onClose={() => setRecTarget(null)}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}

function SevBadge({ count, label, cls }) {
  return (
    <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${cls}`}>
      {count} {label}
    </span>
  )
}
