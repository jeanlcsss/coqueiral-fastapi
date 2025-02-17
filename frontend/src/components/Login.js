import React, { useState } from "react";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await login(email, senha); // Chamada ao serviço de login
      localStorage.setItem("access_token", data.access_token); // Armazena o token
      alert("Login realizado com sucesso!");
      navigate("/produtos"); // Redireciona para a página de produtos
    } catch (error) {
      console.error("Erro ao fazer login:", error.message);
      alert("Erro ao autenticar.");
    }
  };

  return (
    <form onSubmit={handleLogin}>
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
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
