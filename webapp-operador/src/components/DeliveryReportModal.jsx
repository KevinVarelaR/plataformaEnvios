"use client"

import { useState, useRef, useEffect } from "react"
import { XIcon, Camera, Upload, Check } from "lucide-react"

export default function DeliveryReportModal({ isOpen, onClose, onSubmit, deliveryId }) {
  const [step, setStep] = useState(1) // 1: foto, 2: firma
  const [photo, setPhoto] = useState(null)
  const [signature, setSignature] = useState(null)
  const canvasRef = useRef(null)
  const fileInputRef = useRef(null)
  const videoRef = useRef(null)
  const streamRef = useRef(null)

  const [isDrawing, setIsDrawing] = useState(false)
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (!isOpen) {
      setStep(1)
      setPhoto(null)
      setSignature(null)
      stopCamera()
    } else if (step === 1) {
      startCamera()
    }

    return () => {
      stopCamera()
    }
  }, [isOpen, step])

  useEffect(() => {
    if (step === 2 && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      ctx.fillStyle = "white"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.lineWidth = 3
      ctx.lineCap = "round"
      ctx.strokeStyle = "black"
    }
  }, [step])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
      }
    } catch (err) {
      console.error("Error al acceder a la cámara:", err)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
  }

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas")
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const ctx = canvas.getContext("2d")
      ctx.drawImage(videoRef.current, 0, 0)
      const dataUrl = canvas.toDataURL("image/jpeg")
      setPhoto(dataUrl)
      stopCamera()
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setPhoto(event.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleStartDrawing = (e) => {
    setIsDrawing(true)
    const { offsetX, offsetY } = getCoordinates(e)
    setLastPosition({ x: offsetX, y: offsetY })
  }

  const handleDrawing = (e) => {
    if (!isDrawing) return

    const { offsetX, offsetY } = getCoordinates(e)
    const ctx = canvasRef.current.getContext("2d")

    ctx.beginPath()
    ctx.moveTo(lastPosition.x, lastPosition.y)
    ctx.lineTo(offsetX, offsetY)
    ctx.stroke()

    setLastPosition({ x: offsetX, y: offsetY })
  }

  const getCoordinates = (e) => {
    if (e.touches && e.touches[0]) {
      const rect = canvasRef.current.getBoundingClientRect()
      return {
        offsetX: e.touches[0].clientX - rect.left,
        offsetY: e.touches[0].clientY - rect.top,
      }
    }
    return { offsetX: e.nativeEvent.offsetX, offsetY: e.nativeEvent.offsetY }
  }

  const handleEndDrawing = () => {
    setIsDrawing(false)
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  const saveSignature = () => {
    const dataUrl = canvasRef.current.toDataURL("image/png")
    setSignature(dataUrl)
  }

  const handleSubmit = () => {
    onSubmit({
      deliveryId,
      photo,
      signature,
      timestamp: new Date().toISOString(),
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {step === 1 ? "Capturar Foto de Entrega" : "Firma de Recepción"}
              </h3>
              <button type="button" className="text-gray-400 hover:text-gray-500" onClick={onClose}>
                <XIcon className="h-6 w-6" />
              </button>
            </div>

            {step === 1 ? (
              <div>
                {!photo ? (
                  <div className="space-y-4">
                    <div className="bg-gray-100 rounded-lg overflow-hidden aspect-video">
                      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    </div>
                    <div className="flex justify-center space-x-4">
                      <button type="button" className="btn btn-primary flex items-center" onClick={capturePhoto}>
                        <Camera className="h-5 w-5 mr-2" />
                        Capturar
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary flex items-center"
                        onClick={() => fileInputRef.current.click()}
                      >
                        <Upload className="h-5 w-5 mr-2" />
                        Subir Foto
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-gray-100 rounded-lg overflow-hidden aspect-video">
                      <img
                        src={photo || "/placeholder.svg"}
                        alt="Foto de entrega"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex justify-center space-x-4">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => {
                          setPhoto(null)
                          startCamera()
                        }}
                      >
                        Volver a capturar
                      </button>
                      <button type="button" className="btn btn-primary" onClick={() => setStep(2)}>
                        Continuar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="space-y-4">
                  <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
                    <canvas
                      ref={canvasRef}
                      width={400}
                      height={200}
                      className="w-full touch-none"
                      onMouseDown={handleStartDrawing}
                      onMouseMove={handleDrawing}
                      onMouseUp={handleEndDrawing}
                      onMouseLeave={handleEndDrawing}
                      onTouchStart={handleStartDrawing}
                      onTouchMove={handleDrawing}
                      onTouchEnd={handleEndDrawing}
                    />
                  </div>
                  <p className="text-sm text-gray-500 text-center">Firma del receptor en el espacio de arriba</p>
                  <div className="flex justify-center space-x-4">
                    <button type="button" className="btn btn-secondary" onClick={clearSignature}>
                      Borrar
                    </button>
                    <button type="button" className="btn btn-primary flex items-center" onClick={saveSignature}>
                      <Check className="h-5 w-5 mr-2" />
                      Guardar Firma
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            {step === 2 && (
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                onClick={handleSubmit}
                disabled={!photo || !signature}
              >
                Completar Entrega
              </button>
            )}
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
