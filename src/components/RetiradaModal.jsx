// ── components/RetiradaModal.jsx
import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";

// ── utils CPF (mesmos do UserCreate)
function validarCPF(cpf) {
  const digits = cpf.replace(/\D/g, "");
  return digits.length === 11;
}

function formatarCPF(cpf) {
  cpf = cpf.replace(/\D/g, "");
  cpf = cpf.slice(0, 11);
  return cpf
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export default function RetiradaModal({ isOpen, onClose, onSubmit, item }) {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [isAcademico, setIsAcademico] = useState(false);
  const [ra, setRa] = useState("");
  const [curso, setCurso] = useState("");

  useEffect(() => {
    if (isOpen) {
      setNome("");
      setCpf("");
      setTelefone("");
      setIsAcademico(false);
      setRa("");
      setCurso("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const submit = (e) => {
    e.preventDefault();

    if (!validarCPF(cpf)) {
      alert("CPF inválido");
      return;
    }

    if (!telefone || telefone.length < 10) {
      alert("Número de telefone inválido");
      return;
    }

    onSubmit?.({
      item_id: item?.id,
      nome: nome.trim(),
      cpf: cpf.trim(),
      telefone: telefone.trim(),
      tipo: isAcademico ? "academico" : "externo",
      ra: isAcademico ? ra.trim() : null,
      curso: isAcademico ? curso.trim() : null,
    });
  };

  const handleCpfChange = (e) => {
    setCpf(formatarCPF(e.target.value));
  };

  const handleRaChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setRa(value);
  };

  const handleTelefoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);

    if (value.length <= 10) {
      value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    } else {
      value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
    }

    setTelefone(value);
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* fundo escuro */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* header */}
          <div className="flex items-center justify-between px-6 py-4 border-b bg-emerald-700 text-white">
            <h3 className="text-lg font-semibold">
              Registrar Retirada
            </h3>
            <button
              onClick={onClose}
              className="p-2 rounded-md hover:bg-emerald-600 transition"
              aria-label="Fechar"
            >
              <FiX />
            </button>
          </div>

          {/* resumo item */}
          <div className="px-6 pt-4 text-sm text-gray-700">
            <span className="font-medium text-gray-900">{item?.nome}</span>
            {item?.categoria && (
              <span className="ml-2 px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-xs">
                {item.categoria}
              </span>
            )}
          </div>

          {/* form */}
          <form onSubmit={submit} className="px-6 py-5 space-y-5">
            {/* 🔹 Pergunta de segurança e validação (qualquer item) */}
            {(item?.security_question || item?.validation_rule) && (
              <>
                {item.security_question && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pergunta de Segurança
                    </label>
                    <p className="px-3 py-2 rounded-lg bg-gray-50 border text-gray-800 italic">
                      {item.security_question}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Confirme a resposta com o dono antes de liberar o item.
                    </p>
                  </div>
                )}

                {item.validation_rule && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Validação Adicional
                    </label>
                    <p className="px-3 py-2 rounded-lg bg-gray-50 border text-gray-700">
                      {item.validation_rule}
                    </p>
                  </div>
                )}
              </>
            )}

            {/* dados da pessoa */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome da pessoa
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Ex.: Ana Souza"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CPF
              </label>
              <input
                type="text"
                value={cpf}
                onChange={handleCpfChange}
                onBlur={() => {
                  if (cpf && !validarCPF(cpf)) {
                    alert("CPF inválido");
                    setCpf("");
                  }
                }}
                maxLength={14}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="000.000.000-00"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone
              </label>
              <input
                type="tel"
                value={telefone}
                onChange={handleTelefoneChange}
                maxLength={15}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="(42) 99999-8888"
                required
              />
            </div>

            {/* toggle acadêmico */}
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-gray-700">É acadêmico?</span>
              <button
                type="button"
                onClick={() => setIsAcademico((v) => !v)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                  isAcademico ? "bg-emerald-600" : "bg-gray-300"
                }`}
                aria-pressed={isAcademico}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                    isAcademico ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {isAcademico && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    RA
                  </label>
                  <input
                    type="text"
                    value={ra}
                    onChange={handleRaChange}
                    maxLength={12}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Somente números"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Curso
                  </label>
                  <input
                    type="text"
                    value={curso}
                    onChange={(e) => setCurso(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Engenharia de Software"
                    required
                  />
                </div>
              </div>
            )}

            {/* footer */}
            <div className="pt-4 border-t flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-100 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-emerald-700 text-white text-sm font-medium hover:bg-emerald-800 transition"
              >
                Confirmar retirada
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
