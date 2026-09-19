// ── pages/AdminItens.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderAdmin from "../components/HeaderAdmin";
import HeaderFunc from "../components/HeaderFunc";
import Footer from "../components/Footer";
import ItemModal from "../components/ItemModal";
import RetiradaModal from "../components/RetiradaModal";
import ItemsFilter from "../components/ItemsFilter";
import { FiEdit, FiEye, FiCornerUpRight } from "react-icons/fi";
import { getItems, createItem, updateItem } from "../services/itemsApi";
import { createWithdrawal } from "../services/withdrawalsApi";

const ITEMS_PER_PAGE = 10;

const AdminItens = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [retiradaOpen, setRetiradaOpen] = useState(false);
  const [withdrawItem, setWithdrawItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [pageMy, setPageMy] = useState(1);
  const [pageOther, setPageOther] = useState(1);
  const [pageAdmin, setPageAdmin] = useState(1);

  const storedUser = sessionStorage.getItem("auth_user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    if (!user) {
      navigate("/admin-login");
    } else {
      fetchItems();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  }

  async function fetchItems() {
    try {
      setLoading(true);
      const data = await getItems(filters);
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("[ERRO AO BUSCAR ITENS]", err);
      showToast("Erro ao carregar itens", "error");
    } finally {
      setLoading(false);
    }
  }

  // ─────────────────────────────────────────────
  // SALVAR ITEM (CRIAR OU EDITAR)
  const handleSave = async (formData) => {
    try {
      const dataStr = formData.data;

      if (dataStr) {
        const dataInformada = new Date(dataStr);
        const hoje = new Date();

        hoje.setHours(0, 0, 0, 0);
        dataInformada.setHours(0, 0, 0, 0);

        const umMesAtras = new Date();
        umMesAtras.setMonth(umMesAtras.getMonth() - 1);

        if (dataInformada > hoje) {
          showToast("A data informada não pode ser no futuro", "error");
          return;
        }

        if (dataInformada < umMesAtras) {
          showToast("A data informada não pode ser de mais de um mês atrás", "error");
          return;
        }
      }

      if (formData.id) {
        await updateItem(formData.id, formData);
        showToast("Item atualizado com sucesso!");
      } else {
        await createItem(formData);
        showToast("Item criado com sucesso!");
      }

      setModalOpen(false);
      setSelectedItem(null);
      fetchItems();
    } catch (err) {
      console.error("[ERRO AO SALVAR ITEM]", err);
      showToast("Erro ao salvar item", "error");
    }
  };

  const openModal = (item = null, view = false) => {
    setSelectedItem(item);
    setViewMode(view);
    setModalOpen(true);
  };

  const openWithdrawFor = (item) => {
    setWithdrawItem(item);
    setRetiradaOpen(true);
  };

  const handleWithdrawSubmit = async (payload) => {
    try {
      await createWithdrawal(payload);
      showToast("Retirada registrada com sucesso!");
      setRetiradaOpen(false);
      setWithdrawItem(null);
      fetchItems();
    } catch (err) {
      console.error("[ERRO AO REGISTRAR RETIRADA]", err);
      showToast("Erro ao registrar retirada", "error");
    }
  };

  // ─────────────────────────────────────────────
  // AÇÕES (mesmas na tabela e nos cards)
  const renderAcoes = (item) => (
    <>
      <button
        onClick={() => openModal(item, true)}
        title="Visualizar"
        className="text-gray-600 hover:text-blue-600"
      >
        <FiEye />
      </button>
      {(user?.role === "admin" ||
        (user?.role === "func" && item.reception_id === user?.reception_id)) && (
        <>
          <button
            onClick={() => openModal(item, false)}
            title="Editar"
            className="text-gray-600 hover:text-yellow-500"
          >
            <FiEdit />
          </button>
          <button
            onClick={() => openWithdrawFor(item)}
            title="Retirar este item"
            className="text-gray-600 hover:text-emerald-600"
          >
            <FiCornerUpRight />
          </button>
        </>
      )}
    </>
  );

  const tipoBadge = (tipo) =>
    `inline-block rounded px-2 py-1 text-xs font-medium capitalize ${
      tipo === "prioritario"
        ? "bg-red-100 text-red-700"
        : "bg-green-100 text-green-700"
    }`;

  // ─────────────────────────────────────────────
  // LINHA DA TABELA (md para cima)
  const renderRow = (item) => (
    <tr key={item.id} className="border-t hover:bg-gray-50 transition">
      <td className="px-2 sm:px-4 py-3">
        <span className={tipoBadge(item.tipo)}>{item.tipo}</span>
      </td>
      <td className="px-2 sm:px-4 py-3">{item.categoria || "—"}</td>
      <td className="px-2 sm:px-4 py-3 font-medium">{item.nome}</td>
      <td className="px-2 sm:px-4 py-3">
        {item.data ? new Date(item.data).toLocaleDateString() : "—"}
      </td>
      <td className="px-2 sm:px-4 py-3">{item.location_name || "—"}</td>
      <td className="px-2 sm:px-4 py-3">{item.reception_name || "—"}</td>
      <td className="px-2 sm:px-4 py-3">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-base">
          {renderAcoes(item)}
        </div>
      </td>
    </tr>
  );

  // ─────────────────────────────────────────────
  // CARD (abaixo de md: na tabela as ações ficariam fora da tela)
  const renderCard = (item) => (
    <div
      key={item.id}
      className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="font-semibold text-gray-900 leading-snug">{item.nome}</p>
        <span className={`shrink-0 ${tipoBadge(item.tipo)}`}>{item.tipo}</span>
      </div>

      <dl className="mt-3 space-y-1 text-sm text-gray-600">
        <div>
          <dt className="inline text-gray-500">Categoria: </dt>
          <dd className="inline">{item.categoria || "—"}</dd>
        </div>
        <div>
          <dt className="inline text-gray-500">Local: </dt>
          <dd className="inline">{item.location_name || "—"}</dd>
        </div>
        <div>
          <dt className="inline text-gray-500">Recepção: </dt>
          <dd className="inline">{item.reception_name || "—"}</dd>
        </div>
        <div>
          <dt className="inline text-gray-500">Data: </dt>
          <dd className="inline">
            {item.data ? new Date(item.data).toLocaleDateString() : "—"}
          </dd>
        </div>
      </dl>

      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-end gap-5 text-lg">
        {renderAcoes(item)}
      </div>
    </div>
  );

  const grupoMobile = (titulo, total, pagina) => (
    <>
      <p className="px-1 pt-2 text-sm font-semibold text-gray-700">
        {titulo} ({total})
      </p>
      {pagina.map(renderCard)}
    </>
  );

  // ─────────────────────────────────────────────
  // PAGINAÇÃO
  const paginate = (list, page) => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return list.slice(start, start + ITEMS_PER_PAGE);
  };

  const totalPages = (list) => Math.ceil(list.length / ITEMS_PER_PAGE);

  const myItems = items.filter((i) => i.reception_id === user?.reception_id);
  const otherItems = items.filter((i) => i.reception_id !== user?.reception_id);

  // ─────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 relative">
      {user?.role === "admin" ? <HeaderAdmin /> : <HeaderFunc />}

      {toast && (
        <div
          className={`fixed top-4 right-4 px-4 py-2 rounded-lg shadow-md text-white text-sm z-50 ${
            toast.type === "error" ? "bg-red-600" : "bg-emerald-600"
          }`}
        >
          {toast.msg}
        </div>
      )}

      <main className="flex-1 w-full max-w-6xl mx-auto py-6 px-3 sm:px-4 lg:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Gerenciar Itens
          </h1>

          <button
            onClick={() => openModal(null, false)}
            className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-3 sm:px-5 py-2 text-white hover:bg-blue-700 transition text-sm sm:text-base"
          >
            + Adicionar
          </button>
        </div>

        <ItemsFilter onFilterChange={setFilters} />

        {/* tabela: md para cima */}
        <div className="hidden md:block bg-white shadow-md rounded-xl overflow-x-auto border border-gray-200">
          <table className="min-w-full text-xs sm:text-sm">
            <thead className="bg-gray-100 text-gray-700 font-medium">
              <tr>
                <th className="px-2 sm:px-4 py-3 text-left">Tipo</th>
                <th className="px-2 sm:px-4 py-3 text-left">Categoria</th>
                <th className="px-2 sm:px-4 py-3 text-left">Nome</th>
                <th className="px-2 sm:px-4 py-3 text-left">Data</th>
                <th className="px-2 sm:px-4 py-3 text-left">Local</th>
                <th className="px-2 sm:px-4 py-3 text-left">Recepção</th>
                <th className="px-2 sm:px-4 py-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-3 py-6 text-center text-gray-500">
                    Carregando...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-3 sm:px-4 py-10 text-center text-gray-500"
                  >
                    Nenhum item cadastrado.
                  </td>
                </tr>
              ) : user?.role === "admin" ? (
                paginate(items, pageAdmin).map((item) => renderRow(item))
              ) : (
                <>
                  <tr>
                    <td
                      colSpan={7}
                      className="bg-gray-50 px-4 py-2 font-semibold text-gray-700"
                    >
                      Seus itens ({myItems.length})
                    </td>
                  </tr>
                  {paginate(myItems, pageMy).map((item) => renderRow(item))}

                  <tr>
                    <td
                      colSpan={7}
                      className="bg-gray-50 px-4 py-2 font-semibold text-gray-700"
                    >
                      Outros itens ({otherItems.length})
                    </td>
                  </tr>
                  {paginate(otherItems, pageOther).map((item) => renderRow(item))}
                </>
              )}
            </tbody>
          </table>
        </div>

        {/* cards: abaixo de md */}
        <div className="md:hidden space-y-3">
          {loading ? (
            <p className="py-8 text-center text-gray-500">Carregando...</p>
          ) : items.length === 0 ? (
            <p className="py-10 text-center text-gray-500">
              Nenhum item cadastrado.
            </p>
          ) : user?.role === "admin" ? (
            paginate(items, pageAdmin).map(renderCard)
          ) : (
            <>
              {grupoMobile("Seus itens", myItems.length, paginate(myItems, pageMy))}
              {grupoMobile(
                "Outros itens",
                otherItems.length,
                paginate(otherItems, pageOther)
              )}
            </>
          )}
        </div>
      </main>

      <Footer />

      <ItemModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedItem(null);
        }}
        onSave={handleSave}
        item={selectedItem}
        viewOnly={viewMode}
      />

      <RetiradaModal
        isOpen={retiradaOpen}
        onClose={() => {
          setRetiradaOpen(false);
          setWithdrawItem(null);
        }}
        onSubmit={handleWithdrawSubmit}
        item={withdrawItem}
      />
    </div>
  );
};

export default AdminItens;
