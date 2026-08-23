// ── components/RecepcaoModal.jsx
import { useEffect, useState } from "react";
import { FiX, FiHome, FiCheckCircle } from "react-icons/fi";

const RecepcaoModal = ({ isOpen, onClose, onSave, recepcao }) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (recepcao) {
      setName(recepcao.name || "");
    } else {
      setName("");
    }
  }, [recepcao]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("O nome da recepção é obrigatório.");
      return;
    }

    const confirmar = window.confirm(
      recepcao
        ? "Deseja confirmar a atualização desta recepção?"
        : "Deseja confirmar o cadastro desta nova recepção?"
    );
    if (!confirmar) return;

    onSave({ id: recepcao?.id, name: name.trim() });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-emerald-700 to-emerald-800 text-white">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FiHome className="text-xl" />
            {recepcao ? "Editar Recepção" : "Nova Recepção"}
          </h2>
          <button
            onClick={onClose}
            className="text-white/90 hover:text-white text-xl"
            aria-label="Fechar"
          >
            <FiX />
          </button>
        </div>

        {/* Corpo */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome da Recepção
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Bloco Central, Portaria, Biblioteca..."
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
              required
            />
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 transition"
            >
              <FiCheckCircle />
              {recepcao ? "Salvar Alterações" : "Cadastrar Recepção"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecepcaoModal;
