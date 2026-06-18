import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import AnaliseComparativa from './pages/AnaliseComparativa'
import AnaliseIndividual from './pages/AnaliseIndividual'

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
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App