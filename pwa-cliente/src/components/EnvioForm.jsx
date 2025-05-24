import React, { useState } from "react";

const EnvioForm = () => {
  const [origen, setOrigen] = useState("");
  const [destino, setDestino] = useState("");
  const [contacto, setContacto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!origen || !destino || !contacto) {
      setError("Complete todos los campos obligatorios.");
      return;
    }

    setLoading(true);

    // Aquí iría la llamada a API, por ahora simulamos éxito
    setTimeout(() => {
      setSuccess("Envío registrado exitosamente.");
      setLoading(false);
      setOrigen("");
      setDestino("");
      setContacto("");
      setDescripcion("");
    }, 1000);
  };

  return (
    <div className="card p-4 shadow-sm">
      <h2 className="mb-3">Registrar nuevo envío</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Dirección de origen *</label>
          <input
            type="text"
            className="form-control"
            value={origen}
            onChange={(e) => setOrigen(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Dirección de destino *</label>
          <input
            type="text"
            className="form-control"
            value={destino}
            onChange={(e) => setDestino(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Contacto (teléfono o correo) *</label>
          <input
            type="text"
            className="form-control"
            value={contacto}
            onChange={(e) => setContacto(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Descripción (opcional)</label>
          <textarea
            className="form-control"
            rows="3"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          ></textarea>
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? "Registrando..." : "Registrar envío"}
        </button>
      </form>
    </div>
  );
};

export default EnvioForm;