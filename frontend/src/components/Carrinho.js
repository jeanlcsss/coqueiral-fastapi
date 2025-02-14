import React, { useEffect, useState } from "react";
import { obterCarrinho, removerDoCarrinho, finalizarPedido } from "../services/cartService";

const Carrinho = () => {
  const [carrinho, setCarrinho] = useState(null);

  useEffect(() => {
    const carregarCarrinho = async () => {
      try {
        const data = await obterCarrinho();
        setCarrinho(data);
      } catch (error) {
        console.error("Erro ao obter carrinho:", error);
      }
    };

    carregarCarrinho();
  }, []);

  const handleRemoverItem = async (itemId) => {
    try {
      await removerDoCarrinho(itemId);
      setCarrinho((prev) => ({
        ...prev,
        itens: prev.itens.filter((item) => item.id !== itemId)
      }));
    } catch (error) {
      console.error("Erro ao remover item:", error);
    }
  };

  const handleFinalizarCompra = async () => {
    try {
      await finalizarPedido();
      alert("Compra finalizada com sucesso!");
      setCarrinho(null); // Zera o carrinho após finalizar
    } catch (error) {
      console.error("Erro ao finalizar compra:", error);
    }
  };

  if (!carrinho || !carrinho.itens || carrinho.itens.length === 0) {
    return <p>Seu carrinho está vazio.</p>;
  }

  return (
    <div>
      <h1>Meu Carrinho</h1>
      <ul>
        {carrinho.itens.map((item) => (
          <li key={item.id}>
            Produto {item.produto_id} - {item.quantidade}x - R$ {item.preco_unitario * item.quantidade}
            <button onClick={() => handleRemoverItem(item.id)}>Remover</button>
          </li>
        ))}
      </ul>
      <button onClick={handleFinalizarCompra}>Finalizar Compra</button>
    </div>
  );
};

export default Carrinho;
