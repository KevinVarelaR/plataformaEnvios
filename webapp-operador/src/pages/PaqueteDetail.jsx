"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { Package, MapPin, Phone, Mail, Clock, ArrowLeft, Edit, QrCode } from "lucide-react"

// Datos de ejemplo
const mockPaquete = {
  id: "1",
  trackingNumber: "PKG001",
  client: "Juan Pérez",
  phone: "123-456-7890",
  email: "juan@ejemplo.com",
  address: "Calle 123, Ciudad",
  city: "Ciudad Ejemplo",
  status: "En tránsito",
  createdAt: "2023-05-15T10:30:00Z",
  notes: "Entregar en horario de oficina",
  scans: [
    {
      id: "1",
      location: "Centro de distribución",
      status: "Recibido",
      timestamp: "2023-05-15T10:30:00Z",
      operator: "Operador 1",
    },
    { id: "2", location: "En ruta", status: "En tránsito", timestamp: "2023-05-16T08:45:00Z", operator: "Mensajero 3" },
    {
      id: "3",
      location: "Sucursal Norte",
      status: "En tránsito",
      timestamp: "2023-05-16T14:20:00Z",
      operator: "Operador 2",
    },
  ],
}

export default function PaqueteDetail() {
  const { id } = useParams()
  const [paquete, setPaquete] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setPaquete(mockPaquete)
      setLoading(false)
    }, 500)
  }, [id])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("es", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Entregado":
        return "bg-green-100 text-green-800"
      case "En tránsito":
        return "bg-blue-100 text-blue-800"
      case "Recibido":
        return "bg-purple-100 text-purple-800"
      case "Pendiente":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-500">Cargando detalles del paquete...</p>
      </div>
    )
  }

  if (!paquete) {
    return (
      <div className="text-center py-10 bg-white rounded-lg shadow">
        <Package className="h-12 w-12 text-gray-400 mx-auto" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Paquete no encontrado</h3>
        <p className="mt-1 text-sm text-gray-500">No se encontró el paquete con ID: {id}</p>
        <div className="mt-6">
          <Link to="/paquetes" className="btn btn-primary">
            Volver a la lista
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Detalle de Paquete</h1>
        <Link to="/paquetes" className="btn btn-secondary flex items-center">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Volver
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div className="flex items-center mb-4 md:mb-0">
              <Package className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">{paquete.trackingNumber}</h2>
                <p className="text-sm text-gray-500">Creado el {formatDate(paquete.createdAt)}</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(paquete.status)}`}>
                {paquete.status}
              </span>
              <Link to={`/paquetes/nuevo?scan=${paquete.id}`} className="btn btn-secondary flex items-center">
                <Edit className="h-5 w-5 mr-2" />
                Editar
              </Link>
              <Link to={`/paquetes/nuevo?scan=${paquete.id}`} className="btn btn-primary flex items-center">
                <QrCode className="h-5 w-5 mr-2" />
                Escanear
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Información del Cliente</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <span className="text-sm font-medium">{paquete.client.charAt(0)}</span>
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{paquete.client}</p>
                    <p className="text-sm text-gray-500">Cliente</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{paquete.phone}</p>
                    <p className="text-sm text-gray-500">Teléfono</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{paquete.email}</p>
                    <p className="text-sm text-gray-500">Correo electrónico</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Información de Entrega</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{paquete.address}</p>
                    <p className="text-sm text-gray-500">Dirección</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{paquete.city}</p>
                    <p className="text-sm text-gray-500">Ciudad</p>
                  </div>
                </div>
                {paquete.notes && (
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{paquete.notes}</p>
                      <p className="text-sm text-gray-500">Notas</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 px-6 py-5">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Historial de Escaneos</h3>

          <div className="flow-root">
            <ul className="-mb-8">
              {paquete.scans.map((scan, scanIdx) => (
                <li key={scan.id}>
                  <div className="relative pb-8">
                    {scanIdx !== paquete.scans.length - 1 ? (
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                          <Clock className="h-5 w-5 text-white" />
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-gray-500">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(scan.status)}`}
                            >
                              {scan.status}
                            </span>
                            {" en "}
                            <span className="font-medium text-gray-900">{scan.location}</span>
                          </p>
                          <p className="mt-1 text-sm text-gray-500">Operador: {scan.operator}</p>
                        </div>
                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
                          {formatDate(scan.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
