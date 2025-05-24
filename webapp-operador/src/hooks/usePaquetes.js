// src/hooks/usePaquetes.js
import { useState, useEffect, useMemo } from "react"

export function usePaquetes() {
  const [paquetes, setPaquetes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [viewMode, setViewMode] = useState("table") // 'table' o 'cards'

  useEffect(() => {
    async function fetchPaquetes() {
      setLoading(true)
      try {
        const res = await fetch('/envio')
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
        const data = await res.json()
        // Mapear objetos de envío a tu modelo de 'paquete'
        const mapped = data.map(e => ({
          id: e.envio_id.toString(),
          trackingNumber: e.qr_code,
          client: e.cliente?.nombre || '',
          status: e.estado,
          address: e.nodo_destino?.direccion || ''
        }))
        setPaquetes(mapped)
      } catch (err) {
        console.error('Error fetching envios:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchPaquetes()
  }, [])

  const filteredPaquetes = useMemo(() => {
    return paquetes.filter(p => {
      const matchesSearch =
        p.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.client.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "" || p.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [paquetes, searchTerm, statusFilter])

  function getStatusColor(status) {
    switch (status) {
      case "ENTREGADO":    return "bg-green-100 text-green-800"
      case "EN_TRANSITO":  return "bg-blue-100 text-blue-800"
      case "PENDIENTE":    return "bg-yellow-100 text-yellow-800"
      default:              return "bg-gray-100 text-gray-800"
    }
  }

  return {
    loading,
    error,
    paquetes: filteredPaquetes,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    viewMode,
    setViewMode,
    getStatusColor,
  }
}
