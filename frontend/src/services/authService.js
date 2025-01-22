import axios from "axios";

const authService = process.env.REACT_APP_AUTH_SERVICE_URL;

export const login = async (email, senha) => {
  const params = new URLSearchParams();
  params.append("username", email);
  params.append("password", senha);

  const response = await axios.post(`${authService}/login`, params, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return response.data; // Retorna o token
};

// Função para registrar usuário
export const registrar = async (nome, email, senha) => {
  const response = await axios.post(`${authService}/registrar`, {
    nome,
    email,
    senha,
  });
  return response.data; // Retorna o usuário criado
};
