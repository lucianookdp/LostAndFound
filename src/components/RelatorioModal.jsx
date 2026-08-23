// ── components/RelatorioModal.jsx
import { FiBox, FiUser, FiShield, FiFileText } from "react-icons/fi";

const RelatorioModal = ({ log, user, onClose }) => {
  if (!log) return null;

  const cpfDisplay = log.cpf || "—";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl p-5 sm:p-6 relative overflow-y-auto max-h-[90vh]">
        
        {/* botão fechar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg"
          aria-label="Fechar"
        >
          ✕
        </button>

        {/* título */}
        <h2 className="text-xl sm:text-2xl font-bold mb-5 sm:mb-6 text-gray-900 border-b pb-3 flex items-center gap-2">
          <FiFileText className="text-emerald-700" /> Detalhes da Retirada
        </h2>

        {/* conteúdo */}
        <div className="space-y-8 text-sm sm:text-base text-gray-700">
          
          {/* Item */}
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-emerald-700 mb-3">
              <FiBox /> Item
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <span className="font-medium">Nome:</span> {log.item_nome || "—"}
              </div>
              <div>
                <span className="font-medium">Categoria:</span> {log.categoria || "—"}
              </div>
              <div>
                <span className="font-medium">Tipo:</span> {log.tipo || "—"}
              </div>
              {log.location_name && (
                <div>
                  <span className="font-medium">Local encontrado:</span>{" "}
                  {log.location_name}
                </div>
              )}
              {log.reception_name && (
                <div>
                  <span className="font-medium">Recepção entregue:</span>{" "}
                  {log.reception_name}
                </div>
              )}
              {log.caracteristicas && (
                <div className="sm:col-span-2">
                  <span className="font-medium">Características:</span>{" "}
                  {log.caracteristicas}
                </div>
              )}
            </div>
          </div>

          {/* Pessoa */}
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-emerald-700 mb-3">
              <FiUser /> Pessoa que retirou
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <span className="font-medium">Nome:</span> {log.nome || "—"}
              </div>
              <div>
                <span className="font-medium">CPF:</span> {cpfDisplay}
              </div>
              {log.telefone && (
                <div>
                  <span className="font-medium">Telefone:</span> {log.telefone}
                </div>
              )}
              {log.pessoa_tipo === "academico" && (
                <>
                  <div>
                    <span className="font-medium">RA:</span> {log.ra || "—"}
                  </div>
                  <div>
                    <span className="font-medium">Curso:</span> {log.curso || "—"}
                  </div>
                </>
              )}
              {log.security_answer && (
                <div className="sm:col-span-2">
                  <span className="font-medium">Resposta de segurança:</span>{" "}
                  {log.security_answer}
                </div>
              )}
            </div>
          </div>

          {/* Funcionário */}
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-emerald-700 mb-3">
              <FiShield /> Funcionário responsável
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <span className="font-medium">Usuário:</span>{" "}
                {log.funcionario_username || "—"}
              </div>
              <div>
                <span className="font-medium">Data da retirada:</span>{" "}
                {log.created_at || "—"}
              </div>
            </div>
          </div>

          {/* botão fechar */}
          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 transition"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelatorioModal;
