import { Link } from "react-router-dom";
import logo from "../assets/logotipo.webp";

const Header = () => {
  return (
    <header className="sticky top-0 z-30 w-full bg-[#065F46]/95 backdrop-blur text-white py-3.5 shadow-lg shadow-emerald-950/10">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        {/* Logo + título */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logo}
            alt="Logo da Instituição"
            className="h-10 w-auto object-contain"
          />
          <span className="text-base sm:text-xl font-semibold tracking-wide uppercase font-montserrat">
            Achados e Perdidos
          </span>
        </Link>

        {/* Botão Login */}
        <Link
          to="/admin-login"
          className="px-4 py-1.5 rounded-lg text-sm font-medium bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/25 transition-colors"
        >
          Login
        </Link>
      </div>
    </header>
  );
};

export default Header;
