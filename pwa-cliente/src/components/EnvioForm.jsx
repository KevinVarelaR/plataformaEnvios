import React, { useState } from "react";

const EnvioForm = () => {
  const [form, setForm] = useState({
    remitente: "",
    destinatario: "",
    direccionOrigen: "",
    direccionDestino: "",
    telefono: "",
    peso: "",
    descripcion: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validación básica
    const requiredFields = [
      "remitente",
      "destinatario",
      "direccionOrigen",
      "direccionDestino",
      "telefono",
      "peso",
    ];
    for (let field of requiredFields) {
      if (!form[field]) {
        setError("Por favor completa todos los campos obligatorios.");
        return;
      }
    }

    setLoading(true);

    // Simulación de envío
    setTimeout(() => {
      setSuccess("¡Envío registrado correctamente!");
      setLoading(false);
      setForm({
        remitente: "",
        destinatario: "",
        direccionOrigen: "",
        direccionDestino: "",
        telefono: "",
        peso: "",
        descripcion: "",
      });
    }, 1200);
  };

  return (
    <div className="card p-4 shadow-sm mx-auto" style={{ maxWidth: "580px" }}>
        <div className="d-flex align-items-center justify-content-center mb-4 gap-3">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                fill="#0d6efd"
                viewBox="0 0 16 16"
                className="me-2"
                >
                <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1l-8 5-8-5V4z" />
                <path d="M0 6.5l6.5 4.5-6.5 4.5v-9zM16 6.5v9l-6.5-4.5L16 6.5z" />
            </svg>
            <h3 className="mb-0">Registrar nuevo envío</h3>
        </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <label className="form-label">
              Remitente <span className="text-danger">*</span>
            </label>
            <input
              name="remitente"
              type="text"
              className="form-control"
              placeholder="Nombre del remitente"
              value={form.remitente}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">
              Destinatario <span className="text-danger">*</span>
            </label>
            <input
              name="destinatario"
              type="text"
              className="form-control"
              placeholder="Nombre del destinatario"
              value={form.destinatario}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">
            Dirección de Origen <span className="text-danger">*</span>
          </label>
          <input
            name="direccionOrigen"
            type="text"
            className="form-control"
            placeholder="Dirección completa de origen"
            value={form.direccionOrigen}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">
            Dirección de Destino <span className="text-danger">*</span>
          </label>
          <input
            name="direccionDestino"
            type="text"
            className="form-control"
            placeholder="Dirección completa de destino"
            value={form.direccionDestino}
            onChange={handleChange}
          />
        </div>

        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <label className="form-label">
              Teléfono <span className="text-danger">*</span>
            </label>
            <input
              name="telefono"
              type="text"
              className="form-control"
              placeholder="1234567890"
              value={form.telefono}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">
              Peso (kg) <span className="text-danger">*</span>
            </label>
            <input
              name="peso"
              type="number"
              step="0.01"
              className="form-control"
              placeholder="1.5"
              value={form.peso}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label">Descripción del Contenido (opcional)</label>
          <textarea
            name="descripcion"
            className="form-control"
            rows="3"
            placeholder="Describe brevemente el contenido del paquete"
            value={form.descripcion}
            onChange={handleChange}
          ></textarea>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? "Registrando..." : "Registrar Envío"}
        </button>
      </form>
    </div>
  );
};

export default EnvioForm;