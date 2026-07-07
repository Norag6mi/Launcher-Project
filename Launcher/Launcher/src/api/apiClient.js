import axios from "axios";

// If you build the app with a specific IP, it uses that. 
// Otherwise, it safely defaults back to localhost for testing.
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {"Content-Type": "application/json"}
});

export default apiClient;