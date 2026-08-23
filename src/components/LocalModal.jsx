// ── components/LocalModal.jsx
import { useEffect, useState } from "react";
import { FiX, FiMapPin, FiCheckCircle } from "react-icons/fi";

const LocalModal = ({ isOpen, onClose, onSave, local }) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (local) {
      setName(local.name || "");
    } else {
      setName("");
    }
  }, [local]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("O nome do local é obrigatório.");
      return;
    }

    const confirmar = window.confirm(
      local
        ? "Deseja confirmar a atualização deste local?"
        : "Deseja confirmar o cadastro deste novo local?"
    );
    if (!confirmar) return;

    onSave({ id: local?.id, name: name.trim() });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-emerald-700 to-emerald-800 text-white">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FiMapPin className="text-xl" />
            {local ? "Editar Local" : "Novo Local"}
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
              Nome do Local
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Biblioteca, Sala 101, Bloco A..."
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
              {local ? "Salvar Alterações" : "Cadastrar Local"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LocalModal;
