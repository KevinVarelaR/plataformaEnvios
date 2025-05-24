import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function obtenerInfoCliente() {
  try {
    const response = await axios.get(`${API_BASE_URL}/clientes/info`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}