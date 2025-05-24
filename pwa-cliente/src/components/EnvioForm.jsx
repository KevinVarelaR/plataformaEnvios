import React, { useState } from "react";

const EnvioForm = () => {
  const [origen, setOrigen] = useState("");
  const [destino, setDestino] = useState("");
  const [contacto, setContacto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!origen || !destino || !contacto) {
      setError("Por favor complete todos los campos obligatorios.");
      return;
    }

    setLoading(true);

    try {
      // Aquí va la llamada a backend, ejemplo con fetch o axios
      // await api.post('/envios', { origen, destino, contacto, descripcion });

      // Simulación de éxito
      setSuccessMsg("Envío registrado con éxito.");
      setOrigen("");
      setDestino("");
      setContacto("");
      setDescripcion("");
    } catch (err) {
      setError("Error al registrar el envío. Intente más tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Registrar nuevo envío</h2>

      {error && <div className="bg-red-200 text-red-800 p-2 mb-4 rounded">{error}</div>}
      {successMsg && <div className="bg-green-200 text-green-800 p-2 mb-4 rounded">{successMsg}</div>}

      <label className="block mb-2 font-medium">Dirección de origen*</label>
      <input
        type="text"
        value={origen}
        onChange={(e) => setOrigen(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-4"
        required
      />

      <label className="block mb-2 font-medium">Dirección de destino*</label>
      <input
        type="text"
        value={destino}
        onChange={(e) => setDestino(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-4"
        required
      />

      <label className="block mb-2 font-medium">Contacto (teléfono o correo)*</label>
      <input
        type="text"
        value={contacto}
        onChange={(e) => setContacto(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-4"
        required
      />

      <label className="block mb-2 font-medium">Descripción (opcional)</label>
      <textarea
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-4"
        rows={3}
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Registrando..." : "Registrar envío"}
      </button>
    </form>
  );
};

export default EnvioForm;