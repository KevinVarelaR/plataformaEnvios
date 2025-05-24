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
      setError("Por favor ingresa un código válido.");
      return;
    }

    setLoading(true);

    // Simulación de consulta
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
      <h4 className="mb-3 d-flex align-items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="#0d6efd"
          viewBox="0 0 16 16"
          className="bi bi-search"
        >
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85zm-5.242 1.104a5 5 0 1 1 0-10 5 5 0 0 1 0 10z" />
        </svg>
        Consultar con código
      </h4>
      <form onSubmit={consultarEstado}>
        <div className="mb-3">
          <label htmlFor="codigoEnvio" className="form-label">
            Código de Envío
          </label>
          <input
            id="codigoEnvio"
            type="text"
            className="form-control"
            placeholder="Ej: ENV-2024-001"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary w-100 d-flex justify-content-center align-items-center gap-2"
          disabled={loading}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-search"
            viewBox="0 0 16 16"
          >
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85zm-5.242 1.104a5 5 0 1 1 0-10 5 5 0 0 1 0 10z" />
          </svg>
          {loading ? "Consultando..." : "Consultar"}
        </button>
      </form>

      {error && <div className="alert alert-danger mt-3">{error}</div>}

      {estado && (
        <div className="alert alert-success mt-3">
          <p>
            <strong>Código:</strong> {estado.codigo}
          </p>
          <p>
            <strong>Estado:</strong> {estado.estado}
          </p>
          <p>
            <strong>Última actualización:</strong> {estado.fechaActualizacion}
          </p>
        </div>
      )}
    </div>
  );
};

export default EstadoEnvio;