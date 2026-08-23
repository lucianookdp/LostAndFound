// ── pages/AdminRelatorios.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderAdmin from "../components/HeaderAdmin";
import HeaderFunc from "../components/HeaderFunc";
import Footer from "../components/Footer";
import RelatoriosFilter from "../components/RelatoriosFilter";
import RelatorioModal from "../components/RelatorioModal";
import ExportRelatorioModal from "../components/ExportRelatorioModal";
import {
  FiEye,
  FiTrash2,
  FiDownload,
  FiFileText,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import {
  getWithdrawals,
  deleteWithdrawal,
  downloadWithdrawalsReport,
} from "../services/withdrawalsApi";

// ── Função de máscara de CPF (igual ao UserCreate)
function mascararCPF(cpf) {
  if (!cpf) return "—";
  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11) return cpf;
  return `***.${digits.slice(3, 6)}.***-${digits.slice(8)}`;
}

const ITEMS_PER_PAGE = 10;

const AdminRelatorios = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [filters, setFilters] = useState({});
  const [toast, setToast] = useState(null);
  const [page, setPage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const months = useMemo(
    () => [
      { value: "01", label: "Janeiro" },
      { value: "02", label: "Fevereiro" },
      { value: "03", label: "Março" },
      { value: "04", label: "Abril" },
      { value: "05", label: "Maio" },
      { value: "06", label: "Junho" },
      { value: "07", label: "Julho" },
      { value: "08", label: "Agosto" },
      { value: "09", label: "Setembro" },
      { value: "10", label: "Outubro" },
      { value: "11", label: "Novembro" },
      { value: "12", label: "Dezembro" },
    ],
    []
  );

  const storedUser = sessionStorage.getItem("auth_user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  }

  useEffect(() => {
    if (!user) navigate("/admin-login");
  }, [user, navigate]);

  useEffect(() => {
    if (user?.role === "admin") fetchLogs(filters);
    setPage(1);
  }, [filters]);

  async function fetchLogs(f = {}) {
    try {
      setLoading(true);
      const data = await getWithdrawals(f);
      setLogs(Array.isArray(data) ? data : []);
    } catch (err) {
      showToast(err?.message || "Erro ao carregar relatórios", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Tem certeza que deseja excluir este relatório?")) return;
    try {
      await deleteWithdrawal(id);
      showToast("Relatório excluído com sucesso!");
      fetchLogs(filters);
    } catch (err) {
      showToast(err?.message || "Erro ao excluir relatório", "error");
    }
  }

  async function handleDownload(periodo) {
    try {
      if (periodo === "mensal") {
        if (!selectedMonth) {
          showToast("Selecione o mês para o relatório mensal", "error");
          return;
        }
        await downloadWithdrawalsReport("mensal", { mes: selectedMonth, ano: selectedYear });
      } else if (periodo === "anual") {
        await downloadWithdrawalsReport("anual", { ano: selectedYear });
      } else {
        await downloadWithdrawalsReport(periodo);
      }
      setShowExportModal(false);
      showToast("Relatório PDF gerado com sucesso!");
    } catch (err) {
      showToast(err?.message || "Erro ao gerar relatório PDF", "error");
    }
  }

  const totalPages = Math.ceil(logs.length / ITEMS_PER_PAGE);
  const paginatedLogs = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return logs.slice(start, start + ITEMS_PER_PAGE);
  }, [logs, page]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {user?.role === "admin" ? <HeaderAdmin /> : <HeaderFunc />}

      {toast && (
        <div
          className={`fixed top-4 right-4 sm:right-6 px-4 py-2 rounded-lg shadow-md text-white text-sm z-50 ${
            toast.type === "error" ? "bg-red-600" : "bg-emerald-600"
          }`}
        >
          {toast.msg}
        </div>
      )}

      <main className="flex-1 w-full max-w-7xl mx-auto py-8 sm:py-10 px-3 sm:px-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8 sm:mb-10 text-center flex items-center justify-center gap-2">
          <FiFileText className="text-emerald-700" /> Relatórios de Retiradas
        </h1>

        <section className="bg-white shadow-md sm:shadow-lg rounded-2xl border border-gray-200 overflow-hidden">
          <div className="p-4 sm:p-6 border-b bg-gradient-to-r from-emerald-700 to-emerald-800 text-white flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold">Histórico de Retiradas</h2>
              <p className="text-xs sm:text-sm text-emerald-100">
                Consulte registros e exporte relatórios em PDF.
              </p>
            </div>
            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-md bg-white text-emerald-700 font-medium hover:bg-emerald-50 transition-colors text-sm sm:text-base"
            >
              <FiDownload /> Exportar
            </button>
          </div>

          {user?.role === "admin" && (
            <div className="px-3 sm:px-4 pt-4 pb-2 border-b bg-gray-50">
              <RelatoriosFilter onFilterChange={setFilters} />
            </div>
          )}

          {/* tabela desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-700 font-semibold uppercase tracking-wide">
                <tr>
                  <th className="px-5 py-3 text-left">Item</th>
                  <th className="px-5 py-3 text-left">Categoria</th>
                  <th className="px-5 py-3 text-left">Pessoa</th>
                  <th className="px-5 py-3 text-left">CPF</th>
                  <th className="px-5 py-3 text-left">Funcionário</th>
                  <th className="px-5 py-3 text-left">Data</th>
                  <th className="px-5 py-3 text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-500">
                      Carregando...
                    </td>
                  </tr>
                ) : paginatedLogs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-500">
                      Nenhum relatório encontrado.
                    </td>
                  </tr>
                ) : (
                  paginatedLogs.map((log) => (
                    <tr key={log.id} className="border-t hover:bg-emerald-50 transition">
                      <td className="px-5 py-3">{log.item_nome}</td>
                      <td className="px-5 py-3">{log.categoria}</td>
                      <td className="px-5 py-3">{log.nome}</td>
                      <td className="px-5 py-3">{mascararCPF(log.cpf)}</td>
                      <td className="px-5 py-3">{log.funcionario_username}</td>
                      <td className="px-5 py-3">{log.created_at || "—"}</td>
                      <td className="px-5 py-3 text-center">
                        <div className="flex items-center justify-center gap-3 text-lg">
                          <button
                            onClick={() => setSelectedLog(log)}
                            className="text-gray-600 hover:text-emerald-600"
                            title="Visualizar detalhes"
                          >
                            <FiEye />
                          </button>
                          {user?.role === "admin" && (
                            <button
                              onClick={() => handleDelete(log.id)}
                              className="text-gray-600 hover:text-red-600"
                              title="Excluir relatório"
                            >
                              <FiTrash2 />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* lista mobile */}
          <div className="md:hidden">
            {loading ? (
              <p className="p-4 text-center text-gray-500">Carregando...</p>
            ) : paginatedLogs.length === 0 ? (
              <p className="p-4 text-center text-gray-500">
                Nenhum relatório encontrado.
              </p>
            ) : (
              <div className="divide-y divide-gray-200">
                {paginatedLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-4 bg-white hover:bg-emerald-50 transition rounded-xl shadow-sm m-2"
                  >
                    <p className="font-semibold text-gray-800 text-base">
                      {log.item_nome}
                    </p>
                    <p className="text-gray-600 text-sm">Categoria: {log.categoria}</p>
                    <p className="text-gray-600 text-sm">Pessoa: {log.nome}</p>
                    <p className="text-gray-600 text-sm break-all">
                      CPF: {mascararCPF(log.cpf)}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Funcionário: {log.funcionario_username}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Data: {log.created_at || "—"}
                    </p>
                    <div className="flex gap-6 mt-3 text-lg justify-end">
                      <button
                        onClick={() => setSelectedLog(log)}
                        title="Visualizar detalhes"
                        className="text-gray-600 hover:text-emerald-600"
                      >
                        <FiEye />
                      </button>
                      {user?.role === "admin" && (
                        <button
                          onClick={() => handleDelete(log.id)}
                          title="Excluir relatório"
                          className="text-gray-600 hover:text-red-600"
                        >
                          <FiTrash2 />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 py-5 border-t bg-gray-50 rounded-b-2xl text-sm sm:text-base">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 sm:p-3 rounded-md border text-gray-600 hover:bg-gray-100 disabled:opacity-40"
              >
                <FiChevronLeft />
              </button>
              <span className="text-gray-700 font-medium">
                Página {page} de {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 sm:p-3 rounded-md border text-gray-600 hover:bg-gray-100 disabled:opacity-40"
              >
                <FiChevronRight />
              </button>
            </div>
          )}
        </section>
      </main>

      <Footer />

      {showExportModal && (
        <ExportRelatorioModal
          onClose={() => setShowExportModal(false)}
          onDownload={handleDownload}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          months={months}
        />
      )}

      {selectedLog && (
        <RelatorioModal
          log={selectedLog}
          user={user}
          onClose={() => setSelectedLog(null)}
        />
      )}
    </div>
  );
};

export default AdminRelatorios;
