
// src/pages/NewPaquete.jsx
"use client"
import React from "react"
import { QrCode, Save, ArrowLeft } from "lucide-react"
import QRScanner from "../components/QRScanner"
import { useNewPaquete } from "../hooks/useNewPaquete"
import { Link } from "react-router-dom"

export default function NewPaquete() {
  const {
    mode,
    scannedCode,
    loading,
    error,
    formData,
    setMode,
    handleScan,
    handleInputChange,
    resetForm,
    handleSubmit,
  } = useNewPaquete()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {scannedCode ? "Editar Paquete" : "Nuevo Paquete"}
        </h1>
        <Link to="/paquetes" className="btn btn-secondary flex items-center">
          <ArrowLeft className="h-5 w-5 mr-2" /> Volver
        </Link>
      </div>

      {/* Escaneo vs Manual */}
      {mode === "scan" ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center mb-6">
            <QrCode className="h-12 w-12 text-blue-600 mx-auto" />
            <h2 className="mt-2 text-lg font-medium text-gray-900">Escanear Código QR</h2>
            <p className="mt-1 text-sm text-gray-500">
              Apunta la cámara al código QR del paquete para registrarlo
            </p>
          </div>
          <QRScanner onScan={handleScan} />
          <div className="mt-6 text-center">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setMode("manual")}
            >
              Ingresar datos manualmente
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          {loading ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-500">Cargando datos del paquete...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {scannedCode && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex items-start">
                  <QrCode className="h-5 w-5 text-blue-500 mt-0.5 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-blue-800">Código escaneado</h3>
                    <p className="mt-1 text-sm text-blue-700">{scannedCode}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Campos del formulario */}
                {Object.entries(formData).map(([key, value]) => (
                  <div key={key} className={key === 'address' || key === 'notes' ? 'md:col-span-2' : ''}>
                    <label htmlFor={key} className="block text-sm font-medium text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    {key === 'notes' ? (
                      <textarea
                        id={key}
                        name={key}
                        rows={3}
                        className="form-input mt-1"
                        value={value}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <input
                        type={key === 'email' ? 'email' : 'text'}
                        id={key}
                        name={key}
                        className="form-input mt-1"
                        value={value}
                        onChange={handleInputChange}
                        required={['trackingNumber','client','address','city'].includes(key)}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={resetForm}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex items-center"
                  disabled={loading}
                >
                  <Save className="h-5 w-5 mr-2" />
                  {scannedCode ? "Actualizar Paquete" : "Registrar Paquete"}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  )
}
