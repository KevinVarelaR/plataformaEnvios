import React, { useState } from "react";

const EstadoEnvio = () => {
  const [codigo, setCodigo] = useState("");
  const [estado, setEstado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleConsulta = async (e) => {
    e.preventDefault();
    setEstado(null);
    setError(null);

    if (!codigo.trim()) {
      setError("Por favor ingrese un código de envío.");
      return;
    }

    setLoading(true);

    try {
      // Aquí la llamada al backend para consultar estado por código
      // Ejemplo con fetch:
      // const res = await fetch(`/api/envios/${codigo}`);
      // const data = await res.json();

      // Simulación:
      const data = {
        estado: "En tránsito",
        fechaActualizacion: "2025-05-23",
      };

      setEstado(data);
    } catch (err) {
      setError("No se encontró el envío o error en la consulta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Consultar estado de envío</h2>
      <form onSubmit={handleConsulta}>
        <input
          type="text"
          placeholder="Ingrese código de envío"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Consultando..." : "Consultar"}
        </button>
      </form>

      {error && <div className="text-red-600 mt-4">{error}</div>}

      {estado && (
        <div className="mt-4 p-4 border border-green-300 rounded bg-green-100">
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