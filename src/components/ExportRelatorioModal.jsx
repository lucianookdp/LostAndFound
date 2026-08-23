// ── components/ExportRelatorioModal.jsx
import { FiFileText, FiCalendar, FiClock } from "react-icons/fi";

// ── Card compacto e responsivo
const ExportCard = ({ title, onClick, icon, color }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center gap-2 p-4 sm:p-5 border rounded-xl shadow-sm hover:shadow-md transition bg-white text-${color}-700 hover:bg-${color}-50`}
  >
    <div className={`text-2xl sm:text-3xl text-${color}-700`}>{icon}</div>
    <h3 className="font-semibold text-gray-800 text-sm sm:text-base">{title}</h3>
  </button>
);

const ExportRelatorioModal = ({
  onClose,
  onDownload,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  months,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-fadeIn">
        {/* Cabeçalho */}
        <div className="px-5 py-4 bg-gradient-to-r from-emerald-700 to-emerald-800 text-white flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
            <FiFileText /> Exportar Relatório
          </h2>
          <button
            onClick={onClose}
            className="text-white/90 hover:text-white text-xl leading-none"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* Opções principais */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            <ExportCard
              title="Completo"
              icon={<FiFileText />}
              color="emerald"
              onClick={() => onDownload()}
            />
            <ExportCard
              title="Diário"
              icon={<FiClock />}
              color="emerald"
              onClick={() => onDownload("diario")}
            />
            <ExportCard
              title="Semanal"
              icon={<FiCalendar />}
              color="emerald"
              onClick={() => onDownload("semanal")}
            />
          </div>

          {/* Relatório mensal */}
          <div className="border rounded-xl p-4 sm:p-5 shadow-sm bg-white space-y-3">
            <h3 className="font-semibold text-gray-800 text-base sm:text-lg flex items-center gap-2">
              <FiCalendar className="text-emerald-700" /> Mensal
            </h3>
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Mês</option>
                {months.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full sm:w-28 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <button
              onClick={() => onDownload("mensal")}
              className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-emerald-700 text-white text-sm hover:bg-emerald-800"
            >
              <FiFileText /> Gerar PDF
            </button>
          </div>

          {/* Relatório anual */}
          <div className="border rounded-xl p-4 sm:p-5 shadow-sm bg-white space-y-3">
            <h3 className="font-semibold text-gray-800 text-base sm:text-lg flex items-center gap-2">
              <FiCalendar className="text-emerald-700" /> Anual
            </h3>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="flex-1 sm:w-32 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={() => onDownload("anual")}
                className="flex-1 sm:flex-none px-3 py-2 rounded-lg bg-emerald-700 text-white text-sm hover:bg-emerald-800 flex items-center justify-center gap-2"
              >
                <FiFileText /> Gerar
              </button>
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="px-5 py-3 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border text-sm sm:text-base hover:bg-gray-100"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportRelatorioModal;
