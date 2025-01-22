import axios from "axios";

// URL base da API de produtos (vem do .env)
const productService = process.env.REACT_APP_PRODUCT_SERVICE_URL;

// Função para listar produtos
export const listarProdutos = async (token) => {
  const response = await axios.get(productService, {
    headers: {
      Authorization: `Bearer ${token}`, // Token JWT no cabeçalho
    },
  });
  return response.data; // Retorna a lista de produtos
};

// Função para criar um produto (exige token de administrador)
export const criarProduto = async (produto, token) => {
  const response = await axios.post(productService, produto, {
    headers: {
      Authorization: `Bearer ${token}`, // Token JWT no cabeçalho
    },
  });
  return response.data; // Retorna o produto criado
};
