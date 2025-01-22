import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("access_token");

  // Redireciona para o login se o usuário não estiver autenticado
  return token ? children : <Navigate to="/auth/login" />;
};

export default ProtectedRoute;
