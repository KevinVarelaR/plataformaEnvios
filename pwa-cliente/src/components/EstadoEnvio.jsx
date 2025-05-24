import React, { useState } from "react";

const EstadoEnvio = () => {
  const [codigo, setCodigo] = useState("");
  const [estado, setEstado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const consultarEstado = (e) => {
    e.preventDefault();
    setEstado(null);
    setError(null);

    if (!codigo.trim()) {
      setError("Por favor ingrese un código válido.");
      return;
    }

    setLoading(true);

    // Simulación de consulta a backend
    setTimeout(() => {
      setEstado({
        codigo,
        estado: "En tránsito",
        fechaActualizacion: "2025-05-23",
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="card p-4 shadow-sm">
      <h2 className="mb-3">Consultar estado de envío</h2>
      <form onSubmit={consultarEstado}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Ingrese código de envío"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Consultando..." : "Consultar"}
        </button>
      </form>
      {error && <div className="alert alert-danger mt-3">{error}</div>}
      {estado && (
        <div className="alert alert-success mt-3">
          <p><strong>Código:</strong> {estado.codigo}</p>
          <p><strong>Estado:</strong> {estado.estado}</p>
          <p><strong>Última actualización:</strong> {estado.fechaActualizacion}</p>
        </div>
      )}
    </div>
  );
};

export default EstadoEnvio;