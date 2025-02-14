import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import Registrar from "./components/Registrar";
import ProtectedRoute from "./components/ProtectedRoute";
import CatalogoProdutos from "./components/CatalogoProdutos";
import DetalhesProduto from "./components/DetalhesProduto";
import Carrinho from "./components/Carrinho";

function App() {
  return (
    <Router>
      <Routes>
        {/* Rota pública */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registrar" element={<Registrar />} />
        <Route path="/carrinho" element={<Carrinho />} />
        {/* Rotas protegidas */}
        <Route
          path="/produtos"
          element={
            <ProtectedRoute>
              <CatalogoProdutos /> {/* Página principal de produtos */}
            </ProtectedRoute>
          }
        />
        <Route
          path="/produtos/:id"
          element={
            <ProtectedRoute>
              <DetalhesProduto /> {/* Detalhes de um produto específico */}
            </ProtectedRoute>
          }
        />


        {/* Rota padrão */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
