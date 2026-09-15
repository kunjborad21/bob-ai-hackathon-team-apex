import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import DisclaimerBanner from '../components/DisclaimerBanner.jsx'

export default function Layout() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const onDashboard = location.pathname === '/'

  const navClass = ({ isActive }) =>
    `px-4 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-blue-600 text-white'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Dismissible prototype disclaimer */}
      <DisclaimerBanner />

      {/* Top navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">

            {/* Logo — always navigates home */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
            >
              <span className="text-blue-600 font-bold text-lg leading-none">Pharma</span>
              <span className="text-gray-900 font-bold text-lg leading-none">Guard</span>
              <span className="text-blue-400 font-light text-lg leading-none">AI</span>
              <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 border border-yellow-200 px-2 py-0.5 rounded-full font-medium">
                Demo
              </span>
            </button>

            {/* Nav links */}
            <nav className="flex items-center gap-1">
              {!onDashboard && (
                <button
                  onClick={() => navigate('/')}
                  className="px-3 py-2 rounded-md text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors mr-1"
                >
                  ← Dashboard
                </button>
              )}
              <NavLink to="/signals" className={navClass}>
                🔍 Signal Detection
              </NavLink>
              <NavLink to="/dossier" className={navClass}>
                📋 Submission Readiness
              </NavLink>
            </nav>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-xs text-gray-400 flex justify-between items-center">
          <span>PharmaGuard AI — IBM Bob AI Hackathon Prototype</span>
          <span className="text-gray-300">·</span>
          <span>All data is synthetic. Not for clinical use.</span>
        </div>
      </footer>
    </div>
  )
}
