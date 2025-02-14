import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProduto, deletarProduto } from "../services/productService";
import EditarProdutoModal from "./EditarProdutoModal"; // Componente modal
import { isAdmin } from "../services/authService"; // Função para verificar admin
import { adicionarAoCarrinho } from "../services/cartService";

const DetalhesProduto = () => {
  const { id } = useParams();
  const [produto, setProduto] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [usuarioAdmin, setUsuarioAdmin] = useState(false);

  useEffect(() => {
    const carregarProduto = async () => {
      try {
        const produtoData = await getProduto(id);
        setProduto(produtoData);

        // Verifica se o usuário é admin
        setUsuarioAdmin(isAdmin());
      } catch (error) {
        console.error("Erro ao carregar produto:", error);
      }
    };
    carregarProduto();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      await deletarProduto(id);
      window.location.href = "/produtos"; // Redireciona após exclusão
    }
  };

  const handleAddToCart = async () => {
    try {
      await adicionarAoCarrinho(produto.id, 1, produto.preco);
      alert("Produto adicionado ao carrinho!");
    } catch (error) {
      alert("Erro ao adicionar ao carrinho. Tente novamente.");
    }
  };

  if (!produto) return <div>Carregando...</div>;

  return (
    <div className="detalhes-produto">
      <h1>{produto.nome}</h1>
      <p>Preço: R$ {produto.preco}</p>
      <p>Descrição: {produto.descricao}</p>
      <p>Estoque: {produto.estoque}</p>

      <button onClick={handleAddToCart} className="btn-add-cart">
        Adicionar ao Carrinho
      </button>

      {usuarioAdmin && (
        <div className="admin-actions">
          <button onClick={() => setShowEditModal(true)}>Editar</button>
          <button onClick={handleDelete} className="btn-danger">Excluir</button>
        </div>
      )}

      {showEditModal && (
        <EditarProdutoModal
          produto={produto}
          onClose={() => setShowEditModal(false)}
          onSuccess={(produtoAtualizado) => {
            setProduto(produtoAtualizado);
            setShowEditModal(false);
          }}
        />
      )}
    </div>
  );
};

export default DetalhesProduto;
