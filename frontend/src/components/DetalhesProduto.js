import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProduto, editarProduto, deletarProduto } from "../services/productService";
import EditarProdutoModal from "./EditarProdutoModal"; // Componente modal

const DetalhesProduto = () => {
  const { id } = useParams();
  const [produto, setProduto] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const carregarProduto = async () => {
      try {
        const produtoData = await getProduto(id);
        setProduto(produtoData);
        
        // Verificar admin
        const userData = JSON.parse(localStorage.getItem("user"));
        setIsAdmin(userData?.is_admin || false);
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

  if (!produto) return <div>Carregando...</div>;

  return (
    <div className="detalhes-produto">
      <h1>{produto.nome}</h1>
      <p>Preço: R$ {produto.preco}</p>
      <p>Descrição: {produto.descricao}</p>
      <p>Estoque: {produto.estoque}</p>

      {isAdmin && (
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