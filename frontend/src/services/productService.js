import axios from "axios";

// URL base da API de produtos (definida no .env)
const productService = process.env.REACT_APP_PRODUCT_SERVICE_URL;

// Configuração global do Axios para incluir o token JWT automaticamente
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Função para tratamento genérico de erros
const handleError = (error) => {
  if (error.response) {
    // Erros 4xx/5xx
    throw new Error(
      error.response.data.detail || "Erro ao processar a requisição"
    );
  } else if (error.request) {
    // Sem resposta do servidor
    throw new Error("Sem resposta do servidor. Verifique sua conexão.");
  } else {
    // Erro de configuração
    throw new Error("Erro na configuração da requisição");
  }
};

// Listar todos os produtos
export const listarProdutos = async () => {
  try {
    const response = await axios.get(`${productService}/`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Buscar produto por ID
export const getProduto = async (id) => {
  try {
    const response = await axios.get(`${productService}/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Criar novo produto (admin)
export const criarProduto = async (produto) => {
  try {
    const response = await axios.post(`${productService}/`, produto);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Atualizar produto (admin)
export const editarProduto = async (id, produto) => {
  try {
    const response = await axios.put(`${productService}/${id}`, produto);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Deletar produto (admin)
export const deletarProduto = async (id) => {
  try {
    const response = await axios.delete(`${productService}/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
