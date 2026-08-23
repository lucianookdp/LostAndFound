// ── components/HeaderAdmin.jsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logotipo.webp";

const HeaderAdmin = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } catch (err) {
      console.error("Erro ao fazer logout:", err);
    } finally {
      sessionStorage.removeItem("auth_user");
      navigate("/admin-login");
    }
  };

  return (
    <header className="w-full bg-[#065F46] text-white py-4 shadow-md">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        {/* Logo → sempre leva para /admin */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/admin")}
        >
          <img
            src={logo}
            alt="Logo da Instituição"
            className="h-12 w-auto object-contain"
          />
          <span className="text-xl font-semibold tracking-wide uppercase font-montserrat">
            Achados e Perdidos
          </span>
        </div>

        {/* Navegação Desktop */}
        <div className="hidden md:flex items-center gap-5 text-sm font-medium">
          <button onClick={() => navigate("/admin")} className="hover:underline">
            Visão Geral
          </button>
          <button onClick={() => navigate("/admin/itens")} className="hover:underline">
            Itens
          </button>
          <button onClick={() => navigate("/admin/relatorios")} className="hover:underline">
            Relatórios
          </button>
          <button onClick={() => navigate("/admin/locais")} className="hover:underline">
            Locais & Recepções
          </button>
          <button onClick={() => navigate("/admin/create-user")} className="hover:underline">
            Usuários
          </button>
          <button onClick={() => navigate("/admin/faq")} className="hover:underline">
            FAQ
          </button>
          <button
            onClick={handleLogout}
            className="bg-white text-[#065F46] px-4 py-1.5 rounded-lg font-medium hover:bg-gray-100 transition"
          >
            Sair
          </button>
        </div>

        {/* Botão Mobile */}
        <button
          className="md:hidden text-2xl focus:outline-none"
          onClick={() => setOpen(!open)}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Menu Mobile */}
      {open && (
        <div className="md:hidden bg-[#064E3B] px-4 py-3 space-y-2 text-sm animate-fadeIn">
          {[
            { label: "Visão Geral", path: "/admin" },
            { label: "Itens", path: "/admin/itens" },
            { label: "Relatórios", path: "/admin/relatorios" },
            { label: "Locais & Recepções", path: "/admin/locais" },
            { label: "Usuários", path: "/admin/create-user" },
            { label: "FAQ", path: "/admin/faq" },
          ].map((link) => (
            <button
              key={link.path}
              onClick={() => {
                navigate(link.path);
                setOpen(false);
              }}
              className="block w-full text-left py-1.5 px-2 rounded-md hover:bg-white/10 transition"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="block w-full text-center bg-white text-[#065F46] px-4 py-2 rounded-lg mt-3 font-medium hover:bg-gray-100 transition"
          >
            Sair
          </button>
        </div>
      )}
    </header>
  );
};

export default HeaderAdmin;
