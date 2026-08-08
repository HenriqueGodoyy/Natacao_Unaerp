import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import AnaliseComparativa from './pages/AnaliseComparativa'
import AnaliseIndividual from './pages/AnaliseIndividual'
import GerenciarAtletas from './pages/GerenciarAtletas'
import PerfilAtleta from './pages/PerfilAtleta'
import LancarResultados from './pages/LancarResultados'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<AnaliseComparativa />} />
          <Route
            path="/analise-individual"
            element={<AnaliseIndividual />}
          />
          <Route path="/atletas" element={<GerenciarAtletas />} />
          <Route path="/atletas/:id" element={<PerfilAtleta />} />
          <Route path="/lancar" element={<LancarResultados />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App