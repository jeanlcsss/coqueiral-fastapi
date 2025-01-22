import React, { useEffect, useState } from "react";
import { listarProdutos } from "../services/productService";

const Produtos = () => {
  const [produtos, setProdutos] = useState([]);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const data = await listarProdutos(token); // Chamada ao serviço de produtos
        setProdutos(data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error.message);
        if (error.response?.status === 401) {
          alert("Sessão expirada. Faça login novamente.");
        }
      }
    };

    fetchProdutos();
  }, [token]);

  return (
    <ul>
      {produtos.map((produto) => (
        <li key={produto.id}>{produto.nome} - R$ {produto.preco}</li>
      ))}
    </ul>
  );
};

export default Produtos;
