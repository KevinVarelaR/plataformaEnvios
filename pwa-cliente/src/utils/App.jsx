import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "../components/Header";
import Registro from "../pages/Registro";
import Consulta from "../pages/Consulta";
import HistorialSaldo from "../pages/HistorialSaldo";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Registro />} />
            <Route path="/consulta" element={<Consulta />} />
            <Route path="/historial" element={<HistorialSaldo />} />
          </Routes>
        </main>
        <footer className="bg-blue-600 text-white text-center p-4">
          © 2025 Sistema de Envíos
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;