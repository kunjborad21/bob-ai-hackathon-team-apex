/**
 * Badge — colour-coded signal strength pill.
 * strength: "High" | "Medium" | "Low" | "None"
 */
const COLOURS = {
  High:   "bg-red-100 text-red-800 border-red-200",
  Medium: "bg-orange-100 text-orange-800 border-orange-200",
  Low:    "bg-yellow-100 text-yellow-800 border-yellow-200",
  None:   "bg-gray-100 text-gray-500 border-gray-200",
}

export default function Badge({ label }) {
  const cls = COLOURS[label] ?? COLOURS.None
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${cls}`}>
      {label}
    </span>
  )
}
