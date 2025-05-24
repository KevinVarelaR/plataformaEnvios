// src/pages/Entregas.jsx
"use client"

import React from "react"
import { Truck, Package, Camera, Check, Search } from "lucide-react"
import DeliveryReportModal from "../components/DeliveryReportModal"
import { useEntregas } from "../hooks/useEntregas"

export default function Entregas() {
  const {
    loading,
    error,
    deliveries,        // <— ahora se llama `deliveries`
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    isModalOpen,
    handleOpenModal,
    handleCloseModal,
    handleSubmitDelivery,
    selectedDelivery,
    formatDate,
    getStatusColor
  } = useEntregas()

  // 1. Estado de carga
  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-500">Cargando entregas...</p>
      </div>
    )
  }

  // 2. Error al cargar
  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-600">Error al cargar entregas: {error}</p>
      </div>
    )
  }

  // 3. Sin resultados
  if (deliveries.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-lg shadow">
        <Truck className="h-12 w-12 text-gray-400 mx-auto" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No hay entregas</h3>
        <p className="mt-1 text-sm text-gray-500">No se encontraron entregas con los filtros actuales.</p>
      </div>
    )
  }

  // 4. Vista normal
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Entregas del Día</h1>
      </div>

      {/* Filtros */}
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
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="w-full md:w-auto">
          <select
            className="form-input w-full"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="">Todos los estados</option>
            <option value="Pendiente">Pendiente</option>
            <option value="En ruta">En ruta</option>
            <option value="Entregado">Entregado</option>
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paquete</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dirección</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mensajero</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora Estimada</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {deliveries.map(delivery => (
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
                      <Check className="h-5 w-5 text-green-600 hover:text-green-900" title="Ver comprobante" />
                    ) : (
                      <button
                        onClick={() => handleOpenModal(delivery)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Camera className="h-5 w-5" title="Reportar entrega" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <DeliveryReportModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitDelivery}
        deliveryId={selectedDelivery?.id}
      />
    </div>
  )
}
