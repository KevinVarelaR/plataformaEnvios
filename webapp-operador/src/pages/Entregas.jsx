"use client"

import { useState, useEffect } from "react"
import { Truck, Package, Camera, Check, Search } from "lucide-react"
import DeliveryReportModal from "../components/DeliveryReportModal"

// Datos de ejemplo
const mockDeliveries = [
  {
    id: "1",
    trackingNumber: "PKG001",
    client: "Juan Pérez",
    address: "Calle 123, Ciudad",
    status: "Pendiente",
    assignedTo: "Carlos Rodríguez",
    estimatedDelivery: "2023-05-20T14:00:00Z",
  },
  {
    id: "2",
    trackingNumber: "PKG002",
    client: "María López",
    address: "Av. Principal 456, Ciudad",
    status: "En ruta",
    assignedTo: "Ana Martínez",
    estimatedDelivery: "2023-05-20T15:30:00Z",
  },
  {
    id: "3",
    trackingNumber: "PKG003",
    client: "Carlos Gómez",
    address: "Plaza Central 789, Ciudad",
    status: "Entregado",
    assignedTo: "Luis Gómez",
    estimatedDelivery: "2023-05-20T11:00:00Z",
    deliveredAt: "2023-05-20T10:45:00Z",
    photo: "/placeholder.jpg",
    signature: "/placeholder.jpg",
  },
  {
    id: "4",
    trackingNumber: "PKG004",
    client: "Ana Martínez",
    address: "Calle Norte 321, Ciudad",
    status: "En ruta",
    assignedTo: "María López",
    estimatedDelivery: "2023-05-20T16:15:00Z",
  },
  {
    id: "5",
    trackingNumber: "PKG005",
    client: "Roberto Díaz",
    address: "Av. Sur 654, Ciudad",
    status: "Pendiente",
    assignedTo: "Carlos Rodríguez",
    estimatedDelivery: "2023-05-20T17:00:00Z",
  },
]

export default function Entregas() {
  const [deliveries, setDeliveries] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDelivery, setSelectedDelivery] = useState(null)

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setDeliveries(mockDeliveries)
      setLoading(false)
    }, 500)
  }, [])

  const filteredDeliveries = deliveries.filter((delivery) => {
    const matchesSearch =
      delivery.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.client.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "" || delivery.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleOpenModal = (delivery) => {
    setSelectedDelivery(delivery)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedDelivery(null)
  }

  const handleSubmitDelivery = (data) => {
    // Actualizar el estado de la entrega
    const updatedDeliveries = deliveries.map((delivery) => {
      if (delivery.id === data.deliveryId) {
        return {
          ...delivery,
          status: "Entregado",
          deliveredAt: data.timestamp,
          photo: data.photo,
          signature: data.signature,
        }
      }
      return delivery
    })

    setDeliveries(updatedDeliveries)
  }

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
      case "En ruta":
        return "bg-blue-100 text-blue-800"
      case "Pendiente":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Entregas del Día</h1>
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

        <div className="w-full md:w-auto">
          <select className="form-input w-full" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">Todos los estados</option>
            <option value="Pendiente">Pendiente</option>
            <option value="En ruta">En ruta</option>
            <option value="Entregado">Entregado</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-500">Cargando entregas...</p>
        </div>
      ) : filteredDeliveries.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <Truck className="h-12 w-12 text-gray-400 mx-auto" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay entregas</h3>
          <p className="mt-1 text-sm text-gray-500">No se encontraron entregas con los filtros actuales.</p>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Paquete
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Cliente
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Dirección
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Mensajero
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Estado
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Hora Estimada
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDeliveries.map((delivery) => (
                  <tr key={delivery.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Package className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="font-medium">{delivery.trackingNumber}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{delivery.client}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{delivery.address}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{delivery.assignedTo}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(delivery.status)}`}>
                        {delivery.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{formatDate(delivery.estimatedDelivery)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {delivery.status === "Entregado" ? (
                        <div className="flex justify-end space-x-2">
                          <button type="button" className="text-green-600 hover:text-green-900" title="Ver comprobante">
                            <Check className="h-5 w-5" />
                            <span className="sr-only">Ver comprobante</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="text-blue-600 hover:text-blue-900"
                          onClick={() => handleOpenModal(delivery)}
                        >
                          <Camera className="h-5 w-5" />
                          <span className="sr-only">Reportar entrega</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <DeliveryReportModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitDelivery}
        deliveryId={selectedDelivery?.id}
      />
    </div>
  )
}
