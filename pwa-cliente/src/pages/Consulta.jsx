import React from "react";
import EstadoEnvio from "../components/EstadoEnvio";

const Consulta = () => (
  <div className="container mt-5 d-flex justify-content-center">
    <div style={{ maxWidth: "480px", width: "100%" }}>
      <h2 className="text-center mb-2">Consultar Estado del Envío</h2>
      <p className="text-center text-muted mb-4">
        Ingresa el código de tu envío para conocer su estado actual
      </p>
      <EstadoEnvio />
    </div>
  </div>
);

export default Consulta;