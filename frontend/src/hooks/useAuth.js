import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser, loginUser, logoutUser } from "../services/auth.service";
import { setUser, clearUser } from "../store/slices/authSlice";
import { queryClient } from "../lib/queryClient";

export const useRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: registerUser,
    onSuccess: (response) => {
      dispatch(setUser(response.data));
      navigate("/", { replace: true });
    },
  });
};

export const useLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (response) => {
      dispatch(setUser(response.data));
      navigate("/", { replace: true });
    },
  });
};

export const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      dispatch(clearUser());
      queryClient.clear(); // clear all cached queries on logout
      // navigate("/login", { replace: true });
    },
  });
};
