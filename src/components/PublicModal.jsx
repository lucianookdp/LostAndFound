// ── PublicModal.jsx
import { FiX, FiInfo } from "react-icons/fi";

export default function PublicModal({ open, item, onClose, formatDate }) {
  if (!open || !item) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* fundo escuro */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* container */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* header */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <div className="flex items-center gap-2">
              <FiInfo className="text-gray-700" />
              <h3 className="text-base font-semibold text-gray-900">
                {item.tipo === "prioritario" ? "Item Prioritário" : "Item Comum"}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-md hover:bg-gray-100 transition"
              aria-label="Fechar"
            >
              <FiX />
            </button>
          </div>

          {/* conteúdo */}
          <div className="px-6 py-5 space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Nome:</span>
              <span className="text-gray-900">{item.nome || "—"}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Categoria:</span>
              <span className="text-gray-900">{item.categoria || "—"}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Data de registro:</span>
              <span className="text-gray-900">{formatDate(item.data)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Recepção responsável:</span>
              <span className="text-gray-900">{item.reception_name || "—"}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Local encontrado:</span>
              <span className="text-gray-900">{item.location_name || "—"}</span>
            </div>

            {/* aviso para todos os itens */}
            <div className="rounded-lg bg-amber-50 text-amber-800 p-3 text-xs leading-relaxed">
              A retirada deste item é feita presencialmente mediante apresentação de
              documentos oficiais e confirmação de informações de segurança pela recepção.
            </div>
          </div>

          {/* footer */}
          <div className="px-6 py-4 border-t flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-900 text-white text-sm font-medium hover:opacity-90 transition"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
