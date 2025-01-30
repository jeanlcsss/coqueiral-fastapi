import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Registrar from "./components/Registrar";
import Produtos from "./components/Produtos";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Rota pública */}
        <Route path="/login" element={<Login />} />
        <Route path="/registrar" element={<Registrar />} />
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
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
