import React, { useEffect, useState } from "react";
import { listarProdutos, criarProduto } from "../services/productService";

const Produtos = () => {
  const [produtos, setProdutos] = useState([]);
  const [novoProduto, setNovoProduto] = useState({ nome: "", descricao: "", preco: 0, estoque: 0 });
  const token = localStorage.getItem("access_token");

  // Listar produtos ao carregar o componente
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

  // Criar produto
  const handleCriarProduto = async (e) => {
    e.preventDefault();
    try {
      const produtoCriado = await criarProduto(novoProduto, token);
      setProdutos([...produtos, produtoCriado]); // Atualiza a lista de produtos
      setNovoProduto({ nome: "", descricao: "", preco: 0, estoque: 0 }); // Limpa o formulário
      alert("Produto criado com sucesso!");
    } catch (error) {
      console.error("Erro ao criar produto:", error.message);
      alert("Erro ao criar produto. Verifique os dados e tente novamente.");
      if (error.response?.status === 401) {
        alert("Sessão expirada. Faça login novamente.");
      }
    }
  }; // <== Fechamento correto da função `handleCriarProduto`

  return (
    <div>
      <h1>Produtos</h1>
      <ul>
        {produtos.map((produto) => (
          <li key={produto.id}>
            {produto.nome} - R$ {produto.preco}
          </li>
        ))}
      </ul>

      <h2>Criar Novo Produto</h2>
      <form onSubmit={handleCriarProduto}>
        <input
          type="text"
          placeholder="Nome do Produto"
          value={novoProduto.nome}
          onChange={(e) =>
            setNovoProduto({ ...novoProduto, nome: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Preço"
          value={novoProduto.preco}
          onChange={(e) =>
            setNovoProduto({ ...novoProduto, preco: parseFloat(e.target.value) })
          }
        />
        <input
          type="text"
          placeholder="Descrição do Produto"
          value={novoProduto.descricao}
          onChange={(e) =>
            setNovoProduto({ ...novoProduto, descricao: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Estoque"
          value={novoProduto.estoque}
          onChange={(e) =>
            setNovoProduto({ ...novoProduto, estoque: parseInt(e.target.value) })
          }
        />
        <button type="submit">Criar Produto</button>
      </form>
    </div>
  );
};

export default Produtos;
