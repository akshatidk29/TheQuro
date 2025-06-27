import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? `${import.meta.env.VITE_IPV4_URL}:5001/api`
      : "/api",
  withCredentials: true,
});
