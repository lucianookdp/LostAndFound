// ── components/ItemModal.jsx
import { useEffect, useState } from "react";
import { FiEye, FiEdit2, FiPlus, FiBox } from "react-icons/fi";
import { getLocations, getReceptions } from "../services/itemsApi";

const ItemModal = ({ isOpen, onClose, onSave, item, viewOnly = false }) => {
  const [tipo, setTipo] = useState("prioritario");
  const [nome, setNome] = useState("");
  const [data, setData] = useState("");
  const [categoria, setCategoria] = useState("");
  const [locationId, setLocationId] = useState("");
  const [receptionId, setReceptionId] = useState("");
  const [locations, setLocations] = useState([]);
  const [receptions, setReceptions] = useState([]);
  const [securityQuestion, setSecurityQuestion] = useState("");

  useEffect(() => {
    if (item) {
      setTipo(item.tipo || "prioritario");
      setNome(item.nome || "");
      setData(item.data ? item.data.split("T")[0] : "");
      setCategoria(item.categoria || "");
      setLocationId(item.location_id || "");
      setReceptionId(item.reception_id || "");
      setSecurityQuestion(item.security_question || "");
    } else {
      setTipo("prioritario");
      setNome("");
      setData("");
      setCategoria("");
      setLocationId("");
      setReceptionId("");
      setSecurityQuestion("");
    }
  }, [item]);

  useEffect(() => {
    getLocations().then(setLocations).catch(console.error);
    getReceptions().then(setReceptions).catch(console.error);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nome || !data || !categoria || !locationId || !receptionId) {
      alert("Preencha todos os campos obrigatórios antes de salvar.");
      return;
    }
    if (!securityQuestion.trim()) {
      alert("Informe a pergunta de segurança.");
      return;
    }

    // Confirmação única antes de salvar ou editar
    const message = item
      ? "Tem certeza que deseja confirmar as alterações deste item?"
      : "Deseja cadastrar este novo item?";
    if (!window.confirm(message)) return;

    const dataToSend = {
      tipo,
      nome,
      data,
      categoria,
      location_id: locationId,
      reception_id: receptionId,
      security_question: securityQuestion,
    };

    if (item?.id) dataToSend.id = item.id;
    onSave?.(dataToSend);
  };

  if (!isOpen) return null;

  const renderField = (label, value, inputEl) => (
    <div className="flex flex-col">
      <label className="text-sm font-medium mb-1 text-gray-700">{label}</label>
      {viewOnly ? (
        <p className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md">{value || "—"}</p>
      ) : (
        inputEl
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
        {/* Cabeçalho */}
        <div
          className={`px-5 py-4 flex items-center justify-between ${
            viewOnly
              ? "bg-gradient-to-r from-emerald-600 to-emerald-700"
              : "bg-gradient-to-r from-emerald-700 to-emerald-800"
          } text-white`}
        >
          <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
            {viewOnly ? (
              <>
                <FiEye /> Detalhes do Item
              </>
            ) : item ? (
              <>
                <FiEdit2 /> Editar Item
              </>
            ) : (
              <>
                <FiPlus /> Cadastrar Novo Item
              </>
            )}
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
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 text-gray-700">
          {/* Tipo e Categoria */}
          <div className="grid sm:grid-cols-2 gap-4">
            {renderField(
              "Tipo do item",
              tipo,
              <>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="prioritario">Prioritário</option>
                  <option value="comum">Comum</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  {tipo === "prioritario"
                    ? "Valor alto ou documento pessoal: celular, notebook, carteira, chave de carro, joia."
                    : "Objeto do dia a dia: garrafa, caderno, guarda-chuva, roupa, material escolar."}
                </p>
              </>
            )}

            {renderField(
              "Categoria",
              categoria,
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Selecione</option>
                <option value="Eletrônicos">Eletrônicos</option>
                <option value="Materiais Acadêmicos">Materiais Acadêmicos</option>
                <option value="Acessórios">Acessórios</option>
                <option value="Vestuário">Vestuário</option>
                <option value="Documentos">Documentos</option>
                <option value="Bolsas e Mochilas">Bolsas e Mochilas</option>
                <option value="Outros">Outros</option>
              </select>
            )}
          </div>

          {/* Nome */}
          {renderField(
            "Nome do item",
            nome,
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500"
              placeholder="Ex: Carteira, Chave de carro..."
            />
          )}

          {/* Data, Local e Recepção */}
          <div className="grid sm:grid-cols-2 gap-4">
            {renderField(
              "Data de entrega",
              data,
              <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500"
              />
            )}

            {renderField(
              "Local encontrado",
              locations.find((l) => l.id === Number(locationId))?.name,
              <select
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Selecione</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            )}

            {renderField(
              "Recepção onde foi entregue",
              receptions.find((r) => r.id === Number(receptionId))?.name,
              <select
                value={receptionId}
                onChange={(e) => setReceptionId(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Selecione</option>
                {receptions.map((rec) => (
                  <option key={rec.id} value={rec.id}>
                    {rec.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Pergunta de Segurança */}
          {renderField(
            "Pergunta de Segurança",
            securityQuestion,
            <input
              type="text"
              value={securityQuestion}
              onChange={(e) => setSecurityQuestion(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500"
              placeholder="Ex: Algum detalhe que só o dono saberia"
              required
            />
          )}

          {/* Botões */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 text-sm sm:text-base"
            >
              {viewOnly ? "Fechar" : "Cancelar"}
            </button>
            {!viewOnly && (
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 text-sm sm:text-base transition"
              >
                {item ? "Confirmar Edição" : "Salvar Item"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemModal;
