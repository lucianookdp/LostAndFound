// ── pages/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { motion } from "framer-motion";
import HeaderAdmin from "../components/HeaderAdmin";
import HeaderFunc from "../components/HeaderFunc";
import Footer from "../components/Footer";
import { FiActivity } from "react-icons/fi";

const COLORS = ["#10B981", "#34D399", "#6EE7B7", "#A7F3D0", "#047857"];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const storedUser = sessionStorage.getItem("auth_user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/admin-login");
    } else {
      fetch(`${import.meta.env.VITE_API_URL || "/api"}/dashboard`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((json) => setData(json))
        .catch((err) => console.error("[DASHBOARD] erro:", err));
    }
  }, [user, navigate]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Carregando Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {user?.role === "admin" ? <HeaderAdmin /> : <HeaderFunc />}

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-10 space-y-10">
        {/* Cabeçalho */}
        <div className="text-center px-2">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
            <FiActivity className="text-emerald-700" />
            Dashboard
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Acompanhe as métricas e estatísticas do sistema de Achados e Perdidos.
          </p>
        </div>

        {/* Cards principais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {[
            { label: "Itens Disponíveis", value: data.disponiveis, sub: "Objetos ainda não retirados." },
            { label: "Itens Devolvidos", value: data.devolvidos, sub: "Itens já retirados por seus donos." },
            {
              label: "Taxa de Devolução",
              value: `${((data.devolvidos / data.total) * 100).toFixed(1)}%`,
              sub: "Proporção de itens devolvidos.",
            },
          ].map((card, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition p-5 sm:p-6 text-center"
            >
              <p className="text-gray-500 text-sm">{card.label}</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-emerald-700 mt-2">
                {card.value}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-2">{card.sub}</p>
            </div>
          ))}
        </div>

        {/* Áreas com mais itens perdidos */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden"
        >
          <div className="p-5 bg-gradient-to-r from-emerald-700 to-emerald-800 text-white">
            <h3 className="text-lg font-semibold">Áreas com Mais Itens Perdidos</h3>
            <p className="text-sm opacity-90">
              Locais onde mais objetos são esquecidos.
            </p>
          </div>
          <div className="p-3 sm:p-6">
            <div className="w-full overflow-x-auto">
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="origin-bottom min-w-[400px] h-[280px] sm:h-[350px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.areasMaisItens}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="local" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="quantidade" fill="#10B981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Itens por categoria */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden"
        >
          <div className="p-5 bg-gradient-to-r from-emerald-700 to-emerald-800 text-white">
            <h3 className="text-lg font-semibold">Itens por Categoria</h3>
            <p className="text-sm opacity-90">
              Categorias de objetos registrados no sistema.
            </p>
          </div>
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="origin-bottom p-3 sm:p-6"
          >
            <div className="w-full overflow-x-auto">
              <div className="min-w-[400px] h-[280px] sm:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={data.itensPorCategoria.sort(
                      (a, b) => b.quantidade - a.quantidade
                    )}
                    margin={{ left: 60, right: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="categoria" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="quantidade" fill="#34D399" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* Devoluções por mês */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden"
        >
          <div className="p-5 bg-gradient-to-r from-emerald-700 to-emerald-800 text-white">
            <h3 className="text-lg font-semibold">Devoluções por Mês</h3>
            <p className="text-sm opacity-90">Retiradas registradas ao longo dos meses.</p>
          </div>
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.3, ease: "easeOut" }}
            className="origin-bottom p-3 sm:p-6 h-[260px] sm:h-[320px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.devolucoesPorMes.slice().reverse()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantidade" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </motion.section>

        {/* Gráficos inferiores */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Prioritário x Comum */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden"
          >
            <div className="p-5 bg-gradient-to-r from-emerald-700 to-emerald-800 text-white">
              <h3 className="text-lg font-semibold">Prioritários x Comuns</h3>
              <p className="text-sm opacity-90">Proporção entre tipos de itens.</p>
            </div>
            <motion.div
              initial={{ rotate: -15, scale: 0.8, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="p-4 sm:p-6 flex justify-center h-[250px] sm:h-[320px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.itensPrioridade}
                    dataKey="quantidade"
                    nameKey="tipo"
                    outerRadius="70%"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(1)}%`
                    }
                  >
                    {data.itensPrioridade.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          </motion.section>

          {/* Itens por Recepção */}
          <motion.section
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden"
          >
            <div className="p-5 bg-gradient-to-r from-emerald-700 to-emerald-800 text-white">
              <h3 className="text-lg font-semibold">Itens por Recepção</h3>
              <p className="text-sm opacity-90">Distribuição dos itens por recepção.</p>
            </div>
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 1.3, ease: "easeOut" }}
              className="origin-bottom p-3 sm:p-6 h-[250px] sm:h-[320px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.itensPorRecepcao}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="recepcao" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="quantidade" fill="#34D399" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </motion.section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
