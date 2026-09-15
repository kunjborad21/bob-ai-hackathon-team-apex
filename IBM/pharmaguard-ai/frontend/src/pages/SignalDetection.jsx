import { useState, useEffect } from 'react'
import { calculatePRR, getRankedSignals, clusterReports } from '../api/signalsApi.js'
import SignalTable from '../components/SignalTable.jsx'
import PRRChart from '../components/PRRChart.jsx'
import ClusterView from '../components/ClusterView.jsx'
import ExplainPanel from '../components/ExplainPanel.jsx'

const DRUGS = ['DrugAlpha', 'DrugBeta', 'DrugGamma', 'DrugDelta', 'DrugEpsilon', 'DrugZeta']

export default function SignalDetection() {
  const [selectedDrug, setSelectedDrug]     = useState('DrugAlpha')
  const [prrResults, setPrrResults]         = useState([])
  const [rankedSignals, setRankedSignals]   = useState([])
  const [clusters, setClusters]             = useState([])
  const [loading, setLoading]               = useState(false)
  const [clusterLoading, setClusterLoading] = useState(false)
  const [error, setError]                   = useState(null)
  const [activeTab, setActiveTab]           = useState('table')
  const [nClusters, setNClusters]           = useState(4)
  const [explainTarget, setExplainTarget]   = useState(null)
  const [hasLoaded, setHasLoaded]           = useState(false)

  const runDemo = () => {
    setHasLoaded(true)
    loadPRR(selectedDrug)
    loadClusters(selectedDrug, nClusters)
    getRankedSignals().then(setRankedSignals).catch(() => {})
  }

  const loadPRR = (drug) => {
    setLoading(true)
    setError(null)
    setPrrResults([])
    calculatePRR(drug)
      .then(data => { setPrrResults(data); setLoading(false) })
      .catch(err  => { setError(err.message); setLoading(false) })
  }

  const loadClusters = (drug, k) => {
    setClusterLoading(true)
    clusterReports(drug, k)
      .then(data => { setClusters(data); setClusterLoading(false) })
      .catch(() => { setClusters([]); setClusterLoading(false) })
  }

  // Auto-load on mount
  useEffect(() => { runDemo() }, []) // eslint-disable-line

  // Reload when drug selection changes (only after first load)
  useEffect(() => {
    if (!hasLoaded) return
    setExplainTarget(null)
    loadPRR(selectedDrug)
    loadClusters(selectedDrug, nClusters)
  }, [selectedDrug]) // eslint-disable-line

  // Reload clusters when k changes
  useEffect(() => {
    if (!hasLoaded) return
    loadClusters(selectedDrug, nClusters)
  }, [nClusters]) // eslint-disable-line

  const signalRows   = prrResults.filter(r => r.is_signal)
  const signalCount  = signalRows.length
  const topSignal    = signalRows[0]

  return (
    <div className="space-y-6">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🔍</span>
            <h1 className="text-2xl font-bold text-gray-900">Safety Signal Detection</h1>
          </div>
          <p className="text-gray-500 text-sm max-w-xl">
            Statistical disproportionality analysis of 500 synthetic adverse-event reports
            across 6 drugs — using Proportional Reporting Ratio (Evans 2001 criteria).
          </p>
        </div>
        <button
          onClick={runDemo}
          className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors"
        >
          <span>▶</span> Run Demo Analysis
        </button>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800">
        ⚠️ <strong>Disclaimer:</strong> Results are statistical associations using synthetic demo data only.
        They do not confirm drug causality and require expert pharmacovigilance review. Not for clinical use.
      </div>

      {/* Top-signal hero callout (only when a high signal exists) */}
      {!loading && topSignal && topSignal.signal_strength === 'High' && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl px-5 py-4 flex items-start gap-4">
          <div className="text-3xl flex-shrink-0">⚠️</div>
          <div>
            <p className="font-bold text-red-800 text-base">
              Potential High-Strength Signal Detected
            </p>
            <p className="text-red-700 text-sm mt-0.5">
              <strong>{topSignal.drug_name}</strong> → <strong>{topSignal.event_term}</strong>
              &nbsp;·&nbsp; PRR = <strong>{topSignal.prr.toFixed(2)}</strong>
              &nbsp;·&nbsp; χ² = <strong>{topSignal.chi2.toFixed(2)}</strong>
              &nbsp;·&nbsp; n = <strong>{topSignal.case_count}</strong> cases
            </p>
            <button
              onClick={() => setExplainTarget({ drug: topSignal.drug_name, event: topSignal.event_term })}
              className="mt-2 text-xs text-red-600 underline font-medium"
            >
              View full explanation →
            </button>
          </div>
        </div>
      )}

      {/* Summary stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Drugs Analysed" value={DRUGS.length} colour="blue" />
        <StatCard label="Total Signals" value={rankedSignals.length} colour={rankedSignals.length > 0 ? 'red' : 'gray'} />
        <StatCard label={`${selectedDrug} Events`} value={loading ? '…' : prrResults.length} colour="gray" />
        <StatCard label={`${selectedDrug} Signals`} value={loading ? '…' : signalCount} colour={signalCount > 0 ? 'red' : 'gray'} />
      </div>

      {/* Drug selector */}
      <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Select Drug to Analyse</p>
        <div className="flex flex-wrap gap-2">
          {DRUGS.map(drug => {
            const hasSignal = rankedSignals.some(s => s.drug_name === drug)
            return (
              <button
                key={drug}
                onClick={() => setSelectedDrug(drug)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors relative ${
                  selectedDrug === drug
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:text-blue-600'
                }`}
              >
                {drug}
                {hasSignal && selectedDrug !== drug && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500"></span>
                )}
              </button>
            )
          })}
          <span className="text-xs text-gray-400 self-center ml-1">
            Red dot = has a detected signal
          </span>
        </div>
      </div>

      {/* Results panel */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Panel header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50 flex-wrap gap-2">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              {selectedDrug} — Analysis Results
            </h2>
            {!loading && signalCount > 0 && (
              <p className="text-xs text-red-600 mt-0.5">
                {signalCount} signal{signalCount !== 1 ? 's' : ''} detected
                &nbsp;(PRR ≥ 2 · χ² ≥ 4 · n ≥ 3)
              </p>
            )}
            {!loading && signalCount === 0 && prrResults.length > 0 && (
              <p className="text-xs text-green-600 mt-0.5">
                No Evans-criteria signals detected for this drug
              </p>
            )}
          </div>
          {/* Tab switcher + cluster k selector */}
          <div className="flex items-center gap-2">
            {activeTab === 'clusters' && (
              <div className="flex items-center gap-1 text-xs text-gray-500 bg-white border border-gray-200 rounded-lg px-2 py-1">
                <span>k =</span>
                {[2, 3, 4, 5].map(k => (
                  <button
                    key={k}
                    onClick={() => setNClusters(k)}
                    className={`w-6 h-6 rounded text-xs font-semibold ${
                      nClusters === k ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {k}
                  </button>
                ))}
              </div>
            )}
            <div className="flex rounded-lg border border-gray-200 overflow-hidden text-sm bg-white">
              {[
                { id: 'table',    label: '📋 Table'    },
                { id: 'chart',    label: '📊 Chart'    },
                { id: 'clusters', label: '🔵 Clusters' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="p-5">
          {loading && (
            <div className="flex flex-col items-center py-10 gap-3">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-400 text-sm">Calculating PRR for {selectedDrug}…</p>
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700 flex items-start gap-3">
              <span className="text-lg">⚠️</span>
              <div>
                <p className="font-medium">Failed to load PRR results</p>
                <p className="text-xs mt-1 text-red-500">{error}</p>
                <button
                  onClick={() => loadPRR(selectedDrug)}
                  className="mt-2 text-xs underline text-red-600"
                >
                  Retry
                </button>
              </div>
            </div>
          )}
          {!loading && !error && activeTab === 'table' && (
            <>
              {prrResults.length === 0
                ? <EmptyState icon="📊" message="No results yet. Click Run Demo Analysis." />
                : <SignalTable
                    results={prrResults}
                    onSelect={row => setExplainTarget({ drug: row.drug_name, event: row.event_term })}
                  />
              }
            </>
          )}
          {!loading && !error && activeTab === 'chart' && (
            <PRRChart results={prrResults} />
          )}
          {activeTab === 'clusters' && (
            clusterLoading
              ? (
                <div className="flex flex-col items-center py-10 gap-3">
                  <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-gray-400 text-sm">Clustering adverse events…</p>
                </div>
              )
              : <ClusterView clusters={clusters} drugName={selectedDrug} />
          )}
        </div>
      </div>

      {/* Explain Panel */}
      {explainTarget && (
        <ExplainPanel
          drugName={explainTarget.drug}
          eventTerm={explainTarget.event}
          onClose={() => setExplainTarget(null)}
        />
      )}

      {/* All-drugs ranked signals */}
      {rankedSignals.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
            <h2 className="text-base font-semibold text-gray-900">
              All Drugs — Ranked Safety Signals
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Only Evans-criteria signals shown. Click a drug name to switch analysis, or click Explain for full details.
            </p>
          </div>
          <div className="p-5">
            <RankedTable
              signals={rankedSignals}
              onDrugClick={setSelectedDrug}
              onRowClick={s => setExplainTarget({ drug: s.drug_name, event: s.event_term })}
            />
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Helper components ──────────────────────────────────────────────────── */

function StatCard({ label, value, colour }) {
  const colours = {
    blue:  'border-blue-200 bg-blue-50 text-blue-700',
    red:   'border-red-200 bg-red-50 text-red-700',
    green: 'border-green-200 bg-green-50 text-green-700',
    gray:  'border-gray-200 bg-white text-gray-700',
  }
  const val = colours[colour] || colours.gray
  return (
    <div className={`rounded-xl border p-3 ${val}`}>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold`}>{value}</p>
    </div>
  )
}

function EmptyState({ icon, message }) {
  return (
    <div className="flex flex-col items-center py-10 gap-2 text-gray-400">
      <span className="text-4xl">{icon}</span>
      <p className="text-sm">{message}</p>
    </div>
  )
}

function RankedTable({ signals, onDrugClick, onRowClick }) {
  const strengthStyle = {
    High:   'bg-red-100 text-red-800 border-red-200',
    Medium: 'bg-orange-100 text-orange-800 border-orange-200',
    Low:    'bg-yellow-100 text-yellow-800 border-yellow-200',
    None:   'bg-gray-100 text-gray-500 border-gray-200',
  }
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            {['Rank', 'Drug', 'Adverse Event', 'SOC', 'PRR', 'χ²', 'Cases', 'Signal Strength', ''].map(h => (
              <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {signals.map((s, i) => (
            <tr key={`${s.drug_name}-${s.event_term}`} className="hover:bg-blue-50 transition-colors">
              <td className="px-3 py-2 text-gray-400 text-center font-mono text-xs">{i + 1}</td>
              <td className="px-3 py-2">
                <button onClick={() => onDrugClick(s.drug_name)} className="text-blue-600 hover:underline font-semibold">
                  {s.drug_name}
                </button>
              </td>
              <td className="px-3 py-2 font-medium text-gray-900">{s.event_term}</td>
              <td className="px-3 py-2 text-xs text-gray-400">{s.event_soc}</td>
              <td className="px-3 py-2 font-mono text-center font-bold text-red-600">{s.prr.toFixed(2)}</td>
              <td className="px-3 py-2 font-mono text-center text-gray-500">{s.chi2.toFixed(2)}</td>
              <td className="px-3 py-2 text-center text-gray-700">{s.case_count}</td>
              <td className="px-3 py-2">
                <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${strengthStyle[s.signal_strength] ?? strengthStyle.None}`}>
                  {s.signal_strength}
                </span>
              </td>
              <td className="px-3 py-2">
                <button onClick={() => onRowClick?.(s)} className="text-xs text-blue-500 hover:underline font-medium whitespace-nowrap">
                  Explain →
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
