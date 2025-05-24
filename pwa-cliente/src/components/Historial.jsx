import React, { useEffect, useState } from "react";

const Historial = () => {
  const [envios, setEnvios] = useState([]);
  const [saldo, setSaldo] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulación de llamada al backend para obtener historial y saldo
    async function fetchHistorial() {
      setLoading(true);
      setError(null);
      try {
        // Ejemplo con fetch o axios
        // const res = await fetch("/api/clientes/historial");
        // const data = await res.json();

        // Simulación:
        const data = {
          saldo: 15000,
          envios: [
            {
              id: "ENV123",
              fecha: "2025-05-10",
              origen: "San José",
              destino: "Alajuela",
              estado: "Entregado",
            },
            {
              id: "ENV124",
              fecha: "2025-05-15",
              origen: "San José",
              destino: "Cartago",
              estado: "En tránsito",
            },
          ],
        };

        setEnvios(data.envios);
        setSaldo(data.saldo);
      } catch (err) {
        setError("Error al cargar historial.");
      } finally {
        setLoading(false);
      }
    }

    fetchHistorial();
  }, []);

  if (loading) return <div className="p-4 text-center">Cargando historial...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Historial de envíos</h2>
      <p className="mb-6 font-medium">Saldo disponible: ₡{saldo}</p>

      {envios.length === 0 ? (
        <p>No hay envíos registrados.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2 text-left">ID</th>
              <th className="border border-gray-300 p-2 text-left">Fecha</th>
              <th className="border border-gray-300 p-2 text-left">Origen</th>
              <th className="border border-gray-300 p-2 text-left">Destino</th>
              <th className="border border-gray-300 p-2 text-left">Estado</th>
            </tr>
          </thead>
          <tbody>
            {envios.map((envio) => (
              <tr key={envio.id} className="hover:bg-gray-100">
                <td className="border border-gray-300 p-2">{envio.id}</td>
                <td className="border border-gray-300 p-2">{envio.fecha}</td>
                <td className="border border-gray-300 p-2">{envio.origen}</td>
                <td className="border border-gray-300 p-2">{envio.destino}</td>
                <td className="border border-gray-300 p-2">{envio.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Historial;