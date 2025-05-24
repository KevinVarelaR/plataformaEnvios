import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function registrarEnvio(envioData) {
  try {
    const response = await axios.post(`${API_BASE_URL}/envios`, envioData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

export async function consultarEstadoEnvio(codigo) {
  try {
    const response = await axios.get(`${API_BASE_URL}/envios/${codigo}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

export async function obtenerHistorialEnvios() {
  try {
    const response = await axios.get(`${API_BASE_URL}/envios/historial`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}