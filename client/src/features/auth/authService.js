import axios from "axios";

import {BASE_URL} from "../../utils/config";

const register = async (userData) => {
  const response = await axios.post(`${BASE_URL}/register`, userData);
  return response.data;
};

const registerVerify = async (data) => {
  const response = await axios.get(
    `${BASE_URL}/register-verify?token=${data}`,
    {withCredentials: true}
  );
  return response.data;
};

const login = async (userData) => {
  const response = await axios.post(`${BASE_URL}/login`, userData, {
    withCredentials: true,
  });
  return response.data;
};

const loginVerify = async (userData) => {
  const response = await axios.post(`${BASE_URL}/login-verify`, userData, {
    withCredentials: true,
  });
  return response.data;
};

const logout = async () => {
  const response = await axios.get(`${BASE_URL}/logout`, {
    withCredentials: true,
  });
  return response.data;
};

const generateAccessToken = async () => {
  const response = await axios.get(`${BASE_URL}/refresh_token`, {
    withCredentials: true,
  });
  return response.data;
};

const resetPassword = async (userData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(
    `${BASE_URL}/reset-password`,
    userData,
    config
  );
  return response.data;
};

const forgotPassword = async (userData) => {
  const response = await axios.post(`${BASE_URL}/forgot-password`, userData);
  return response.data;
};

const validateConfirmForgotPassword = async (data) => {
  const response = await axios.get(
    `${BASE_URL}/validate-confirm-forgot-password?token=${data}`,
    {withCredentials: true}
  );
  return response.data;
};

const confirmForgotPassword = async (userData) => {
  const response = await axios.post(
    `${BASE_URL}/confirm-forgot-password`,
    userData,
    {withCredentials: true}
  );
  return response.data;
};

const authService = {
  register,
  registerVerify,
  login,
  loginVerify,
  logout,
  generateAccessToken,
  resetPassword,
  forgotPassword,
  validateConfirmForgotPassword,
  confirmForgotPassword,
};

export default authService;
