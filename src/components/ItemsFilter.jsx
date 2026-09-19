// ── components/ItemsFilter.jsx
import { useEffect, useState } from "react";
import { FiRefreshCw } from "react-icons/fi";
import { getLocations } from "../services/locaisApi";
import { getReceptions } from "../services/itemsApi";

const categories = [
  "Eletrônicos",
  "Acessórios",
  "Vestuário",
  "Bolsas e Mochilas",
  "Documentos",
  "Materiais Acadêmicos",
  "Outros",
];

export default function ItemsFilter({ onFilterChange }) {
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [reception, setReception] = useState("");
  const [tipo, setTipo] = useState("");

  const [locations, setLocations] = useState([]);
  const [receptions, setReceptions] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const locs = await getLocations();
        setLocations(locs);
        const recs = await getReceptions();
        setReceptions(recs);
      } catch (err) {
        console.error("Erro ao carregar filtros", err);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    onFilterChange({ category, location, reception, tipo });
  }, [category, location, reception, tipo]);

  const resetFilters = () => {
    setCategory("");
    setLocation("");
    setReception("");
    setTipo("");
  };

  return (
    <div className="flex flex-wrap items-center gap-3 bg-white border border-gray-200/80 rounded-2xl p-4 sm:p-5 shadow-lg shadow-emerald-900/5">
      {/* Categoria */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="flex-1 min-w-[160px] border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none transition"
      >
        <option value="">Todas as categorias</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      {/* Local */}
      <select
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="flex-1 min-w-[160px] border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none transition"
      >
        <option value="">Todos os locais</option>
        {locations.map((l) => (
          <option key={l.id} value={l.id}>
            {l.name}
          </option>
        ))}
      </select>

      {/* Recepção */}
      <select
        value={reception}
        onChange={(e) => setReception(e.target.value)}
        className="flex-1 min-w-[160px] border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none transition"
      >
        <option value="">Todas as recepções</option>
        {receptions.map((r) => (
          <option key={r.id} value={r.id}>
            {r.name}
          </option>
        ))}
      </select>

      {/* Tipo */}
      <select
        value={tipo}
        onChange={(e) => setTipo(e.target.value)}
        className="flex-1 min-w-[160px] border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none transition"
      >
        <option value="">Todos os tipos</option>
        <option value="prioritario">Prioritário</option>
        <option value="comum">Comum</option>
      </select>

      {/* Botão de refresh */}
      <button
        onClick={resetFilters}
        className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm transition active:scale-95"
        title="Limpar filtros"
      >
        <FiRefreshCw className="w-5 h-5" />
      </button>
    </div>
  );
}
