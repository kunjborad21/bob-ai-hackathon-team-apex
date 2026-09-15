import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './shared/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import SignalDetection from './pages/SignalDetection.jsx'
import SubmissionReadiness from './pages/SubmissionReadiness.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="signals" element={<SignalDetection />} />
          <Route path="dossier" element={<SubmissionReadiness />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
