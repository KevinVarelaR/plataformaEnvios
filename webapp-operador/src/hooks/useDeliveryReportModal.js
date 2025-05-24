// src/hooks/useDeliveryReportModal.js
import { useState, useRef, useEffect } from "react";

export function useDeliveryReportModal(isOpen, onClose) {
  const [step, setStep] = useState(1);
  const [photo, setPhoto] = useState(null);
  const [signature, setSignature] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const streamRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!isOpen) {
      reset();
      stopCamera();
    } else if (step === 1) {
      startCamera();
    }
    return stopCamera;
  }, [isOpen, step]);

  useEffect(() => {
    if (step === 2 && canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.strokeStyle = "black";
    }
  }, [step]);

  function reset() {
    setStep(1);
    setPhoto(null);
    setSignature(null);
    setIsDrawing(false);
  }

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      console.error(err);
    }
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  }

  function capturePhoto() {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0);
    setPhoto(canvas.toDataURL("image/jpeg"));
    stopCamera();
  }

  function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ({ target }) => setPhoto(target.result);
    reader.readAsDataURL(file);
  }

  function handleStartDrawing(e) {
    setIsDrawing(true);
    const { x, y } = getCoords(e);
    setLastPos({ x, y });
  }

  function handleDrawing(e) {
    if (!isDrawing) return;
    const { x, y } = getCoords(e);
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    setLastPos({ x, y });
  }

  function handleEndDrawing() {
    setIsDrawing(false);
  }

  function getCoords(e) {
    if (e.touches && e.touches[0]) {
      const rect = canvasRef.current.getBoundingClientRect();
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
  }

  function clearSignature() {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  }

  function saveSignature() {
    setSignature(canvasRef.current.toDataURL("image/png"));
  }

  function submit(onSubmit, deliveryId) {
    onSubmit({ deliveryId, photo, signature, timestamp: new Date().toISOString() });
    onClose();
  }

  return {
    step,
    photo,
    signature,
    videoRef,
    canvasRef,
    fileInputRef,
    startCamera,
    capturePhoto,
    handleFileUpload,
    handleStartDrawing,
    handleDrawing,
    handleEndDrawing,
    clearSignature,
    saveSignature,
    setStep,
    submit,
  };
}