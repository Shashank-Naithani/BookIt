import axiosClient from "../lib/axiosClient";

export const registerUser = async (data) => {
  const response = await axiosClient.post("/auth/register", data);
  return response.data;
};

export const loginUser = async (data) => {
  const response = await axiosClient.post("/auth/login", data);
  return response.data;
};

export const logoutUser = async () => {
  const response = await axiosClient.post("/auth/logout");
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await axiosClient.get("/auth/me");
  return response.data;
};
