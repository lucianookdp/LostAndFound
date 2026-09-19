// ── PriorityRow.jsx
import { FiShield, FiChevronRight } from "react-icons/fi";

const PriorityRow = ({ item, formatDate, onClick, compact = false }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left group hover:bg-amber-50 transition ${
        compact ? "px-4 py-3" : "px-6 py-4"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* marcador lateral */}
        <div className="flex-shrink-0 mt-1 h-6 w-1.5 rounded bg-amber-500/90" />

        {/* conteúdo */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-amber-100 text-amber-800">
              <FiShield className="opacity-80" />
              Prioritário
            </span>

            {item.categoria && (
              <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-100 text-emerald-700">
                {item.categoria}
              </span>
            )}

            <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-gray-100 text-gray-700">
              {formatDate(item.data)}
            </span>
          </div>

          <p className="mt-1 text-sm md:text-base font-medium text-gray-900 truncate">
            {item.nome || "—"}
          </p>
        </div>

        <FiChevronRight className="mt-1 text-gray-400 group-hover:text-amber-600" />
      </div>
    </button>
  );
};

export default PriorityRow;
