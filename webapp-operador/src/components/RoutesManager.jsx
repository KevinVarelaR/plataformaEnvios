"use client"

import { useState, useEffect } from "react"
import { MapPin, User, Package, Plus, Trash } from "lucide-react"

export default function RoutesManager({ routes, messengers, packages, onAssign, onRemove }) {
  const [selectedRoute, setSelectedRoute] = useState("")
  const [selectedMessenger, setSelectedMessenger] = useState("")
  const [availablePackages, setAvailablePackages] = useState([])
  const [selectedPackages, setSelectedPackages] = useState([])
  const [assignments, setAssignments] = useState([])

  // Simular carga de datos
  useEffect(() => {
    if (packages) {
      setAvailablePackages(packages.filter((pkg) => !pkg.assigned))
    }
  }, [packages])

  const handleRouteChange = (routeId) => {
    setSelectedRoute(routeId)
    setSelectedMessenger("")
    setSelectedPackages([])
  }

  const handleMessengerChange = (messengerId) => {
    setSelectedMessenger(messengerId)
  }

  const handlePackageSelect = (packageId) => {
    const isSelected = selectedPackages.includes(packageId)

    if (isSelected) {
      setSelectedPackages(selectedPackages.filter((id) => id !== packageId))
    } else {
      setSelectedPackages([...selectedPackages, packageId])
    }
  }

  const handleAssign = () => {
    if (!selectedRoute || !selectedMessenger || selectedPackages.length === 0) {
      return
    }

    const newAssignment = {
      id: Date.now().toString(),
      routeId: selectedRoute,
      routeName: routes.find((r) => r.id === selectedRoute)?.name || "",
      messengerId: selectedMessenger,
      messengerName: messengers.find((m) => m.id === selectedMessenger)?.name || "",
      packages: selectedPackages.map((id) => {
        const pkg = packages.find((p) => p.id === id)
        return {
          id,
          trackingNumber: pkg?.trackingNumber || "",
          client: pkg?.client || "",
        }
      }),
    }

    setAssignments([...assignments, newAssignment])

    // Actualizar paquetes disponibles
    setAvailablePackages(availablePackages.filter((pkg) => !selectedPackages.includes(pkg.id)))

    // Limpiar selección
    setSelectedPackages([])

    // Notificar al componente padre
    if (onAssign) {
      onAssign(newAssignment)
    }
  }

  const handleRemoveAssignment = (assignmentId) => {
    const assignment = assignments.find((a) => a.id === assignmentId)

    if (assignment) {
      // Devolver paquetes a disponibles
      const packagesToReturn = assignment.packages.map((p) => {
        const originalPackage = packages.find((pkg) => pkg.id === p.id)
        return originalPackage || p
      })

      setAvailablePackages([...availablePackages, ...packagesToReturn])

      // Eliminar asignación
      setAssignments(assignments.filter((a) => a.id !== assignmentId))

      // Notificar al componente padre
      if (onRemove) {
        onRemove(assignmentId)
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Asignar Ruta</h3>

          <div>
            <label htmlFor="route" className="block text-sm font-medium text-gray-700">
              Ruta
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="route"
                className="form-input pl-10"
                value={selectedRoute}
                onChange={(e) => handleRouteChange(e.target.value)}
              >
                <option value="">Seleccionar ruta</option>
                {routes &&
                  routes.map((route) => (
                    <option key={route.id} value={route.id}>
                      {route.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="messenger" className="block text-sm font-medium text-gray-700">
              Mensajero
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="messenger"
                className="form-input pl-10"
                value={selectedMessenger}
                onChange={(e) => handleMessengerChange(e.target.value)}
                disabled={!selectedRoute}
              >
                <option value="">Seleccionar mensajero</option>
                {messengers &&
                  messengers.map((messenger) => (
                    <option key={messenger.id} value={messenger.id}>
                      {messenger.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Paquetes Disponibles</label>
            <div className="mt-1 border border-gray-300 rounded-md max-h-60 overflow-y-auto">
              {availablePackages.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {availablePackages.map((pkg) => (
                    <li key={pkg.id} className="p-3">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                          checked={selectedPackages.includes(pkg.id)}
                          onChange={() => handlePackageSelect(pkg.id)}
                          disabled={!selectedMessenger}
                        />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{pkg.trackingNumber}</p>
                          <p className="text-sm text-gray-500">{pkg.client}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 text-center text-gray-500">No hay paquetes disponibles</div>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="btn btn-primary flex items-center"
              onClick={handleAssign}
              disabled={!selectedRoute || !selectedMessenger || selectedPackages.length === 0}
            >
              <Plus className="h-5 w-5 mr-2" />
              Asignar Paquetes
            </button>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Asignaciones Actuales</h3>

          {assignments.length > 0 ? (
            <div className="space-y-4">
              {assignments.map((assignment) => (
                <div key={assignment.id} className="border border-gray-200 rounded-md p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{assignment.routeName}</h4>
                      <p className="text-sm text-gray-600">Mensajero: {assignment.messengerName}</p>
                      <p className="text-sm text-gray-600">Paquetes: {assignment.packages.length}</p>
                    </div>
                    <button
                      type="button"
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleRemoveAssignment(assignment.id)}
                    >
                      <Trash className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-1">Paquetes:</p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {assignment.packages.map((pkg) => (
                        <li key={pkg.id} className="flex items-center">
                          <Package className="h-3 w-3 mr-1" />
                          {pkg.trackingNumber} - {pkg.client}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">No hay asignaciones activas</div>
          )}
        </div>
      </div>
    </div>
  )
}
