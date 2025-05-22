"use client"

import { useState, useEffect } from "react"

import QrScanner from 'react-qr-scanner';

export default function QRScanner({ onScan }) {
  const [hasPermission, setHasPermission] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Verificar permisos de cámara
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(() => setHasPermission(true))
      .catch((err) => {
        console.error("Error al acceder a la cámara:", err)
        setError("No se pudo acceder a la cámara. Por favor, verifica los permisos.")
        setHasPermission(false)
      })
  }, [])

  if (hasPermission === null) {
    return <div className="text-center py-4">Solicitando acceso a la cámara...</div>
  }

  if (hasPermission === false) {
    return (
      <div className="text-center py-4 text-red-600">
        {error || "No hay acceso a la cámara. Por favor, verifica los permisos."}
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="overflow-hidden rounded-lg">
        <QrScanner
          constraints={{ facingMode: "environment" }}
          onResult={(result, error) => {
            if (result) {
              onScan(result?.text)
            }
            if (error) {
              console.info("Error al escanear:", error)
            }
          }}
          className="w-full"
          videoStyle={{ width: "100%", height: "100%" }}
        />
      </div>
      <p className="text-center mt-4 text-gray-600">Apunta la cámara al código QR del paquete</p>
    </div>
  )
}
