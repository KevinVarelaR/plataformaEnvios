import React, { useEffect, useState } from "react";

const Historial = () => {
  const [envios, setEnvios] = useState([]);
  const [saldo, setSaldo] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulación de llamada al backend
    setTimeout(() => {
      setEnvios([
        { id: "ENV123", fecha: "2025-05-10", origen: "San José", destino: "Alajuela", estado: "Entregado" },
        { id: "ENV124", fecha: "2025-05-15", origen: "San José", destino: "Cartago", estado: "En tránsito" },
      ]);
      setSaldo(15000);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) return <div>Cargando historial...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="card p-4 shadow-sm">
      <h2 className="mb-3">Historial de envíos</h2>
      <p><strong>Saldo disponible:</strong> ₡{saldo}</p>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Origen</th>
            <th>Destino</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {envios.map((envio) => (
            <tr key={envio.id}>
              <td>{envio.id}</td>
              <td>{envio.fecha}</td>
              <td>{envio.origen}</td>
              <td>{envio.destino}</td>
              <td>{envio.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Historial;