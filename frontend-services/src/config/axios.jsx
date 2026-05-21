import axios from "axios";

// En desarrollo (npm run dev) apunta a localhost:4040.
// En producción (dentro de Docker/Nginx) usa rutas relativas para pasar por el proxy.
const baseURL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:4040" : "");

const clienteAxios = axios.create({
  baseURL,
});

export default clienteAxios;
