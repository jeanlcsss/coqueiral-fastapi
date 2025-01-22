import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Produtos from "./components/Produtos";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Rota pública */}
        <Route path="/auth/login" element={<Login />} />

        {/* Rotas protegidas */}
        <Route
          path="/produtos"
          element={
            <ProtectedRoute>
              <Produtos />
            </ProtectedRoute>
          }
        />

        {/* Rota padrão */}
        <Route path="*" element={<h1>404 - Página Não Encontrada</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
