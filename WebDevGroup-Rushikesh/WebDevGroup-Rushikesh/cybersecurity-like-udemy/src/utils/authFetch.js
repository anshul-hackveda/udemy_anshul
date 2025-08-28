// src/utils/authFetch.js
import axios from "axios";

const authFetch = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true, // needed for cookie auth, harmless if using headers
  headers: {
    "Content-Type": "application/json",
  },
});

authFetch.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // or wherever you keep it
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

authFetch.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error.response?.data || error)
);

export default authFetch;

