import React, { useEffect, useState } from "react";
import { listarProdutos } from "../services/productService";
import { Link } from "react-router-dom";
import CriarProdutoModal from "./CriarProdutoModal"; // Componente modal

const CatalogoProdutos = () => {
  const [produtos, setProdutos] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const produtosData = await listarProdutos();
        setProdutos(produtosData);
        
        // Verificar se é admin
        const userData = JSON.parse(localStorage.getItem("user"));
        setIsAdmin(userData?.is_admin || false);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      }
    };
    carregarDados();
  }, []);

  return (
    <div className="catalogo">
      <h1>Catálogo de Produtos</h1>
      
      {isAdmin && (
        <button onClick={() => setShowModal(true)} className="btn-admin">
          Adicionar Novo Produto
        </button>
      )}

      <div className="produtos-grid">
        {produtos.map((produto) => (
          <div key={produto.id} className="produto-card">
            <Link to={`/produtos/${produto.id}`}>
              <h3>{produto.nome}</h3>
              <p>R$ {produto.preco}</p>
            </Link>
          </div>
        ))}
      </div>

      {showModal && (
        <CriarProdutoModal
          onClose={() => setShowModal(false)}
          onSuccess={(novoProduto) => {
            setProdutos([...produtos, novoProduto]);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
};

export default CatalogoProdutos;