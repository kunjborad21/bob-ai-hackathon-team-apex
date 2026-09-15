import { useState, useEffect } from 'react'
import { explainSignal } from '../api/signalsApi.js'

/**
 * ExplainPanel — fetches and displays an explainability report for a
 * selected drug-event pair.
 *
 * Props:
 *   drugName   — pre-selected drug (string)
 *   eventTerm  — pre-selected event (string | null)
 *   onClose    — callback to dismiss the panel
 */
export default function ExplainPanel({ drugName, eventTerm, onClose }) {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  // Fetch whenever drugName or eventTerm changes (proper effect, not render-phase side-effect)
  useEffect(() => {
    if (!drugName || !eventTerm) return
    setData(null)
    setLoading(true)
    setError(null)
    explainSignal(drugName, eventTerm)
      .then(d => { setData(d); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [drugName, eventTerm])

  const signalColour = data?.is_signal
    ? { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' }
    : { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            🔎 Signal Explanation
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {drugName} · {eventTerm || '—'}
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg leading-none"
            aria-label="Close"
          >
            ×
          </button>
        )}
      </div>

      <div className="p-4 space-y-4">
        {loading && (
          <p className="text-gray-400 text-sm text-center py-4">Loading explanation…</p>
        )}
        {error && (
          <p className="text-red-500 text-sm text-center py-4">Error: {error}</p>
        )}

        {data && !loading && (
          <>
            {/* Signal verdict banner */}
            <div className={`rounded-lg border px-4 py-3 ${signalColour.bg} ${signalColour.border}`}>
              <p className={`text-sm font-semibold ${signalColour.text}`}>
                {data.is_signal
                  ? `⚠️ Potential Signal Detected — ${data.signal_strength} Strength`
                  : '✅ No Signal Detected Under Evans Criteria'}
              </p>
            </div>

            {/* Key stats row */}
            <div className="grid grid-cols-3 gap-3">
              <StatBox label="PRR" value={data.prr.toFixed(3)}
                highlight={data.prr >= 2} />
              <StatBox label="χ² statistic" value={data.chi2.toFixed(3)}
                highlight={data.chi2 >= 4} />
              <StatBox label="Case count (n)" value={data.case_count}
                highlight={data.case_count >= 3} />
            </div>

            {/* Rate comparison */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Reporting Rate Comparison
              </p>
              <RateBar
                label={`${drugName}`}
                pct={data.drug_rate_pct}
                colour="bg-red-400"
              />
              <RateBar
                label="All other drugs"
                pct={data.background_rate_pct}
                colour="bg-gray-300"
              />
            </div>

            {/* Evans criteria checklist */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Evans Signal Criteria
              </p>
              <div className="space-y-1">
                <CriterionRow label="PRR ≥ 2.0"  met={data.prr >= 2}           value={`PRR = ${data.prr.toFixed(3)}`} />
                <CriterionRow label="χ² ≥ 4.0"   met={data.chi2 >= 4}          value={`χ² = ${data.chi2.toFixed(3)}`} />
                <CriterionRow label="n ≥ 3 cases" met={data.case_count >= 3}   value={`n = ${data.case_count}`} />
              </div>
            </div>

            {/* Natural-language explanation */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">
                AI-Assisted Explanation
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">{data.explanation}</p>
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded p-2 leading-relaxed">
              ⚠️ {data.disclaimer}
            </p>
          </>
        )}
      </div>
    </div>
  )
}

function StatBox({ label, value, highlight }) {
  return (
    <div className={`rounded-lg border p-3 text-center ${
      highlight ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'
    }`}>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-lg font-bold font-mono ${highlight ? 'text-red-600' : 'text-gray-700'}`}>
        {value}
      </p>
    </div>
  )
}

function RateBar({ label, pct, colour }) {
  const safePct = pct ?? 0
  const width = Math.min(100, safePct * 4)   // scale: 25% rate → full bar
  return (
    <div className="mb-2">
      <div className="flex justify-between text-xs text-gray-600 mb-0.5">
        <span>{label}</span>
        <span className="font-mono font-medium">{pct != null ? `${safePct}%` : 'N/A'}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${colour}`}
          style={{ width: `${Math.max(2, width)}%` }}
        />
      </div>
    </div>
  )
}

function CriterionRow({ label, met, value }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="flex items-center gap-2">
        <span className={met ? 'text-green-500' : 'text-red-400'}>
          {met ? '✓' : '✗'}
        </span>
        <span className={met ? 'text-gray-800' : 'text-gray-400'}>{label}</span>
      </span>
      <span className={`font-mono text-xs ${met ? 'text-gray-600' : 'text-gray-400'}`}>
        {value}
      </span>
    </div>
  )
}
