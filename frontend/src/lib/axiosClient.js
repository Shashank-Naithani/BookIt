import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  withCredentials: true, // send/receive HTTP-only cookies automatically
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;
