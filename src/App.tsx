import { HashRouter, Route, Routes } from 'react-router-dom'
import { LandingPage } from './pages/LandingPage'
import { ExitoPage } from './pages/ExitoPage'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/exito/:planId/:periodicidad" element={<ExitoPage />} />
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </HashRouter>
  )
}
