// src/hooks/useNewPaquete.js
import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"

export function useNewPaquete() {
  const navigate = useNavigate()
  const location = useLocation()

  const [mode, setMode] = useState("scan")          // 'scan' o 'manual'
  const [scannedCode, setScannedCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    trackingNumber: "",
    client: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    notes: "",
  })

  // Detectar parámetro ?scan=ID en la URL
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const scanId = params.get("scan")
    if (scanId) {
      setScannedCode(`PKG${scanId}`)
      setMode("manual")
      setLoading(true)
      setTimeout(() => {
        // Simular carga de datos desde API
        setFormData({
          trackingNumber: `PKG00${scanId}`,
          client: "Cliente Ejemplo",
          phone: "123-456-7890",
          email: "cliente@ejemplo.com",
          address: "Calle Principal 123",
          city: "Ciudad Ejemplo",
          notes: "Notas de ejemplo",
        })
        setLoading(false)
      }, 1000)
    }
  }, [location.search])

  function handleScan(data) {
    if (!data) return
    setScannedCode(data)
    setMode("manual")
    setFormData(prev => ({ ...prev, trackingNumber: data }))
  }

  function handleInputChange(e) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  function resetForm() {
    setMode("scan")
    setScannedCode("")
    setFormData({
      trackingNumber: "",
      client: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      notes: "",
    })
  }

  function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      navigate("/paquetes")
    }, 1000)
  }

  return {
    mode,
    scannedCode,
    loading,
    formData,
    setMode,
    handleScan,
    handleInputChange,
    resetForm,
    handleSubmit,
  }
}
