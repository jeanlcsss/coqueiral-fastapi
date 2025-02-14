import React, { useEffect, useState } from "react";
import { listarProdutos } from "../services/productService";
import { Link } from "react-router-dom";
import CriarProdutoModal from "./CriarProdutoModal"; // Componente modal
import { isAdmin } from "../services/authService";

const CatalogoProdutos = () => {
  const [produtos, setProdutos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [usuarioAdmin, setUsuarioAdmin] = useState(false);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const produtosData = await listarProdutos();
        setProdutos(produtosData);
        
        const adminStatus = isAdmin();
        setUsuarioAdmin(adminStatus);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };
    carregarDados();
  }, []);

  return (
    <div className="catalogo">
      <h1>Catálogo de Produtos</h1>
      
      {usuarioAdmin && (
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