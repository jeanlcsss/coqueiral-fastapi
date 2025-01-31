import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("access_token");

  // Redireciona para o login se o token não existir
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Renderiza o conteúdo protegido
  return children;
};

export default ProtectedRoute;