import axios from "axios";

const ORDER_SERVICE_URL = process.env.REACT_APP_ORDER_SERVICE_URL || "http://localhost:8002/pedidos";
const PAYMENT_SERVICE_URL = process.env.REACT_APP_PAYMENT_SERVICE_URL || "http://localhost:8002/pagamento";

// Adiciona um produto ao carrinho
export const adicionarAoCarrinho = async (produtoId, quantidade, precoUnitario) => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("Usuário não autenticado");
  }

  try {
    const response = await axios.post(
      `${ORDER_SERVICE_URL}/carrinho`,
      { produto_id: produtoId, quantidade, preco_unitario: precoUnitario },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao adicionar ao carrinho:", error);
    throw error;
  }
};

// Obtém os itens do carrinho
export const obterCarrinho = async () => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("Usuário não autenticado");
  }

  try {
    const response = await axios.get(`${ORDER_SERVICE_URL}/carrinho`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao obter carrinho:", error);
    throw error;
  }
};

// Remove um item do carrinho
export const removerDoCarrinho = async (itemId) => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("Usuário não autenticado");
  }

  try {
    await axios.delete(`${ORDER_SERVICE_URL}/carrinho/${itemId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch (error) {
    console.error("Erro ao remover item do carrinho:", error);
    throw error;
  }
};

// Finaliza o pedido
export const finalizarPedido = async () => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("Usuário não autenticado");
  }

  try {
    await axios.post(`${ORDER_SERVICE_URL}/carrinho/finalizar`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch (error) {
    console.error("Erro ao finalizar pedido:", error);
    throw error;
  }
};

// Cancela o pedido
export const cancelarPedido = async () => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("Usuário não autenticado");
  }

  try {
    await axios.post(`${ORDER_SERVICE_URL}/carrinho/cancelar`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch (error) {
    console.error("Erro ao cancelar pedido:", error);
    throw error;
  }
};

export const processarPagamento = async () => {
    const token = localStorage.getItem("access_token");
  
    try {
      const response = await axios.post(
        `${PAYMENT_SERVICE_URL}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Checkout URL:", response.data.checkout_url);
      window.location.href = response.data.checkout_url;
    } catch (error) {
      console.error("Erro ao iniciar pagamento:", error);
    }
  };