import { Link } from "react-router-dom";
import logo from "../assets/logotipo.webp";

const Header = () => {
  return (
    <header className="w-full bg-[#065F46] text-white py-4 shadow-md">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        {/* Logo + título */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logo}
            alt="Logo da Instituição"
            className="h-12 w-auto object-contain"
          />
          <span className="text-xl font-semibold tracking-wide uppercase font-montserrat">
            Achados e Perdidos
          </span>
        </Link>

        {/* Botão Login */}
        <Link
          to="/admin-login"
          className="px-4 py-1.5 rounded-lg text-sm font-medium bg-white/10 hover:bg-white/20 transition"
        >
          Login
        </Link>
      </div>
    </header>
  );
};

export default Header;
