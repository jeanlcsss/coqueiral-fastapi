import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { get_usuario } from "../services/authService"; // Importa a função para validar o token

const ProtectedRoute = ({ children }) => {
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      try {
        await get_usuario(); // Chama um endpoint protegido para validar o token
        setIsValid(true);
      } catch (error) {
        localStorage.removeItem("access_token");
        setIsValid(false);
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, []);

  if (isLoading) return <div>Carregando...</div>;
  return isValid ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;