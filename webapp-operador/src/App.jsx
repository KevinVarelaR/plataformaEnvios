import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Sidebar      from "./components/Sidebar"
import Header       from "./components/Header"
import PaquetesList from "./pages/PaquetesList"
import NewPaquete   from "./pages/NewPaquete"
import PaqueteDetail from "./pages/PaqueteDetail"
import Rutas        from "./pages/Rutas"
import Entregas     from "./pages/Entregas"

export default function App() {
  console.log("🔔 App montado correctamente")
  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />

        {/* Empuja el contenido a la derecha para dejar espacio al sidebar */}
        <div className="flex flex-col flex-1 overflow-hidden md:ml-64">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <Routes>
              <Route path="/" element={<PaquetesList />} />
              <Route path="/paquetes" element={<PaquetesList />} />
              <Route path="/paquetes/nuevo" element={<NewPaquete />} />
              <Route path="/paquetes/:id" element={<PaqueteDetail />} />
              <Route path="/rutas" element={<Rutas />} />
              <Route path="/entregas" element={<Entregas />} />
              <Route path="*" element={<p className="p-4">Página no encontrada</p>} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  )
}

