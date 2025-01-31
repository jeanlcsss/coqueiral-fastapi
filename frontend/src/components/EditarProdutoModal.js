import React, { useState, useEffect } from "react";
import { editarProduto } from "../services/productService";

const EditarProdutoModal = ({ produto, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    nome: produto.nome,
    descricao: produto.descricao,
    preco: produto.preco,
    estoque: produto.estoque
  });

  // Atualiza o formulário quando o produto prop muda
  useEffect(() => {
    setForm({
      nome: produto.nome,
      descricao: produto.descricao,
      preco: produto.preco,
      estoque: produto.estoque
    });
  }, [produto]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const produtoAtualizado = await editarProduto(produto.id, form);
      onSuccess(produtoAtualizado);
    } catch (error) {
      alert(`Erro ao atualizar produto: ${error.message}`);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Editar Produto</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nome"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            required
          />
          
          <input
            type="number"
            placeholder="Preço"
            value={form.preco}
            onChange={(e) => setForm({ ...form, preco: parseFloat(e.target.value) })}
            step="0.01"
            required
          />
          
          <textarea
            placeholder="Descrição"
            value={form.descricao}
            onChange={(e) => setForm({ ...form, descricao: e.target.value })}
            rows="4"
          />
          
          <input
            type="number"
            placeholder="Estoque"
            value={form.estoque}
            onChange={(e) => setForm({ ...form, estoque: parseInt(e.target.value) })}
            min="0"
            required
          />

          <div className="modal-actions">
            <button type="submit" className="btn-primary">
              Salvar Alterações
            </button>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarProdutoModal;