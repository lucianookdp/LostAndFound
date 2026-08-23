// ── pages/Home.jsx
import { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ItemsFilter from "../components/ItemsFilter";
import { getItems } from "../services/itemsApi";
import PriorityRow from "../components/PriorityRow";
import CommonCard from "../components/CommonCard";
import PublicModal from "../components/PublicModal";
import { FiBox, FiTag } from "react-icons/fi";

const ITEMS_PER_PAGE_PRIOR = 10;
const ITEMS_PER_PAGE_COMMON = 9;

function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString();
}

const Home = () => {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [viewItem, setViewItem] = useState(null);

  const [pagePrior, setPagePrior] = useState(1);
  const [pageCommon, setPageCommon] = useState(1);

  useEffect(() => {
    fetchItems();
    setPagePrior(1);
    setPageCommon(1);
  }, [filters]);

  async function fetchItems() {
    try {
      setLoading(true);
      const data = await getItems(filters);
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("[HOME] erro ao carregar itens", e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  const { prioritarios, comuns } = useMemo(() => {
    const p = [],
      c = [];
    for (const it of items) {
      if (String(it.tipo).toLowerCase() === "prioritario") p.push(it);
      else c.push(it);
    }
    p.sort((a, b) => new Date(b.data) - new Date(a.data));
    c.sort((a, b) => new Date(b.data) - new Date(a.data));
    return { prioritarios: p, comuns: c };
  }, [items]);

  const paginate = (list, page, perPage) => {
    const start = (page - 1) * perPage;
    return list.slice(start, start + perPage);
  };
  const totalPages = (list, perPage) =>
    Math.ceil(list.length / perPage || 1);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-10 space-y-14">
        {/* Cabeçalho */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <FiBox className="text-emerald-700" />
            Consulta de Itens
          </h1>
          <p className="text-gray-600 mt-2">
            Consulte os objetos registrados pelas recepções
          </p>
        </div>

        {/* Filtro */}
        <section className="bg-white shadow-lg rounded-2xl border border-gray-200 p-6">
          <ItemsFilter onFilterChange={setFilters} />
        </section>

        {/* Itens Prioritários */}
        <section className="bg-white shadow-lg rounded-2xl border border-gray-200 overflow-hidden">
          <div className="p-6 border-b bg-gradient-to-r from-emerald-700 to-emerald-800 text-white flex flex-col sm:flex-row justify-between sm:items-center gap-3 rounded-t-2xl">
            <div className="flex items-center gap-2">
              <FiTag className="text-2xl" />
              <div>
                <h2 className="text-xl font-semibold">Itens Prioritários</h2>
                <p className="text-sm text-emerald-100">
                  Itens de maior valor que exigem verificação adicional na retirada.
                </p>
              </div>
            </div>
            {!loading && (
              <span className="inline-block bg-white text-emerald-800 text-sm font-semibold px-3 py-1 rounded-full">
                {prioritarios.length} itens
              </span>
            )}
          </div>

          {loading ? (
            <div className="p-6 text-center text-gray-500">Carregando...</div>
          ) : prioritarios.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              Nenhum item prioritário encontrado.
            </div>
          ) : (
            <>
              <ul className="divide-y divide-gray-100">
                {paginate(prioritarios, pagePrior, ITEMS_PER_PAGE_PRIOR).map(
                  (it) => (
                    <li
                      key={it.id}
                      className="hover:bg-emerald-50 transition-colors"
                    >
                      <PriorityRow
                        item={it}
                        formatDate={formatDate}
                        onClick={() => setViewItem(it)}
                        compact
                      />
                    </li>
                  )
                )}
              </ul>

              {totalPages(prioritarios, ITEMS_PER_PAGE_PRIOR) > 1 && (
                <div className="flex justify-center items-center gap-4 py-5 border-t bg-gray-50">
                  <button
                    disabled={pagePrior === 1}
                    onClick={() => setPagePrior((p) => Math.max(1, p - 1))}
                    className="p-2 rounded-md border border-emerald-300 text-emerald-700 hover:bg-emerald-100 disabled:opacity-40"
                  >
                    Anterior
                  </button>
                  <span className="text-sm text-gray-700 font-medium">
                    Página {pagePrior} de{" "}
                    {totalPages(prioritarios, ITEMS_PER_PAGE_PRIOR)}
                  </span>
                  <button
                    disabled={
                      pagePrior ===
                      totalPages(prioritarios, ITEMS_PER_PAGE_PRIOR)
                    }
                    onClick={() =>
                      setPagePrior((p) =>
                        Math.min(
                          totalPages(prioritarios, ITEMS_PER_PAGE_PRIOR),
                          p + 1
                        )
                      )
                    }
                    className="p-2 rounded-md border border-emerald-300 text-emerald-700 hover:bg-emerald-100 disabled:opacity-40"
                  >
                    Próxima
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        {/* Itens Comuns */}
        <section className="bg-white shadow-lg rounded-2xl border border-gray-200 overflow-hidden">
          <div className="p-6 border-b bg-gradient-to-r from-emerald-600 to-emerald-700 text-white flex flex-col sm:flex-row justify-between sm:items-center gap-3 rounded-t-2xl">
            <div className="flex items-center gap-2">
              <FiBox className="text-2xl" />
              <div>
                <h2 className="text-xl font-semibold">Itens Comuns</h2>
                <p className="text-sm text-emerald-100">
                  Objetos do dia a dia entregues nas recepções.
                </p>
              </div>
            </div>
            {!loading && (
              <span className="inline-block bg-white text-emerald-700 text-sm font-semibold px-3 py-1 rounded-full">
                {comuns.length} itens
              </span>
            )}
          </div>

          {loading ? (
            <div className="p-6 text-center text-gray-500">Carregando...</div>
          ) : comuns.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              Nenhum item comum encontrado.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {paginate(comuns, pageCommon, ITEMS_PER_PAGE_COMMON).map(
                  (it) => (
                    <CommonCard
                      key={it.id}
                      item={it}
                      onView={() => setViewItem(it)}
                    />
                  )
                )}
              </div>

              {totalPages(comuns, ITEMS_PER_PAGE_COMMON) > 1 && (
                <div className="flex justify-center items-center gap-4 py-5 border-t bg-gray-50">
                  <button
                    disabled={pageCommon === 1}
                    onClick={() => setPageCommon((p) => Math.max(1, p - 1))}
                    className="p-2 rounded-md border border-emerald-300 text-emerald-700 hover:bg-emerald-100 disabled:opacity-40"
                  >
                    Anterior
                  </button>
                  <span className="text-sm text-gray-700 font-medium">
                    Página {pageCommon} de{" "}
                    {totalPages(comuns, ITEMS_PER_PAGE_COMMON)}
                  </span>
                  <button
                    disabled={
                      pageCommon ===
                      totalPages(comuns, ITEMS_PER_PAGE_COMMON)
                    }
                    onClick={() =>
                      setPageCommon((p) =>
                        Math.min(
                          totalPages(comuns, ITEMS_PER_PAGE_COMMON),
                          p + 1
                        )
                      )
                    }
                    className="p-2 rounded-md border border-emerald-300 text-emerald-700 hover:bg-emerald-100 disabled:opacity-40"
                  >
                    Próxima
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      <Footer />

      <PublicModal
        open={!!viewItem}
        item={viewItem}
        onClose={() => setViewItem(null)}
        formatDate={formatDate}
      />
    </div>
  );
};

export default Home;
