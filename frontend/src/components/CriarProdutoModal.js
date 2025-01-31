import React, { useState } from "react";
import { criarProduto } from "../services/productService";

const CriarProdutoModal = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    preco: 0,
    estoque: 0
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const novoProduto = await criarProduto(form);
      onSuccess(novoProduto);
    } catch (error) {
      alert("Erro ao criar produto: " + error.message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Novo Produto</h2>
        <form onSubmit={handleSubmit}>
          {/* Campos do formulário */}
          <button type="submit">Criar</button>
          <button type="button" onClick={onClose}>Cancelar</button>
        </form>
      </div>
    </div>
  );
};

export default CriarProdutoModal;