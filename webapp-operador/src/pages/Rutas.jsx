"use client"

import { useState, useEffect } from "react"
import { Map, User, Package } from "lucide-react"
import RoutesManager from "../components/RoutesManager"

// Datos de ejemplo
const mockRoutes = [
  { id: "1", name: "Ruta Norte", zone: "Zona Norte" },
  { id: "2", name: "Ruta Sur", zone: "Zona Sur" },
  { id: "3", name: "Ruta Este", zone: "Zona Este" },
  { id: "4", name: "Ruta Oeste", zone: "Zona Oeste" },
  { id: "5", name: "Ruta Centro", zone: "Zona Centro" },
]

const mockMessengers = [
  { id: "1", name: "Carlos Rodríguez", phone: "123-456-7890", vehicle: "Motocicleta" },
  { id: "2", name: "Ana Martínez", phone: "234-567-8901", vehicle: "Automóvil" },
  { id: "3", name: "Luis Gómez", phone: "345-678-9012", vehicle: "Motocicleta" },
  { id: "4", name: "María López", phone: "456-789-0123", vehicle: "Automóvil" },
]

const mockPackages = [
  { id: "1", trackingNumber: "PKG001", client: "Juan Pérez", address: "Calle 123, Ciudad", assigned: false },
  { id: "2", trackingNumber: "PKG002", client: "María López", address: "Av. Principal 456, Ciudad", assigned: false },
  { id: "3", trackingNumber: "PKG003", client: "Carlos Gómez", address: "Plaza Central 789, Ciudad", assigned: false },
  { id: "4", trackingNumber: "PKG004", client: "Ana Martínez", address: "Calle Norte 321, Ciudad", assigned: false },
  { id: "5", trackingNumber: "PKG005", client: "Roberto Díaz", address: "Av. Sur 654, Ciudad", assigned: false },
  { id: "6", trackingNumber: "PKG006", client: "Laura Sánchez", address: "Calle Este 987, Ciudad", assigned: false },
  { id: "7", trackingNumber: "PKG007", client: "Pedro Ramírez", address: "Av. Oeste 654, Ciudad", assigned: false },
]

export default function Rutas() {
  const [routes, setRoutes] = useState([])
  const [messengers, setMessengers] = useState([])
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [assignments, setAssignments] = useState([])

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setRoutes(mockRoutes)
      setMessengers(mockMessengers)
      setPackages(mockPackages)
      setLoading(false)
    }, 500)
  }, [])

  const handleAssign = (assignment) => {
    setAssignments([...assignments, assignment])

    // Actualizar paquetes asignados
    const updatedPackages = packages.map((pkg) => {
      if (assignment.packages.some((p) => p.id === pkg.id)) {
        return { ...pkg, assigned: true }
      }
      return pkg
    })

    setPackages(updatedPackages)
  }

  const handleRemoveAssignment = (assignmentId) => {
    const assignment = assignments.find((a) => a.id === assignmentId)

    if (assignment) {
      // Actualizar paquetes para marcarlos como no asignados
      const updatedPackages = packages.map((pkg) => {
        if (assignment.packages.some((p) => p.id === pkg.id)) {
          return { ...pkg, assigned: false }
        }
        return pkg
      })

      setPackages(updatedPackages)
      setAssignments(assignments.filter((a) => a.id !== assignmentId))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Rutas</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center mb-4">
            <Map className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Rutas</h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">{routes.length} rutas disponibles</p>
          <ul className="divide-y divide-gray-200">
            {routes.map((route) => (
              <li key={route.id} className="py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{route.name}</p>
                    <p className="text-xs text-gray-500">{route.zone}</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {assignments.filter((a) => a.routeId === route.id).length} asignaciones
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <div className="flex items-center mb-4">
            <User className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Mensajeros</h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">{messengers.length} mensajeros disponibles</p>
          <ul className="divide-y divide-gray-200">
            {messengers.map((messenger) => (
              <li key={messenger.id} className="py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{messenger.name}</p>
                    <p className="text-xs text-gray-500">
                      {messenger.vehicle} • {messenger.phone}
                    </p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {assignments.filter((a) => a.messengerId === messenger.id).length} rutas
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <div className="flex items-center mb-4">
            <Package className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Paquetes</h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            {packages.filter((p) => !p.assigned).length} paquetes sin asignar
          </p>
          <ul className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
            {packages.map((pkg) => (
              <li key={pkg.id} className="py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{pkg.trackingNumber}</p>
                    <p className="text-xs text-gray-500">{pkg.client}</p>
                  </div>
                  {pkg.assigned ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Asignado
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Sin asignar
                    </span>
                  )}
                </div>
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
          packages={packages.filter((p) => !p.assigned)}
          onAssign={handleAssign}
          onRemove={handleRemoveAssignment}
        />
      )}
    </div>
  )
}