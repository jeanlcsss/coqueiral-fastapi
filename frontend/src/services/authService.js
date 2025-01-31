import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_AUTH_SERVICE_URL;

const authService = process.env.REACT_APP_AUTH_SERVICE_URL;

export const login = async (email, senha) => {
  const params = new URLSearchParams();
  params.append("username", email);
  params.append("password", senha);

  try {
    const response = await axios.post("/login", params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    // Configura o token no localStorage e no Axios
    localStorage.setItem("access_token", response.data.access_token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.access_token}`;

    return response.data; // Retorna o token
  } catch (error) {
    throw error.response.data; // Retorna o erro
  }
};

// Função para registrar usuário
export const registrar = async (nome, email, senha) => {
  try {
    const response = await axios.post("/registrar", { nome, email, senha });
    return response.data; // Retorna o usuário criado
  }  catch (error) {
    throw error.response.data; // Retorna o erro
  }
};

export const get_usuario = async () => {
  const token = localStorage.getItem("access_token");
  
  if (!token) {
    throw new Error("Token não encontrado");
  }

  try {
    const response = await axios.get(`${authService}/get_usuario`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
    }
    throw error;
  }
};
