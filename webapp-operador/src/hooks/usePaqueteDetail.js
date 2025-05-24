// src/hooks/usePaquetes.js
// src/hooks/usePaqueteDetail.js
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"

export function usePaqueteDetail() {
  const { id } = useParams()
  const [paquete, setPaquete] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return

    async function fetchPaquete() {
      setLoading(true)
      try {
        const res = await fetch(`/api/envio/${id}`)
        if (!res.ok) {
          const text = await res.text()
          throw new Error(text || res.statusText)
        }
        const data = await res.json()
        setPaquete(data)
      } catch (err) {
        console.error("Error fetching paquete:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPaquete()
  }, [id])

  const formatDate = (dateString) => {
    if (!dateString) return "-"
    return new Intl.DateTimeFormat("es", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(dateString))
  }

  const getStatusColor = (estado) => {
    switch (estado) {
      case "ENTREGADO":     return "bg-green-100 text-green-800"
      case "EN_TRANSITO":   return "bg-blue-100 text-blue-800"
      case "RECIBIDO":      return "bg-purple-100 text-purple-800"
      case "PENDIENTE":     return "bg-yellow-100 text-yellow-800"
      default:              return "bg-gray-100 text-gray-800"
    }
  }

  return { paquete, loading, error, formatDate, getStatusColor }
}




/*import { useState, useEffect, useMemo } from "react"
import { useParams } from "react-router-dom"

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
        const res = await fetch(`/api/envios`)
        if (!res.ok) {
          const text = await res.text()
          throw new Error(text || res.statusText)
        }
        const data = await res.json()
        setPaquetes(data)
      } catch (err) {
        console.error("Error fetching paquetes:", err)
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
*/