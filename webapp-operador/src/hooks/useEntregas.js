// src/hooks/useEntregas.js
import { useState, useEffect, useMemo } from "react"

export function useEntregas() {
  const [allDeliveries, setAllDeliveries] = useState([])    // raw data
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDelivery, setSelectedDelivery] = useState(null)

  useEffect(() => {
    async function fetchEntregas() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch("/entregas")
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
        const data = await res.json()

        // Mapear campos del API a la forma que espera la UI
        const mapped = data.map(e => ({
          id:               e.entrega_id.toString(),
          trackingNumber:   String(e.envio.qr_code),
          client:           e.envio.cliente.nombre,
          address:          e.envio.nodo_destino.direccion,
          status:           e.estado,
          assignedTo:       e.mensajero?.nombre || "",
          estimatedDelivery: e.eta,
          deliveredAt:       e.fecha_entrega,
          photo:             e.foto_url,
          signature:         e.firma_url,
        }))

        setAllDeliveries(mapped)
      } catch (err) {
        console.error("Error fetching entregas:", err)
        setError(err.message)
        setAllDeliveries([]) 
      } finally {
        setLoading(false)
      }
    }
    fetchEntregas()
  }, [])

  // Filtrado según búsqueda y estado
  const deliveries = useMemo(() => {
    return allDeliveries.filter(d => {
      const matchesSearch =
        d.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.client.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = !statusFilter || d.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [allDeliveries, searchTerm, statusFilter])

  const handleOpenModal = (delivery) => {
    setSelectedDelivery(delivery)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedDelivery(null)
  }

  const handleSubmitDelivery = (data) => {
    setAllDeliveries(prev =>
      prev.map(d =>
        d.id === data.deliveryId
          ? { 
              ...d, 
              status:      "Entregado", 
              deliveredAt: data.timestamp, 
              photo:       data.photo, 
              signature:   data.signature 
            }
          : d
      )
    )
    handleCloseModal()
  }

  const formatDate = (dateString) => {
    if (!dateString) return "-"
    return new Intl.DateTimeFormat("es", { dateStyle: "medium", timeStyle: "short" })
      .format(new Date(dateString))
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Entregado": return "bg-green-100 text-green-800"
      case "En ruta":   return "bg-blue-100 text-blue-800"
      case "Pendiente": return "bg-yellow-100 text-yellow-800"
      default:           return "bg-gray-100 text-gray-800"
    }
  }

  return {
    loading,
    error,
    deliveries,          // filtrado
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    isModalOpen,
    selectedDelivery,
    handleOpenModal,
    handleCloseModal,
    handleSubmitDelivery,
    formatDate,
    getStatusColor,
  }
}

