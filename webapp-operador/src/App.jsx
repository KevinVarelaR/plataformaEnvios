"use client"

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useState } from "react"
import Header from "./components/Header"
import Sidebar from "./components/Sidebar"
import PaquetesList from "./pages/PaquetesList"
import NewPaquete from "./pages/NewPaquete"
import PaqueteDetail from "./pages/PaqueteDetail"
import Rutas from "./pages/Rutas"
import Entregas from "./pages/Entregas"

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

        <div className="flex flex-col flex-1 overflow-hidden">
          <Header setSidebarOpen={setSidebarOpen} />

          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <Routes>
              <Route path="/" element={<PaquetesList />} />
              <Route path="/paquetes" element={<PaquetesList />} />
              <Route path="/paquetes/nuevo" element={<NewPaquete />} />
              <Route path="/paquetes/:id" element={<PaqueteDetail />} />
              <Route path="/rutas" element={<Rutas />} />
              <Route path="/entregas" element={<Entregas />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  )
}

export default App
