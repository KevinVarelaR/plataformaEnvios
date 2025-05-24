
// src/components/DeliveryReportModal.jsx
"use client"
import React from "react";
import { useState, useRef, useEffect } from "react";
import { XIcon, Camera, Upload, Check } from "lucide-react";
import { useDeliveryReportModal } from "../hooks/useDeliveryReportModal.js";


export default function DeliveryReportModal({ isOpen, onClose, onSubmit, deliveryId }) {
  const {
    step, photo, signature,
    videoRef, canvasRef, fileInputRef,
    capturePhoto, handleFileUpload,
    handleStartDrawing, handleDrawing, handleEndDrawing,
    clearSignature, saveSignature, setStep, submit,
  } = useDeliveryReportModal(isOpen, onClose);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-gray-500 opacity-75" onClick={onClose} />
      <div className="relative max-w-lg mx-auto my-20 bg-white rounded-lg overflow-hidden shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-medium text-gray-900">
            {step === 1 ? "Capturar Foto de Entrega" : "Firma de Recepción"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        {/* Body */}
        <div className="p-4">
          {step === 1 ? (
            photo ? (
              <div>
                <img src={photo} alt="entrega" className="w-full h-auto rounded" />
                <div className="mt-4 flex justify-between">
                  <button onClick={() => setStep(1)} className="btn-secondary">Reiniciar</button>
                  <button onClick={() => setStep(2)} className="btn-primary">Continuar</button>
                </div>
              </div>
            ) : (
              <div>
                <video ref={videoRef} autoPlay playsInline className="w-full h-auto rounded mb-4" />
                <div className="flex justify-center space-x-4">
                  <button onClick={capturePhoto} className="btn-primary flex items-center">
                    <Camera className="mr-2" /> Capturar
                  </button>
                  <button onClick={() => fileInputRef.current.click()} className="btn-secondary flex items-center">
                    <Upload className="mr-2" /> Subir
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                </div>
              </div>
            )
          ) : (
            <div>
              <canvas
                ref={canvasRef}
                width={400}
                height={200}
                className="w-full h-auto border rounded mb-4"
                onMouseDown={handleStartDrawing}
                onMouseMove={handleDrawing}
                onMouseUp={handleEndDrawing}
                onMouseLeave={handleEndDrawing}
                onTouchStart={handleStartDrawing}
                onTouchMove={handleDrawing}
                onTouchEnd={handleEndDrawing}
              />
              <div className="flex justify-between">
                <button onClick={clearSignature} className="btn-secondary">Borrar</button>
                <button onClick={saveSignature} className="btn-primary flex items-center">
                  <Check className="mr-2" /> Guardar Firma
                </button>
              </div>
            </div>
          )}
        </div>
        {/* Footer */}
        <div className="p-4 bg-gray-50 flex justify-end space-x-2">
          {step === 2 && (
            <button
              onClick={() => submit(onSubmit, deliveryId)}
              disabled={!photo || !signature}
              className="btn-primary"
            >
              Completar Entrega
            </button>
          )}
          <button onClick={onClose} className="btn-secondary">Cancelar</button>
        </div>
      </div>
    </div>
  );
}
