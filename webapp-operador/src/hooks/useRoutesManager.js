// src/hooks/useRoutesManager.js
import { useState, useEffect } from "react"

export function useRoutesManager(routes, messengers, packages, onAssign, onRemove) {
  const [selectedRoute, setSelectedRoute] = useState("")
  const [selectedMessenger, setSelectedMessenger] = useState("")
  const [availablePackages, setAvailablePackages] = useState([])
  const [selectedPackages, setSelectedPackages] = useState([])
  const [assignments, setAssignments] = useState([])

  // Actualizar lista de paquetes disponibles cuando cambian packages
  useEffect(() => {
    if (packages) {
      setAvailablePackages(packages.filter(pkg => !pkg.assigned))
    }
  }, [packages])

  function handleRouteChange(routeId) {
    setSelectedRoute(routeId)
    setSelectedMessenger("")
    setSelectedPackages([])
  }

  function handleMessengerChange(messengerId) {
    setSelectedMessenger(messengerId)
  }

  function handlePackageSelect(packageId) {
    setSelectedPackages(prev => 
      prev.includes(packageId)
        ? prev.filter(id => id !== packageId)
        : [...prev, packageId]
    )
  }

  function handleAssignClick() {
    if (!selectedRoute || !selectedMessenger || selectedPackages.length === 0) return

    const newAssignment = {
      id: Date.now().toString(),
      routeId: selectedRoute,
      routeName: routes.find(r => r.id === selectedRoute)?.name || "",
      messengerId: selectedMessenger,
      messengerName: messengers.find(m => m.id === selectedMessenger)?.name || "",
      packages: selectedPackages.map(id => {
        const pkg = packages.find(p => p.id === id)
        return { id, trackingNumber: pkg?.trackingNumber || "", client: pkg?.client || "" }
      }),
    }

    setAssignments(prev => [...prev, newAssignment])
    setAvailablePackages(prev => prev.filter(pkg => !selectedPackages.includes(pkg.id)))
    setSelectedPackages([])

    if (onAssign) onAssign(newAssignment)
  }

  function handleRemoveClick(assignmentId) {
    const assignment = assignments.find(a => a.id === assignmentId)
    if (!assignment) return

    // Devolver paquetes a disponibles
    const returned = assignment.packages.map(p => packages.find(pkg => pkg.id === p.id) || p)
    setAvailablePackages(prev => [...prev, ...returned])
    setAssignments(prev => prev.filter(a => a.id !== assignmentId))

    if (onRemove) onRemove(assignmentId)
  }

  return {
    selectedRoute,
    handleRouteChange,
    selectedMessenger,
    handleMessengerChange,
    availablePackages,
    selectedPackages,
    handlePackageSelect,
    assignments,
    handleAssignClick,
    handleRemoveClick,
  }
}