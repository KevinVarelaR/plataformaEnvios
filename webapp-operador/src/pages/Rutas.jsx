
// src/pages/Rutas.jsx
"use client"
import React from "react"
import { Map, User, Package } from "lucide-react"
import RoutesManager from "../components/RoutesManager"
import { useRutas } from "../hooks/useRutas"

export default function Rutas() {
  const {
    routes,
    messengers,
    error,
    packages,
    loading,
    assignments,
    handleAssign,
    handleRemoveAssignment,
  } = useRutas()

  // Manejo de estados de carga y errores
  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-500">Cargando datos...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-600">Error al cargar datos: {error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Rutas</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Rutas */}
        <div className="card">
          <div className="flex items-center mb-4">
            <Map className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Rutas</h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">{routes.length} rutas disponibles</p>
          <ul className="divide-y divide-gray-200">
            {routes.map(route => (
              <li key={route.id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-900">{route.name}</p>
                  <p className="text-xs text-gray-500">{route.zone}</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {assignments.filter(a => a.routeId === route.id).length} asignaciones
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Mensajeros */}
        <div className="card">
          <div className="flex items-center mb-4">
            <User className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Mensajeros</h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">{messengers.length} mensajeros disponibles</p>
          <ul className="divide-y divide-gray-200">
            {messengers.map(messenger => (
              <li key={messenger.id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-900">{messenger.name}</p>
                  <p className="text-xs text-gray-500">{messenger.vehicle} • {messenger.phone}</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {assignments.filter(a => a.messengerId === messenger.id).length} rutas
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Paquetes */}
        <div className="card">
          <div className="flex items-center mb-4">
            <Package className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Paquetes</h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">{packages.filter(p => !p.assigned).length} paquetes sin asignar</p>
          <ul className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
            {packages.map(pkg => (
              <li key={pkg.id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-900">{pkg.trackingNumber}</p>
                  <p className="text-xs text-gray-500">{pkg.client}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${pkg.assigned ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {pkg.assigned ? 'Asignado' : 'Sin asignar'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-500">Cargando datos...</p>
        </div>
      ) : (
        <RoutesManager
          routes={routes}
          messengers={messengers}
          packages={packages.filter(p => !p.assigned)}
          onAssign={handleAssign}
          onRemove={handleRemoveAssignment}
        />
      )}
    </div>
  )
}
