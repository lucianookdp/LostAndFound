// ── pages/AdminLocais.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderAdmin from "../components/HeaderAdmin";
import Footer from "../components/Footer";
import {
  FiEdit,
  FiTrash2,
  FiPlus,
  FiChevronLeft,
  FiChevronRight,
  FiHome,
  FiMapPin,
} from "react-icons/fi";
import {
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation,
  getReceptions,
  createReception,
  updateReception,
  deleteReception,
} from "../services/locaisApi";
import LocalModal from "../components/LocalModal";
import RecepcaoModal from "../components/RecepcaoModal";

const ITEMS_PER_PAGE = 10;

const AdminLocais = () => {
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [receptions, setReceptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [localModalOpen, setLocalModalOpen] = useState(false);
  const [selectedLocal, setSelectedLocal] = useState(null);
  const [recepcaoModalOpen, setRecepcaoModalOpen] = useState(false);
  const [selectedRecepcao, setSelectedRecepcao] = useState(null);

  const [pageLocal, setPageLocal] = useState(1);
  const [pageRecep, setPageRecep] = useState(1);

  const storedUser = sessionStorage.getItem("auth_user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/admin-login");
    } else {
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const locs = await getLocations();
      const recs = await getReceptions();
      setLocations(locs || []);
      setReceptions(recs || []);
    } catch {
      showToast("Erro ao carregar dados", "error");
    } finally {
      setLoading(false);
    }
  };

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  }

  // ── CRUD Recepção
  const handleSaveRecepcao = async (data) => {
    try {
      if (data.id) {
        await updateReception(data.id, { name: data.name });
        showToast("Recepção atualizada com sucesso!");
      } else {
        await createReception({ name: data.name });
        showToast("Recepção criada com sucesso!");
      }
      setRecepcaoModalOpen(false);
      fetchData();
    } catch {
      showToast("Erro ao salvar recepção", "error");
    }
  };

  const handleDeleteRecepcao = async (id) => {
    if (!window.confirm("Deseja realmente excluir esta recepção?")) return;
    try {
      await deleteReception(id);
      showToast("Recepção excluída!");
      fetchData();
    } catch {
      showToast("Erro ao excluir recepção", "error");
    }
  };

  // ── CRUD Local
  const handleSaveLocal = async (data) => {
    try {
      if (data.id) {
        await updateLocation(data.id, { name: data.name });
        showToast("Local atualizado com sucesso!");
      } else {
        await createLocation({ name: data.name });
        showToast("Local criado com sucesso!");
      }
      setLocalModalOpen(false);
      fetchData();
    } catch {
      showToast("Erro ao salvar local", "error");
    }
  };

  const handleDeleteLocal = async (id) => {
    if (!window.confirm("Deseja realmente excluir este local?")) return;
    try {
      await deleteLocation(id);
      showToast("Local excluído!");
      fetchData();
    } catch {
      showToast("Erro ao excluir local", "error");
    }
  };

  const paginate = (data, page) => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return data.slice(start, start + ITEMS_PER_PAGE);
  };

  const totalPagesLocal = Math.ceil(locations.length / ITEMS_PER_PAGE);
  const totalPagesRecep = Math.ceil(receptions.length / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <HeaderAdmin />

      {toast && (
        <div
          className={`fixed top-4 right-4 px-4 py-2 rounded-lg shadow-md text-white z-50 ${
            toast.type === "error" ? "bg-red-600" : "bg-emerald-600"
          }`}
        >
          {toast.msg}
        </div>
      )}

      <main className="flex-1 w-full max-w-6xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-10 text-center">
          Gestão de Recepções e Locais
        </h1>

        {/* ────────────────────────────────
          RECEPÇÕES
        ──────────────────────────────── */}
        <section className="mb-12 bg-white shadow-lg rounded-2xl border border-gray-200">
          <div className="p-6 border-b bg-gradient-to-r from-emerald-700 to-emerald-800 rounded-t-2xl text-white flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <FiHome className="text-2xl" />
              <div>
                <h2 className="text-xl font-semibold">Recepções</h2>
                <p className="text-sm text-emerald-100">
                  Setores responsáveis pelos cadastros e devoluções de itens perdidos.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedRecepcao(null);
                setRecepcaoModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-white text-emerald-700 font-medium hover:bg-emerald-50 transition-colors"
            >
              <FiPlus /> Nova Recepção
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-700 font-semibold uppercase tracking-wide">
                <tr>
                  <th className="px-5 py-3 text-left">Nome</th>
                  <th className="px-5 py-3 text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={2} className="text-center py-6 text-gray-500">
                      Carregando...
                    </td>
                  </tr>
                ) : receptions.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="text-center py-6 text-gray-500">
                      Nenhuma recepção cadastrada.
                    </td>
                  </tr>
                ) : (
                  paginate(receptions, pageRecep).map((rec) => (
                    <tr
                      key={rec.id}
                      className="border-t hover:bg-emerald-50 transition"
                    >
                      <td className="px-5 py-3 text-gray-800">{rec.name}</td>
                      <td className="px-5 py-3">
                        <div className="flex justify-center items-center gap-4 text-base">
                          <button
                            title="Editar recepção"
                            onClick={() => {
                              setSelectedRecepcao(rec);
                              setRecepcaoModalOpen(true);
                            }}
                            className="text-gray-600 hover:text-yellow-500 transition"
                          >
                            <FiEdit />
                          </button>
                          <button
                            title="Excluir recepção"
                            onClick={() => handleDeleteRecepcao(rec.id)}
                            className="text-gray-600 hover:text-red-600 transition"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          {totalPagesRecep > 1 && (
            <div className="flex justify-center items-center gap-4 py-5 border-t bg-gray-50 rounded-b-2xl">
              <button
                onClick={() => setPageRecep((p) => Math.max(1, p - 1))}
                disabled={pageRecep === 1}
                className="p-2 rounded-md border text-gray-600 hover:bg-gray-100 disabled:opacity-40"
              >
                <FiChevronLeft />
              </button>
              <span className="text-sm text-gray-700 font-medium">
                Página {pageRecep} de {totalPagesRecep}
              </span>
              <button
                onClick={() => setPageRecep((p) => Math.min(totalPagesRecep, p + 1))}
                disabled={pageRecep === totalPagesRecep}
                className="p-2 rounded-md border text-gray-600 hover:bg-gray-100 disabled:opacity-40"
              >
                <FiChevronRight />
              </button>
            </div>
          )}
        </section>

        {/* ────────────────────────────────
          LOCAIS
        ──────────────────────────────── */}
        <section className="bg-white shadow-lg rounded-2xl border border-gray-200">
          <div className="p-6 border-b bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-t-2xl text-white flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <FiMapPin className="text-2xl" />
              <div>
                <h2 className="text-xl font-semibold">Locais</h2>
                <p className="text-sm text-emerald-100">
                  Locais da instituição onde são registrados os achados de itens perdidos.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedLocal(null);
                setLocalModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-white text-emerald-700 font-medium hover:bg-emerald-50 transition-colors"
            >
              <FiPlus /> Novo Local
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-700 font-semibold uppercase tracking-wide">
                <tr>
                  <th className="px-5 py-3 text-left">Nome</th>
                  <th className="px-5 py-3 text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={2} className="text-center py-6 text-gray-500">
                      Carregando...
                    </td>
                  </tr>
                ) : locations.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="text-center py-6 text-gray-500">
                      Nenhum local cadastrado.
                    </td>
                  </tr>
                ) : (
                  paginate(locations, pageLocal).map((loc) => (
                    <tr
                      key={loc.id}
                      className="border-t hover:bg-emerald-50 transition"
                    >
                      <td className="px-5 py-3 text-gray-800">{loc.name}</td>
                      <td className="px-5 py-3">
                        <div className="flex justify-center items-center gap-4 text-base">
                          <button
                            title="Editar local"
                            onClick={() => {
                              setSelectedLocal(loc);
                              setLocalModalOpen(true);
                            }}
                            className="text-gray-600 hover:text-yellow-500 transition"
                          >
                            <FiEdit />
                          </button>
                          <button
                            title="Excluir local"
                            onClick={() => handleDeleteLocal(loc.id)}
                            className="text-gray-600 hover:text-red-600 transition"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          {totalPagesLocal > 1 && (
            <div className="flex justify-center items-center gap-4 py-5 border-t bg-gray-50 rounded-b-2xl">
              <button
                onClick={() => setPageLocal((p) => Math.max(1, p - 1))}
                disabled={pageLocal === 1}
                className="p-2 rounded-md border text-gray-600 hover:bg-gray-100 disabled:opacity-40"
              >
                <FiChevronLeft />
              </button>
              <span className="text-sm text-gray-700 font-medium">
                Página {pageLocal} de {totalPagesLocal}
              </span>
              <button
                onClick={() => setPageLocal((p) => Math.min(totalPagesLocal, p + 1))}
                disabled={pageLocal === totalPagesLocal}
                className="p-2 rounded-md border text-gray-600 hover:bg-gray-100 disabled:opacity-40"
              >
                <FiChevronRight />
              </button>
            </div>
          )}
        </section>
      </main>

      <Footer />

      {/* ──────────────────────────────── */}
      {/* MODAIS */}
      {/* ──────────────────────────────── */}
      <LocalModal
        isOpen={localModalOpen}
        onClose={() => setLocalModalOpen(false)}
        onSave={handleSaveLocal}
        local={selectedLocal}
      />

      <RecepcaoModal
        isOpen={recepcaoModalOpen}
        onClose={() => setRecepcaoModalOpen(false)}
        onSave={handleSaveRecepcao}
        recepcao={selectedRecepcao}
      />
    </div>
  );
};

export default AdminLocais;
