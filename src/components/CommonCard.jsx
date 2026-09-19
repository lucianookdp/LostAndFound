// ── CommonCard.jsx
import { FiMapPin, FiArrowRight } from "react-icons/fi";

export default function CommonCard({ item, onView }) {
  return (
    <button
      onClick={onView}
      className="group h-full w-full text-left bg-white rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-xl hover:border-emerald-300 hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden"
    >
      <div className="p-5 flex-1 flex flex-col gap-3">
        <span className="self-start px-2.5 py-1 rounded-lg text-[11px] font-semibold uppercase tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-100">
          {item?.categoria || "Sem categoria"}
        </span>

        <h3 className="text-base font-semibold text-gray-900 leading-snug group-hover:text-emerald-800 transition-colors">
          {item?.nome || "—"}
        </h3>

        <p className="mt-auto flex items-center gap-1.5 text-sm text-gray-500">
          <FiMapPin className="shrink-0 text-gray-400" />
          <span className="truncate">{item?.location_name || "—"}</span>
        </p>
      </div>

      <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/70 flex items-center justify-between text-sm font-semibold text-emerald-700">
        Ver detalhes
        <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
      </div>
    </button>
  );
}
