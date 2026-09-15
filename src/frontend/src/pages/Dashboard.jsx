import { useNavigate } from 'react-router-dom'

const FEATURES = [
  { icon: '📊', text: 'PRR disproportionality analysis (Evans criteria)' },
  { icon: '🔵', text: 'K-Means clustering of similar adverse events' },
  { icon: '🔎', text: 'Per-signal explainability with rate comparisons' },
  { icon: '📋', text: 'ICH M4 CTD completeness check (74 sections)' },
  { icon: '💡', text: 'AI-assisted gap recommendations' },
  { icon: '⚡', text: 'Instant results from synthetic demo data' },
]

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-4">

      {/* Hero */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-1.5 text-xs text-blue-700 font-medium mb-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
          IBM Bob AI Hackathon · Demo Prototype · Synthetic Data Only
        </div>
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
          Pharma<span className="text-blue-600">Guard</span> AI
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
          A decision-support prototype for pharmaceutical safety teams — combining
          statistical signal detection and regulatory submission readiness in one dashboard.
        </p>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 text-center">
        <strong>Important:</strong> PharmaGuard AI is a research prototype using entirely synthetic
        data. It does <em>not</em> make medical diagnoses or confirm drug causality. All outputs
        are statistical associations requiring expert pharmacovigilance review. Not for clinical use.
      </div>

      {/* Two mode cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

        {/* Signal Detection card */}
        <div
          onClick={() => navigate('/signals')}
          className="group bg-white border-2 border-gray-200 hover:border-blue-400 rounded-2xl p-6 cursor-pointer transition-all hover:shadow-md"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl">
              🔍
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Safety Signal Detection</h2>
              <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full">
                Mode A
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-5 leading-relaxed">
            Analyse 500 synthetic adverse-event reports. Calculate PRR for 6 drugs,
            detect disproportional safety signals, cluster similar events, and get
            plain-language explanations for every flagged drug-event pair.
          </p>
          <div className="space-y-1.5 mb-5">
            {['Proportional Reporting Ratio (Evans 2001)', 'K-Means event clustering', 'Per-signal explainability'].map(f => (
              <div key={f} className="flex items-center gap-2 text-xs text-gray-500">
                <span className="text-blue-400">✓</span> {f}
              </div>
            ))}
          </div>
          <button className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold group-hover:bg-blue-700 transition-colors">
            Open Signal Detection →
          </button>
        </div>

        {/* Submission Readiness card */}
        <div
          onClick={() => navigate('/dossier')}
          className="group bg-white border-2 border-gray-200 hover:border-purple-400 rounded-2xl p-6 cursor-pointer transition-all hover:shadow-md"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-2xl">
              📋
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Submission Readiness</h2>
              <span className="text-xs text-purple-600 font-medium bg-purple-50 px-2 py-0.5 rounded-full">
                Mode B
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-5 leading-relaxed">
            Check a synthetic drug dossier against the ICH M4 CTD standard (74 sections
            across Modules 1–5). Get per-module completeness scores, a prioritised
            gap report, and AI-assisted recommendations for each missing section.
          </p>
          <div className="space-y-1.5 mb-5">
            {['ICH M4 CTD structure (all 5 modules)', 'Critical / Major / Minor gap priority', 'AI-assisted remediation guidance'].map(f => (
              <div key={f} className="flex items-center gap-2 text-xs text-gray-500">
                <span className="text-purple-400">✓</span> {f}
              </div>
            ))}
          </div>
          <button className="w-full py-2.5 bg-purple-600 text-white rounded-lg text-sm font-semibold group-hover:bg-purple-700 transition-colors">
            Open Submission Readiness →
          </button>
        </div>
      </div>

      {/* Feature grid */}
      <div>
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest text-center mb-4">
          What's inside
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {FEATURES.map(f => (
            <div key={f.text} className="flex items-start gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5">
              <span className="text-base mt-0.5">{f.icon}</span>
              <span className="text-xs text-gray-600 leading-snug">{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* How to demo */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Demo (3 minutes)</h3>
        <ol className="space-y-2">
          {[
            'Click "Open Signal Detection" — results load automatically from 500 synthetic AE reports.',
            'Note DrugAlpha (PRR 5.0, High) and DrugBeta (PRR 3.7) in the ranked signals table.',
            'Click any signal row → Explain panel shows PRR, χ², rates, and plain-English reasoning.',
            'Switch to the Clusters tab to see K-Means groupings of similar adverse events.',
            'Navigate to Submission Readiness — dossier loads automatically, showing 45.2% overall completeness.',
            'Click "View recommendations" on any incomplete module to see prioritised action items.',
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

    </div>
  )
}
