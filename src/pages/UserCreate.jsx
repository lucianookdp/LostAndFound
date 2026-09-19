// ── pages/UserCreate.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiKey, FiTrash2, FiEye, FiEdit, FiUsers } from "react-icons/fi";
import HeaderAdmin from "../components/HeaderAdmin";
import Footer from "../components/Footer";
import UserModal from "../components/UserModal";

// ── URL base do backend (Railway)
const BASE_URL = "https://backendtcc-production-ec04.up.railway.app/api";

// ── Funções utilitárias de CPF
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

function mascararCPF(cpf) {
  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11) return cpf;
  return `***.${digits.slice(3, 6)}.***-${digits.slice(8)}`;
}

const ITEMS_PER_PAGE = 10;

const UserCreate = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [receptions, setReceptions] = useState([]);
  const [loading, setLoading] = useState(false);

  // controle de modais
  const [modalType, setModalType] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  // paginação e notificação
  const [toast, setToast] = useState(null);
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const storedUser = sessionStorage.getItem("auth_user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    if (!user || user.role !== "admin") {
      navigate("/admin-login");
    } else {
      fetchUsers();
      fetchReceptions();
    }
  }, []);

  async function fetchUsers() {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/auth/users`, { credentials: "include" });
      const data = await res.json();
      if (res.ok) setUsers(data);
      else showToast(data.message || "Erro ao carregar usuários", "error");
    } catch {
      showToast("Erro ao carregar usuários", "error");
    } finally {
      setLoading(false);
    }
  }

  async function fetchReceptions() {
    try {
      const res = await fetch(`${BASE_URL}/receptions`, { credentials: "include" });
      const data = await res.json();
      if (res.ok) setReceptions(data);
    } catch {
      console.error("Erro ao carregar recepções");
    }
  }

  // ────────────────────────────────────────
  // CRIAR USUÁRIO
  async function handleCreateUser(form) {
    const { username, password, nome, cpf, reception_id } = form;

    if (!username || !password || !nome || !cpf || !reception_id) {
      showToast("Preencha todos os campos obrigatórios", "error");
      return;
    }
    if (!validarCPF(cpf)) {
      showToast("CPF inválido", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
          nome: nome.trim(),
          cpf: cpf.replace(/\D/g, ""),
          reception_id: Number(reception_id),
          role: "func",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("Erro API:", data);
        throw new Error(data.message || "Erro ao criar usuário");
      }

      showToast("Usuário criado com sucesso!");
      setModalType(null);
      setSelectedUser(null);
      fetchUsers();
    } catch (err) {
      console.error("Erro ao criar usuário:", err);
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  // ────────────────────────────────────────
  // EDITAR USUÁRIO
  async function handleUpdateUser(form) {
    if (!form.nome || !form.cpf || !form.reception_id) {
      showToast("Preencha todos os campos obrigatórios", "error");
      return;
    }
    if (!validarCPF(form.cpf)) {
      showToast("CPF inválido", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/users/${selectedUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          nome: form.nome.trim(),
          cpf: form.cpf.replace(/\D/g, ""),
          reception_id: Number(form.reception_id),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Erro ao atualizar usuário");
      }

      showToast("Usuário atualizado com sucesso!");
      setModalType(null);
      fetchUsers();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  // ────────────────────────────────────────
  // ALTERAR SENHA
  async function handleUpdatePassword(form) {
    if (!form.password || form.password.length < 4) {
      showToast("Senha deve ter pelo menos 4 caracteres", "error");
      return;
    }
    if (form.password !== form.confirmPassword) {
      showToast("As senhas não coincidem", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/users/${selectedUser.id}/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password: form.password.trim() }),
      });
      if (!res.ok) throw new Error("Erro ao atualizar senha");
      showToast("Senha atualizada com sucesso!");
      setModalType(null);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  // ────────────────────────────────────────
  // EXCLUIR USUÁRIO
  async function handleDelete(id) {
    if (!window.confirm("Deseja realmente excluir este funcionário?")) return;

    try {
      const res = await fetch(`${BASE_URL}/auth/users/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();

      if (res.status === 409) {
        showToast(
          data.message ||
            "Não é possível excluir o funcionário vinculado a itens.",
          "error"
        );
        return;
      }
      if (!res.ok) throw new Error(data.message || "Erro ao excluir usuário");

      showToast("Funcionário excluído com sucesso!");
      fetchUsers();
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  const papel = (role) =>
    role === "admin" ? "Administrador" : role === "func" ? "Funcionário" : "—";

  // ─────────────────────────────────────────────
  // AÇÕES (mesmas na tabela e nos cards)
  const renderAcoes = (u, alinhamento) =>
    u.role === "admin" ? (
      <div className="text-gray-400 italic text-sm">Protegido</div>
    ) : (
      <div className={`flex items-center gap-4 text-lg ${alinhamento}`}>
        <button
          title="Visualizar usuário"
          onClick={() => {
            setSelectedUser(u);
            setModalType("view");
          }}
          className="text-gray-600 hover:text-emerald-600"
        >
          <FiEye />
        </button>
        <button
          title="Editar dados"
          onClick={() => {
            setSelectedUser(u);
            setModalType("edit");
          }}
          className="text-gray-600 hover:text-yellow-500"
        >
          <FiEdit />
        </button>
        <button
          title="Alterar senha"
          onClick={() => {
            setSelectedUser(u);
            setModalType("password");
          }}
          className="text-gray-600 hover:text-emerald-700"
        >
          <FiKey />
        </button>
        <button
          title="Excluir usuário"
          onClick={() => handleDelete(u.id)}
          className="text-gray-600 hover:text-red-600"
        >
          <FiTrash2 />
        </button>
      </div>
    );

  // ─────────────────────────────────────────────
  // CARD (abaixo de md: na tabela as ações ficariam fora da tela)
  const renderCard = (u) => (
    <div
      key={u.id}
      className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 truncate">{u.nome || "—"}</p>
          <p className="text-sm text-gray-500 truncate">{u.username}</p>
        </div>
        <span className="shrink-0 rounded px-2 py-1 text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
          {papel(u.role)}
        </span>
      </div>

      <dl className="mt-3 space-y-1 text-sm text-gray-600">
        <div>
          <dt className="inline text-gray-500">CPF: </dt>
          <dd className="inline">{u.cpf ? mascararCPF(u.cpf) : "—"}</dd>
        </div>
        <div>
          <dt className="inline text-gray-500">Recepção: </dt>
          <dd className="inline">{u.reception_name || "—"}</dd>
        </div>
      </dl>

      <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end">
        {renderAcoes(u, "justify-end")}
      </div>
    </div>
  );

  const paginate = (data, page) => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return data.slice(start, start + ITEMS_PER_PAGE);
  };

  // ────────────────────────────────────────
  // INTERFACE
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <HeaderAdmin />

      {toast && (
        <div
          className={`fixed top-4 right-4 px-4 py-2 rounded-lg shadow-md text-white z-50 ${
            toast.type === "error" ? "bg-red-600" : "bg-emerald-600"
          }`}
        >
          {toast.message}
        </div>
      )}

      <main className="flex-1 w-full max-w-6xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-10 text-center flex items-center justify-center gap-2">
          <FiUsers className="text-emerald-700" /> Gerenciar Usuários
        </h1>

        <section className="bg-white shadow-lg rounded-2xl border border-gray-200">
          <div className="p-6 border-b bg-gradient-to-r from-emerald-700 to-emerald-800 rounded-t-2xl text-white flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div>
              <h2 className="text-xl font-semibold">Funcionários</h2>
              <p className="text-sm text-emerald-100">
                Controle completo de contas de recepcionistas e administradores
                do sistema.
              </p>
            </div>
            <button
              onClick={() => {
                setModalType("create");
                setSelectedUser(null);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-white text-emerald-700 font-medium hover:bg-emerald-50 transition-colors"
            >
              + Novo Usuário
            </button>
          </div>

          {/* tabela: md para cima */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-700 font-semibold uppercase tracking-wide">
                <tr>
                  <th className="px-5 py-3 text-left">Usuário</th>
                  <th className="px-5 py-3 text-left">Nome</th>
                  <th className="px-5 py-3 text-left">CPF</th>
                  <th className="px-5 py-3 text-left">Recepção</th>
                  <th className="px-5 py-3 text-left">Função</th>
                  <th className="px-5 py-3 text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-gray-500">
                      Carregando...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-gray-500">
                      Nenhum usuário encontrado.
                    </td>
                  </tr>
                ) : (
                  paginate(users, page).map((u) => (
                    <tr
                      key={u.id}
                      className="border-t hover:bg-emerald-50 transition"
                    >
                      <td className="px-5 py-3">{u.username}</td>
                      <td className="px-5 py-3">{u.nome || "—"}</td>
                      <td className="px-5 py-3">
                        {u.cpf ? mascararCPF(u.cpf) : "—"}
                      </td>
                      <td className="px-5 py-3">{u.reception_name || "—"}</td>
                      <td className="px-5 py-3">{papel(u.role)}</td>
                      <td className="px-5 py-3 text-center">
                        {renderAcoes(u, "justify-center")}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* cards: abaixo de md */}
          <div className="md:hidden p-4 space-y-3">
            {loading ? (
              <p className="py-6 text-center text-gray-500">Carregando...</p>
            ) : users.length === 0 ? (
              <p className="py-6 text-center text-gray-500">
                Nenhum usuário encontrado.
              </p>
            ) : (
              paginate(users, page).map(renderCard)
            )}
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 py-5 border-t bg-gray-50 rounded-b-2xl">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-md border text-gray-600 hover:bg-gray-100 disabled:opacity-40"
              >
                «
              </button>
              <span className="text-sm text-gray-700 font-medium">
                Página {page} de {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-md border text-gray-600 hover:bg-gray-100 disabled:opacity-40"
              >
                »
              </button>
            </div>
          )}
        </section>
      </main>

      <Footer />

      {/* ──────────────────────────────── */}
      {/* MODAL REUTILIZÁVEL */}
      {/* ──────────────────────────────── */}
      {modalType && (
        <UserModal
          type={modalType}
          data={modalType === "create" ? {} : selectedUser}
          receptions={receptions}
          onClose={() => setModalType(null)}
          onSubmit={
            modalType === "create"
              ? handleCreateUser
              : modalType === "edit"
              ? handleUpdateUser
              : modalType === "password"
              ? handleUpdatePassword
              : null
          }
          loading={loading}
        />
      )}
    </div>
  );
};

export default UserCreate;
