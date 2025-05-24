// src/hooks/useRutas.js
import { useState, useEffect } from "react"

export function useRutas() {
  const [routes, setRoutes] = useState([])
  const [messengers, setMessengers] = useState([])
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [assignments, setAssignments] = useState([])

  useEffect(() => {
    async function fetchAll() {
      setLoading(true)
      try {
        const [rRes, mRes, pRes] = await Promise.all([
          fetch("/api/rutas"),
          fetch("/api/mensajeros"),
          fetch("/api/envio")
        ])

        if (!rRes.ok || !mRes.ok || !pRes.ok) {
          throw new Error(
            `${!rRes.ok ? "rutas" : ""} ${!mRes.ok ? "mensajeros" : ""} ${!pRes.ok ? "envios" : ""}`
          )
        }

        const [rData, mData, pData] = await Promise.all([
          rRes.json(),
          mRes.json(),
          pRes.json()
        ])

        setRoutes(rData)
        setMessengers(mData)

        setPackages(pData.map(e => ({
          id: e.envio_id.toString(),
          trackingNumber: e.qr_code,  // o e.trackingNumber si lo tienes
          client: e.cliente.nombre,    // ajusta según tu schema
          address: e.destino.direccion, // idem
          assigned: false
        })))
      } catch (err) {
        console.error("Error cargando datos de rutas:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  function handleAssign(assignment) {
    setAssignments(prev => [...prev, assignment])
    setPackages(prev =>
      prev.map(pkg =>
        assignment.packages.some(p => p.id === pkg.id)
          ? { ...pkg, assigned: true }
          : pkg
      )
    )
  }

  function handleRemoveAssignment(assignmentId) {
    const assignment = assignments.find(a => a.id === assignmentId)
    if (!assignment) return
    setAssignments(prev => prev.filter(a => a.id !== assignmentId))
    setPackages(prev =>
      prev.map(pkg =>
        assignment.packages.some(p => p.id === pkg.id)
          ? { ...pkg, assigned: false }
          : pkg
      )
    )
  }

  return {
    routes,
    messengers,
    packages,
    loading,
    error,
    assignments,
    handleAssign,
    handleRemoveAssignment,
  }
}
