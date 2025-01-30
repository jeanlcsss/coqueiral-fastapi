import React, { useState } from "react";
import { registrar } from "../services/authService";
import { useNavigate } from "react-router-dom";

const Registrar = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  const handleRegistrar = async (e) => {
    e.preventDefault();
    try {
      await registrar(nome, email, senha);
      alert("Registro realizado! Faça login.");
      navigate("/login"); // Redireciona para o login após sucesso
    } catch (error) {
      console.error("Erro ao registrar:", error);
      alert("Erro ao criar conta. Verifique os dados.");
    }
  };

  return (
    <form onSubmit={handleRegistrar}>
      <input
        type="text"
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
      />
      <button type="submit">Registrar</button>
    </form>
  );
};

export default Registrar;