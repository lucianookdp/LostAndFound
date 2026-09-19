// ── pages/Home.jsx
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ItemsFilter from "../components/ItemsFilter";
import { getItems } from "../services/itemsApi";
import PriorityRow from "../components/PriorityRow";
import CommonCard from "../components/CommonCard";
import PublicModal from "../components/PublicModal";
import { FiBox, FiShield, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const ITEMS_PER_PAGE_PRIOR = 10;
const ITEMS_PER_PAGE_COMMON = 9;

function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString();
}

// entrada padrão das seções
const surgir = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: "easeOut" },
};

function Skeleton({ linhas = 4 }) {
  return (
    <div className="p-6 space-y-3">
      {[...Array(linhas)].map((_, i) => (
        <div key={i} className="h-12 rounded-xl bg-gray-100 animate-pulse" />
      ))}
    </div>
  );
}

function Paginacao({ page, total, onChange }) {
  if (total <= 1) return null;
  return (
    <div className="flex justify-center items-center gap-3 py-5 border-t border-gray-100 bg-gray-50/60">
      <button
        disabled={page === 1}
        onClick={() => onChange(Math.max(1, page - 1))}
        className="grid place-items-center h-9 w-9 rounded-lg border border-gray-200 text-gray-600 bg-white hover:border-emerald-300 hover:text-emerald-700 disabled:opacity-40 disabled:hover:border-gray-200 transition"
        aria-label="Página anterior"
      >
        <FiChevronLeft />
      </button>
      <span className="text-sm text-gray-600 tabular-nums">
        {page} <span className="text-gray-400">de</span> {total}
      </span>
      <button
        disabled={page === total}
        onClick={() => onChange(Math.min(total, page + 1))}
        className="grid place-items-center h-9 w-9 rounded-lg border border-gray-200 text-gray-600 bg-white hover:border-emerald-300 hover:text-emerald-700 disabled:opacity-40 disabled:hover:border-gray-200 transition"
        aria-label="Próxima página"
      >
        <FiChevronRight />
      </button>
    </div>
  );
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
  const totalPages = (list, perPage) => Math.ceil(list.length / perPage || 1);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      {/* Capa */}
      <section className="relative bg-[#065F46] text-white overflow-hidden">
        {/* textura discreta em diagonal */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, #fff 0 1px, transparent 1px 14px)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-black/10"
        />

        <div className="relative max-w-7xl mx-auto px-4 pt-14 pb-24 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="text-3xl sm:text-5xl font-bold tracking-tight"
          >
            Consulta de Itens
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: "easeOut" }}
            className="mt-3 text-emerald-100 max-w-xl mx-auto"
          >
            Procure aqui o que você perdeu no campus. A retirada é feita
            presencialmente, na recepção que registrou o item.
          </motion.p>
        </div>
      </section>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 pb-16 space-y-10">
        {/* Filtro sobrepondo a capa */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16, ease: "easeOut" }}
          className="relative z-10 -mt-14"
        >
          <ItemsFilter onFilterChange={setFilters} />
        </motion.section>

        {/* Itens Prioritários */}
        <motion.section
          {...surgir}
          className="bg-white shadow-sm rounded-2xl border border-gray-200/80 overflow-hidden"
        >
          <div className="p-5 sm:p-6 border-b border-emerald-900/10 bg-gradient-to-r from-emerald-700 to-emerald-800 text-white flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="grid place-items-center h-10 w-10 rounded-xl bg-white/10">
                <FiShield className="text-xl" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-semibold">
                  Itens Prioritários
                </h2>
                <p className="text-sm text-emerald-100/90">
                  Itens de valor alto e documentos pessoais, em destaque para
                  serem encontrados mais rápido.
                </p>
              </div>
            </div>
            {!loading && (
              <span className="self-start sm:self-auto shrink-0 bg-white/95 text-emerald-800 text-sm font-semibold px-3 py-1 rounded-full tabular-nums">
                {prioritarios.length} itens
              </span>
            )}
          </div>

          {loading ? (
            <Skeleton linhas={4} />
          ) : prioritarios.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              Nenhum item prioritário encontrado.
            </div>
          ) : (
            <>
              <ul className="divide-y divide-gray-100">
                {paginate(prioritarios, pagePrior, ITEMS_PER_PAGE_PRIOR).map(
                  (it, i) => (
                    <motion.li
                      key={it.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.035 }}
                    >
                      <PriorityRow
                        item={it}
                        formatDate={formatDate}
                        onClick={() => setViewItem(it)}
                        compact
                      />
                    </motion.li>
                  )
                )}
              </ul>

              <Paginacao
                page={pagePrior}
                total={totalPages(prioritarios, ITEMS_PER_PAGE_PRIOR)}
                onChange={setPagePrior}
              />
            </>
          )}
        </motion.section>

        {/* Itens Comuns */}
        <motion.section
          {...surgir}
          className="bg-white shadow-sm rounded-2xl border border-gray-200/80 overflow-hidden"
        >
          <div className="p-5 sm:p-6 border-b border-emerald-900/10 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="grid place-items-center h-10 w-10 rounded-xl bg-white/10">
                <FiBox className="text-xl" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-semibold">Itens Comuns</h2>
                <p className="text-sm text-emerald-50/90">
                  Objetos do dia a dia entregues nas recepções.
                </p>
              </div>
            </div>
            {!loading && (
              <span className="self-start sm:self-auto shrink-0 bg-white/95 text-emerald-700 text-sm font-semibold px-3 py-1 rounded-full tabular-nums">
                {comuns.length} itens
              </span>
            )}
          </div>

          {loading ? (
            <Skeleton linhas={3} />
          ) : comuns.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              Nenhum item comum encontrado.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 p-5 sm:p-6">
                {paginate(comuns, pageCommon, ITEMS_PER_PAGE_COMMON).map(
                  (it, i) => (
                    <motion.div
                      key={it.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: i * 0.04 }}
                    >
                      <CommonCard item={it} onView={() => setViewItem(it)} />
                    </motion.div>
                  )
                )}
              </div>

              <Paginacao
                page={pageCommon}
                total={totalPages(comuns, ITEMS_PER_PAGE_COMMON)}
                onChange={setPageCommon}
              />
            </>
          )}
        </motion.section>
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
