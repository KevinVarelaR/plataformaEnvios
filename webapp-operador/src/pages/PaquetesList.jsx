"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Package, Eye, QrCode, Search, Filter } from "lucide-react"

// Datos de ejemplo
const mockPaquetes = [
  { id: "1", trackingNumber: "PKG001", client: "Juan Pérez", status: "En tránsito", address: "Calle 123, Ciudad" },
  {
    id: "2",
    trackingNumber: "PKG002",
    client: "María López",
    status: "Entregado",
    address: "Av. Principal 456, Ciudad",
  },
  {
    id: "3",
    trackingNumber: "PKG003",
    client: "Carlos Gómez",
    status: "Pendiente",
    address: "Plaza Central 789, Ciudad",
  },
  {
    id: "4",
    trackingNumber: "PKG004",
    client: "Ana Martínez",
    status: "En tránsito",
    address: "Calle Norte 321, Ciudad",
  },
  { id: "5", trackingNumber: "PKG005", client: "Roberto Díaz", status: "Pendiente", address: "Av. Sur 654, Ciudad" },
]

export default function PaquetesList() {
  const [paquetes, setPaquetes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [viewMode, setViewMode] = useState("table") // 'table' o 'cards'

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setPaquetes(mockPaquetes)
      setLoading(false)
    }, 500)
  }, [])

  const filteredPaquetes = paquetes.filter((paquete) => {
    const matchesSearch =
      paquete.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paquete.client.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "" || paquete.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status) => {
    switch (status) {
      case "Entregado":
        return "bg-green-100 text-green-800"
      case "En tránsito":
        return "bg-blue-100 text-blue-800"
      case "Pendiente":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Paquetes</h1>
        <Link to="/paquetes/nuevo" className="btn btn-primary flex items-center">
          <Package className="h-5 w-5 mr-2" />
          Nuevo Paquete
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:items-center">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="form-input pl-10"
            placeholder="Buscar por tracking o cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select className="form-input pl-10" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">Todos los estados</option>
              <option value="Pendiente">Pendiente</option>
              <option value="En tránsito">En tránsito</option>
              <option value="Entregado">Entregado</option>
            </select>
          </div>

          <div className="flex border rounded-md overflow-hidden">
            <button
              className={`px-3 py-2 ${viewMode === "table" ? "bg-blue-100 text-blue-600" : "bg-white text-gray-600"}`}
              onClick={() => setViewMode("table")}
            >
              <span className="sr-only">Vista de tabla</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button
              className={`px-3 py-2 ${viewMode === "cards" ? "bg-blue-100 text-blue-600" : "bg-white text-gray-600"}`}
              onClick={() => setViewMode("cards")}
            >
              <span className="sr-only">Vista de tarjetas</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-500">Cargando paquetes...</p>
        </div>
      ) : filteredPaquetes.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <Package className="h-12 w-12 text-gray-400 mx-auto" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay paquetes</h3>
          <p className="mt-1 text-sm text-gray-500">No se encontraron paquetes con los filtros actuales.</p>
        </div>
      ) : viewMode === "table" ? (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Tracking</th>
                <th scope="col">Cliente</th>
                <th scope="col">Dirección</th>
                <th scope="col">Estado</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPaquetes.map((paquete) => (
                <tr key={paquete.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Package className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="font-medium">{paquete.trackingNumber}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{paquete.client}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{paquete.address}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(paquete.status)}`}>
                      {paquete.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2 justify-end">
                      <Link to={`/paquetes/${paquete.id}`} className="text-blue-600 hover:text-blue-900">
                        <Eye className="h-5 w-5" />
                        <span className="sr-only">Ver</span>
                      </Link>
                      <Link to={`/paquetes/nuevo?scan=${paquete.id}`} className="text-blue-600 hover:text-blue-900">
                        <QrCode className="h-5 w-5" />
                        <span className="sr-only">Escanear</span>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPaquetes.map((paquete) => (
            <div key={paquete.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <Package className="h-5 w-5 text-gray-400 mr-2" />
                      <h3 className="text-lg font-medium text-gray-900">{paquete.trackingNumber}</h3>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{paquete.client}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(paquete.status)}`}>
                    {paquete.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-500">{paquete.address}</p>
              </div>
              <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 flex justify-end space-x-3">
                <Link to={`/paquetes/${paquete.id}`} className="text-blue-600 hover:text-blue-900">
                  <Eye className="h-5 w-5" />
                  <span className="sr-only">Ver</span>
                </Link>
                <Link to={`/paquetes/nuevo?scan=${paquete.id}`} className="text-blue-600 hover:text-blue-900">
                  <QrCode className="h-5 w-5" />
                  <span className="sr-only">Escanear</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
