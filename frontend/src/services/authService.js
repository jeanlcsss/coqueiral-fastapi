import axios from "axios";

// Configura a base URL da API de autenticação
const authService = process.env.REACT_APP_AUTH_SERVICE_URL;
axios.defaults.baseURL = authService;

// Função para login
export const login = async (email, senha) => {
  const params = new URLSearchParams();
  params.append("username", email);
  params.append("password", senha);

  try {
    const response = await axios.post("/login", params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    // Salva o token no localStorage
    const token = response.data.access_token;
    localStorage.setItem("access_token", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    return response.data; // Retorna os dados do login
  } catch (error) {
    console.error("Erro ao fazer login:", error.response?.data || error.message);
    throw error.response?.data || { message: "Erro ao autenticar" };
  }
};

// Função para registrar usuário
export const registrar = async (nome, email, senha) => {
  try {
    const response = await axios.post(`${authService}/registrar`, { nome, email, senha });
    return response.data;
  } catch (error) {
    console.error("Erro ao registrar usuário:", error.response?.data || error.message);
    throw error.response?.data || { message: "Erro ao registrar" };
  }
};

// Função para buscar dados do usuário autenticado
export const getUsuario = async () => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("Token não encontrado. Faça login novamente.");
  }

  try {
    const response = await axios.get(`${authService}/usuario`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao obter usuário:", error.response?.data || error.message);
    
    // Se o token for inválido ou expirado, remove e força logout
    if (error.response?.status === 401) {
      logout();
    }

    throw error.response?.data || { message: "Erro ao obter usuário" };
  }
};

// Função para verificar se o usuário é admin
export const isAdmin = () => {
  const token = localStorage.getItem("access_token");

  if (!token) return false;

  try {
    // Decodifica o payload do JWT
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.is_admin === true;
  } catch (error) {
    console.error("Erro ao verificar admin:", error);
    return false;
  }
};

// Função para logout
export const logout = () => {
  localStorage.removeItem("access_token");
  delete axios.defaults.headers.common["Authorization"];
};
