/**
 * DisclaimerBanner — persistent top-of-page disclaimer.
 * Can be dismissed for the session (stored in sessionStorage).
 */
import { useState } from 'react'

export default function DisclaimerBanner() {
  const [dismissed, setDismissed] = useState(
    () => sessionStorage.getItem('disclaimer_dismissed') === 'true'
  )

  if (dismissed) return null

  const dismiss = () => {
    sessionStorage.setItem('disclaimer_dismissed', 'true')
    setDismissed(true)
  }

  return (
    <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2 text-xs text-yellow-800 flex items-center justify-between gap-4">
      <span>
        <strong>Research Prototype:</strong> All data is entirely synthetic. Results are statistical
        associations only and must not be used for clinical, regulatory, or diagnostic decisions.
        This application was built for the IBM Bob AI Hackathon using demo data.
      </span>
      <button
        onClick={dismiss}
        className="flex-shrink-0 text-yellow-600 hover:text-yellow-800 font-medium underline text-xs"
      >
        Dismiss
      </button>
    </div>
  )
}
