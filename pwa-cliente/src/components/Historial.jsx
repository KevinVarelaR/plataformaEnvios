import React, { useState, useEffect } from "react";

const Historial = () => {
  // Estados simulados
  const [saldoActual, setSaldoActual] = useState(150.75);
  const [creditoDisponible, setCreditoDisponible] = useState(500);
  const [totalGastado, setTotalGastado] = useState(0);

  const [envios, setEnvios] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");

  useEffect(() => {
    // Simular carga de envíos
    setEnvios([
      // Ejemplo de envíos (puedes agregar más)
      { id: "ENV001", codigo: "ENV-2024-001", destinatario: "Juan Perez", direccion: "San José", estado: "Entregado" },
      { id: "ENV002", codigo: "ENV-2024-002", destinatario: "Maria Lopez", direccion: "Alajuela", estado: "En tránsito" },
    ]);
  }, []);

  // Filtrar envíos
  const enviosFiltrados = envios.filter((envio) => {
    const textoFiltro = filtro.toLowerCase();
    const coincideFiltro =
      envio.codigo.toLowerCase().includes(textoFiltro) ||
      envio.destinatario.toLowerCase().includes(textoFiltro) ||
      envio.direccion.toLowerCase().includes(textoFiltro);

    const coincideEstado = estadoFiltro === "Todos" || envio.estado === estadoFiltro;

    return coincideFiltro && coincideEstado;
  });

  const estados = ["Todos", "Entregado", "En tránsito", "Pendiente"];

  return (
    <div className="container mt-5">
      <h2 className="mb-1 text-center">Historial y Saldo</h2>
      <p className="text-center mb-4 text-muted">Revisa tus envíos anteriores y gestiona tu saldo</p>

      <div className="d-flex justify-content-around mb-4 flex-wrap gap-3">
        <div className="card p-3 flex-fill" style={{ maxWidth: "220px" }}>
          <div className="d-flex align-items-center gap-2 mb-2">
            <span className="fs-3 text-success">$</span>
            <h5 className="mb-0">Saldo Actual</h5>
          </div>
          <p className="fs-4 fw-bold text-success">{saldoActual.toFixed(2)} €</p>
        </div>
        <div className="card p-3 flex-fill" style={{ maxWidth: "220px" }}>
          <div className="d-flex align-items-center gap-2 mb-2">
            <span className="fs-3 text-primary">$</span>
            <h5 className="mb-0">Crédito Disponible</h5>
          </div>
          <p className="fs-4 fw-bold text-primary">{creditoDisponible.toFixed(2)} €</p>
        </div>
        <div className="card p-3 flex-fill" style={{ maxWidth: "220px" }}>
          <div className="d-flex align-items-center gap-2 mb-2">
            <span className="fs-3 text-purple">$</span>
            <h5 className="mb-0">Total Gastado</h5>
          </div>
          <p className="fs-4 fw-bold text-purple">{totalGastado.toFixed(2)} €</p>
          <small className="text-muted">Última recarga: 15 ene 2024</small>
        </div>
      </div>

      <div className="card p-4 shadow-sm">
        <h5 className="mb-3 d-flex align-items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            fill="#000"
            viewBox="0 0 16 16"
            className="bi bi-clock-history"
          >
            <path d="M8.515 3.725a.5.5 0 0 0-1.03 0v5.75a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8.515 8.57V3.725z" />
            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z" />
          </svg>
          Historial de Envíos
        </h5>

        <div className="row mb-3 g-3">
          <div className="col-md-8">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por código, destinatario o dirección..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value)}
            >
              {estados.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </div>
        </div>

        {enviosFiltrados.length === 0 ? (
          <div className="text-center text-muted p-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="50"
              height="50"
              fill="currentColor"
              className="bi bi-box"
              viewBox="0 0 16 16"
            >
              <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5l-.5.2v8.663l.5.2 5.968 2.585a.5.5 0 0 0 .372 0l5.967-2.585.5-.2V3.7l-.5-.2-5.967-2.585zM8 2.294 14.333 4.7 8 7.159 1.667 4.7 8 2.294zM2 4.82v7.849l5.972 2.586V7.43L2 4.82zm6.972 10.435 5.972-2.586V4.82l-5.972 2.609v7.806z" />
            </svg>
            <p className="mt-3 fs-5">No se encontraron envíos con los filtros aplicados</p>
          </div>
        ) : (
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Código</th>
                <th>Destinatario</th>
                <th>Dirección</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {enviosFiltrados.map((envio) => (
                <tr key={envio.id}>
                  <td>{envio.codigo}</td>
                  <td>{envio.destinatario}</td>
                  <td>{envio.direccion}</td>
                  <td>{envio.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Historial;