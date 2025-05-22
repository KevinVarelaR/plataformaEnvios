"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { QrCode, Save, ArrowLeft } from "lucide-react"
import QRScanner from "../components/QRScanner"

export default function NewPaquete() {
  const navigate = useNavigate()
  const location = useLocation()
  const [mode, setMode] = useState("scan") // 'scan' o 'manual'
  const [scannedCode, setScannedCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    trackingNumber: "",
    client: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    notes: "",
  })

  useEffect(() => {
    // Verificar si hay un parámetro de escaneo en la URL
    const params = new URLSearchParams(location.search)
    const scanId = params.get("scan")

    if (scanId) {
      // Simular que se escaneó un código
      setScannedCode(`PKG${scanId}`)
      setMode("manual")

      // Simular carga de datos del paquete escaneado
      setLoading(true)
      setTimeout(() => {
        const mockData = {
          trackingNumber: `PKG00${scanId}`,
          client: "Cliente Ejemplo",
          phone: "123-456-7890",
          email: "cliente@ejemplo.com",
          address: "Calle Principal 123",
          city: "Ciudad Ejemplo",
          notes: "Notas de ejemplo",
        }
        setFormData(mockData)
        setLoading(false)
      }, 1000)
    }
  }, [location])

  const handleScan = (data) => {
    if (data) {
      setScannedCode(data)
      setMode("manual")

      // Aquí se podría hacer una petición para obtener datos del paquete escaneado
      // Por ahora, solo establecemos el número de tracking
      setFormData({
        ...formData,
        trackingNumber: data,
      })
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Simular envío de datos
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      // Redirigir a la lista de paquetes
      navigate("/paquetes")
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{scannedCode ? "Editar Paquete" : "Nuevo Paquete"}</h1>
        <button type="button" className="btn btn-secondary flex items-center" onClick={() => navigate("/paquetes")}>
          <ArrowLeft className="h-5 w-5 mr-2" />
          Volver
        </button>
      </div>

      {mode === "scan" ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center mb-6">
            <QrCode className="h-12 w-12 text-blue-600 mx-auto" />
            <h2 className="mt-2 text-lg font-medium text-gray-900">Escanear Código QR</h2>
            <p className="mt-1 text-sm text-gray-500">Apunta la cámara al código QR del paquete para registrarlo</p>
          </div>

          <QRScanner onScan={handleScan} />

          <div className="mt-6 text-center">
            <button type="button" className="btn btn-secondary" onClick={() => setMode("manual")}>
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
                <div>
                  <label htmlFor="trackingNumber" className="block text-sm font-medium text-gray-700">
                    Número de Tracking
                  </label>
                  <input
                    type="text"
                    id="trackingNumber"
                    name="trackingNumber"
                    className="form-input mt-1"
                    value={formData.trackingNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="client" className="block text-sm font-medium text-gray-700">
                    Cliente
                  </label>
                  <input
                    type="text"
                    id="client"
                    name="client"
                    className="form-input mt-1"
                    value={formData.client}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="form-input mt-1"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-input mt-1"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Dirección
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    className="form-input mt-1"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    className="form-input mt-1"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                    Notas
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    className="form-input mt-1"
                    value={formData.notes}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setMode("scan")
                    setScannedCode("")
                    setFormData({
                      trackingNumber: "",
                      client: "",
                      phone: "",
                      email: "",
                      address: "",
                      city: "",
                      notes: "",
                    })
                  }}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary flex items-center" disabled={loading}>
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
