// ── components/UserModal.jsx
import { useEffect, useState } from "react";
import {
  FiEye,
  FiEyeOff,
  FiX,
  FiUserPlus,
  FiEdit2,
  FiKey,
  FiUser,
} from "react-icons/fi";

// Função simples para formatar CPF
function formatarCPF(cpf) {
  if (!cpf) return "";
  cpf = cpf.replace(/\D/g, "").slice(0, 11);
  return cpf
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export default function UserModal({
  type,
  onClose,
  onSubmit,
  data = {},
  receptions = [],
  loading,
}) {
  const [showPassword1, setShowPassword1] = useState(false); // Ícone do campo senha
  const [showPassword2, setShowPassword2] = useState(false); // Ícone do campo confirmar senha

  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    nome: "",
    cpf: "",
    reception_id: "",
  });

  useEffect(() => {
    if (data) {
      setForm((prev) => ({
        ...prev,
        username: data.username || "",
        nome: data.nome || "",
        cpf: data.cpf || "",
        reception_id: data.reception_id || "",
      }));
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "cpf") {
      setForm({ ...form, [name]: formatarCPF(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  const isPassword = type === "password";
  const isView = type === "view";
  const isEdit = type === "edit";
  const isCreate = type === "create";

  const renderField = (label, value, inputEl) => (
    <div className="flex flex-col">
      <label className="text-sm font-medium mb-1 text-gray-700">{label}</label>
      {isView ? (
        <p className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md">
          {value || "—"}
        </p>
      ) : (
        inputEl
      )}
    </div>
  );

  const headerContent = {
    create: { icon: <FiUserPlus />, title: "Cadastrar Novo Usuário" },
    edit: { icon: <FiEdit2 />, title: "Editar Usuário" },
    password: { icon: <FiKey />, title: "Alterar Senha" },
    view: { icon: <FiUser />, title: "Detalhes do Usuário" },
  }[type] || { icon: <FiUser />, title: "Usuário" };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">

        {/* Cabeçalho */}
        <div
          className={`px-5 py-4 flex items-center justify-between ${
            isView
              ? "bg-gradient-to-r from-emerald-600 to-emerald-700"
              : "bg-gradient-to-r from-emerald-700 to-emerald-800"
          } text-white`}
        >
          <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
            {headerContent.icon}
            {headerContent.title}
          </h2>
          <button
            onClick={onClose}
            className="text-white/90 hover:text-white text-xl"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        {/* Conteúdo */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 text-gray-700">

          {isView ? (
            <div className="space-y-3">
              {renderField("Usuário", data.username)}
              {renderField("Nome Completo", data.nome)}
              {renderField("CPF", data.cpf)}
              {renderField("Recepção", data.reception_name)}
              {renderField(
                "Função",
                data.role === "admin" ? "Administrador" : "Funcionário"
              )}
            </div>
          ) : (
            <>
              {/* Usuário */}
              {(isCreate || isEdit) &&
                isCreate &&
                renderField(
                  "Usuário",
                  form.username,
                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                    placeholder="Digite o nome de usuário"
                  />
                )}

              {/* Nome */}
              {(isCreate || isEdit) &&
                renderField(
                  "Nome Completo",
                  form.nome,
                  <input
                    type="text"
                    name="nome"
                    value={form.nome}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                    placeholder="Digite o nome completo"
                  />
                )}

              {/* CPF */}
              {(isCreate || isEdit) &&
                renderField(
                  "CPF",
                  form.cpf,
                  <input
                    type="text"
                    name="cpf"
                    value={form.cpf}
                    onChange={handleChange}
                    maxLength={14}
                    required
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                    placeholder="000.000.000-00"
                  />
                )}

              {/* Recepção */}
              {(isCreate || isEdit) &&
                renderField(
                  "Recepção",
                  receptions.find((r) => r.id === Number(form.reception_id))
                    ?.name,
                  <select
                    name="reception_id"
                    value={form.reception_id}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Selecione a recepção</option>
                    {receptions.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                )}

              {/* Campo Senha — criação */}
              {isCreate &&
                renderField(
                  "Senha",
                  form.password,
                  <div className="relative">
                    <input
                      type={showPassword1 ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      required
                      className="w-full border rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-emerald-500"
                      placeholder="Digite uma senha segura"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword1(!showPassword1)}
                      className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword1 ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                )}

              {/* Senha — alterar senha */}
              {isPassword && (
                <>
                  {/* Nova senha */}
                  {renderField(
                    "Nova Senha",
                    form.password,
                    <div className="relative">
                      <input
                        type={showPassword1 ? "text" : "password"}
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-emerald-500"
                        placeholder="Digite a nova senha"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword1(!showPassword1)}
                        className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword1 ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                  )}

                  {/* Confirmar senha */}
                  {renderField(
                    "Confirmar Senha",
                    form.confirmPassword,
                    <div className="relative">
                      <input
                        type={showPassword2 ? "text" : "password"}
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-emerald-500"
                        placeholder="Confirme a senha"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword2(!showPassword2)}
                        className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword2 ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {/* Botões */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
            >
              {isView ? "Fechar" : "Cancelar"}
            </button>

            {!isView && (
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 disabled:opacity-60"
              >
                {loading
                  ? "Salvando..."
                  : isEdit
                  ? "Salvar Alterações"
                  : isPassword
                  ? "Atualizar Senha"
                  : "Salvar Usuário"}
              </button>
            )}
          </div>

        </form>
      </div>
    </div>
  );
}
