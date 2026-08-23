// ── components/RelatoriosFilter.jsx
import { useEffect, useState } from "react";
import { FiRefreshCw } from "react-icons/fi";
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

export default function RelatoriosFilter({ onFilterChange }) {
  const [category, setCategory] = useState("");
  const [reception, setReception] = useState("");
  const [tipo, setTipo] = useState("");
  const [funcionario, setFuncionario] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [receptions, setReceptions] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const recs = await getReceptions();
        setReceptions(recs);
      } catch (err) {
        console.error("Erro ao carregar recepções", err);
      }
    }
    loadData();
  }, []);

  // 🔹 dispara sempre que mudar algum filtro
  useEffect(() => {
    onFilterChange({
      category,
      reception,
      tipo,
      funcionario,
      startDate,
      endDate,
    });
  }, [category, reception, tipo, funcionario, startDate, endDate]);

  const resetFilters = () => {
    setCategory("");
    setReception("");
    setTipo("");
    setFuncionario("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-lg shadow mb-6">
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="flex-1 min-w-[150px] border rounded px-3 py-2 text-sm"
      >
        <option value="">Todas as categorias</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <select
        value={reception}
        onChange={(e) => setReception(e.target.value)}
        className="flex-1 min-w-[150px] border rounded px-3 py-2 text-sm"
      >
        <option value="">Todas as recepções</option>
        {receptions.map((r) => (
          <option key={r.id} value={r.id}>
            {r.name}
          </option>
        ))}
      </select>

      <select
        value={tipo}
        onChange={(e) => setTipo(e.target.value)}
        className="flex-1 min-w-[150px] border rounded px-3 py-2 text-sm"
      >
        <option value="">Todos os tipos</option>
        <option value="prioritario">Prioritário</option>
        <option value="comum">Comum</option>
      </select>

      <input
        type="text"
        placeholder="Funcionário"
        value={funcionario}
        onChange={(e) => setFuncionario(e.target.value)}
        className="flex-1 min-w-[150px] border rounded px-3 py-2 text-sm"
      />

      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="flex-1 min-w-[150px] border rounded px-3 py-2 text-sm"
      />

      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="flex-1 min-w-[150px] border rounded px-3 py-2 text-sm"
      />

      <button
        onClick={resetFilters}
        className="flex items-center gap-2 px-3 py-2 bg-gray-100 border rounded hover:bg-gray-200 transition text-sm"
        title="Limpar filtros"
      >
        <FiRefreshCw className="text-gray-600" />
        <span className="hidden sm:inline">Resetar</span>
      </button>
    </div>
  );
}
