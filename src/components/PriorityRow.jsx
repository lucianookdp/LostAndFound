// ── PriorityRow.jsx
import { FiShield, FiChevronRight, FiMapPin } from "react-icons/fi";

const PriorityRow = ({ item, formatDate, onClick, compact = false }) => {
  return (
    <button
      onClick={onClick}
      className={`relative w-full text-left group transition-colors hover:bg-amber-50/70 ${
        compact ? "px-4 py-3.5" : "px-6 py-4"
      }`}
    >
      {/* marcador lateral: cresce no hover */}
      <span className="absolute left-0 top-0 h-full w-1 bg-amber-400 scale-y-0 group-hover:scale-y-100 origin-center transition-transform duration-300" />

      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 grid place-items-center h-10 w-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 group-hover:bg-amber-100 transition-colors">
          <FiShield />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm md:text-base font-semibold text-gray-900 truncate group-hover:text-amber-900 transition-colors">
            {item.nome || "—"}
          </p>

          <div className="mt-1 flex items-center gap-2 flex-wrap text-[11px]">
            {item.categoria && (
              <span className="px-2 py-0.5 rounded-md font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                {item.categoria}
              </span>
            )}
            {item.location_name && (
              <span className="inline-flex items-center gap-1 text-gray-500">
                <FiMapPin className="text-gray-400" />
                {item.location_name}
              </span>
            )}
          </div>
        </div>

        <span className="hidden sm:inline text-[11px] font-medium text-gray-500 tabular-nums">
          {formatDate(item.data)}
        </span>

        <FiChevronRight className="text-gray-300 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all" />
      </div>
    </button>
  );
};

export default PriorityRow;
