// src/components/PaqueteDetail.jsx
"use client"
import React from "react"
import { Link } from "react-router-dom"
import { Package, MapPin, Phone, Mail, Clock, ArrowLeft, Edit, QrCode } from "lucide-react"
import { usePaqueteDetail } from "../hooks/usePaqueteDetail"

export default function PaqueteDetail() {
  const { paquete, loading, error, formatDate, getStatusColor } = usePaqueteDetail()

  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-500">Cargando detalles del paquete...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-600">Error al cargar detalles: {error}</p>
        <div className="mt-4">
          <Link to="/paquetes" className="btn btn-primary">Volver a la lista</Link>
        </div>
      </div>
    )
  }


  if (!paquete) {
    return (
      <div className="text-center py-10 bg-white rounded-lg shadow">
        <Package className="h-12 w-12 text-gray-400 mx-auto" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Paquete no encontrado</h3>
        <p className="mt-1 text-sm text-gray-500">No se encontró el paquete solicitado</p>
        <div className="mt-6">
          <Link to="/paquetes" className="btn btn-primary">Volver a la lista</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Detalle de Paquete</h1>
        <Link to="/paquetes" className="btn btn-secondary flex items-center">
          <ArrowLeft className="h-5 w-5 mr-2" /> Volver
        </Link>
      </div>

      {/* Info general */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          {/* Tracking y acciones */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div className="flex items-center mb-4 md:mb-0">
              <Package className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">{paquete.trackingNumber}</h2>
                <p className="text-sm text-gray-500">Creado el {formatDate(paquete.createdAt)}</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(paquete.status)}`}>{paquete.status}</span>
              <Link to={`/paquetes/nuevo?scan=${paquete.id}`} className="btn btn-secondary flex items-center">
                <Edit className="h-5 w-5 mr-2" /> Editar
              </Link>
              <Link to={`/paquetes/nuevo?scan=${paquete.id}`} className="btn btn-primary flex items-center">
                <QrCode className="h-5 w-5 mr-2" /> Escanear
              </Link>
            </div>
          </div>

          {/* Datos cliente y entrega */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Información del Cliente</h3>
              {/* ... similar JSX para datos del cliente ... */}
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Información de Entrega</h3>
              {/* ... similar JSX para dirección, ciudad, notas ... */}
            </div>
          </div>
        </div>

        {/* Historial de escaneos */}
        <div className="border-t border-gray-200 px-6 py-5">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Historial de Escaneos</h3>
          <ul className="flow-root -mb-8">
            {paquete.scans.map((scan, idx) => (
              <li key={scan.id} className="relative pb-8">
                {idx < paquete.scans.length - 1 && <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"></span>}
                <div className="relative flex space-x-3">
                  <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                    <Clock className="h-5 w-5 text-white" />
                  </span>
                  <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(scan.status)}`}>{scan.status}</span> en <span className="font-medium text-gray-900">{scan.location}</span>
                      </p>
                      <p className="mt-1 text-sm text-gray-500">Operador: {scan.operator}</p>
                    </div>
                    <div className="text-right text-sm whitespace-nowrap text-gray-500">{formatDate(scan.timestamp)}</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}