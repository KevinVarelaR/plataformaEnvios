import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Registro from "./pages/Registro";
import Consulta from "./pages/Consulta";
import HistorialPage from "./pages/Historial";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Registro />} />
        <Route path="/consulta" element={<Consulta />} />
        <Route path="/historial" element={<HistorialPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;