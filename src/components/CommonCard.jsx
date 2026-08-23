// ── CommonCard.jsx
export default function CommonCard({ item, onView }) {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
      {/* Conteúdo */}
      <div className="p-6 flex-1 flex flex-col justify-between text-center">
        {/* Nome do item */}
        <h3 className="text-lg font-semibold text-gray-900 mb-3 leading-snug">
          {item?.nome || "—"}
        </h3>

        {/* Categoria */}
        <div className="text-sm text-gray-600 mb-2">
          <span className="block text-gray-500">Categoria:</span>
          <span className="text-gray-800 font-medium">
            {item?.categoria || "—"}
          </span>
        </div>

        {/* Local encontrado */}
        <div className="text-sm text-gray-600">
          <span className="block text-gray-500">Local encontrado:</span>
          <span className="text-gray-800 font-medium">
            {item?.location_name || "—"}
          </span>
        </div>
      </div>

      {/* Botão de ação */}
      <div className="border-t border-gray-100 bg-gray-50 p-4">
        <button
          onClick={onView}
          className="w-full py-2.5 text-sm font-semibold rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 active:scale-[0.98] transition-all"
        >
          Ver detalhes
        </button>
      </div>
    </div>
  );
}
