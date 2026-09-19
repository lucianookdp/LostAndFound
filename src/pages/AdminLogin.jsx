// ── pages/AdminLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiArrowLeft, FiAlertCircle } from "react-icons/fi";
import { login, me } from "../services/authApi";
import secureImg from "../assets/undraw_security_0ubl.svg";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    if (username.length > 30) {
      setError("O usuário não pode ultrapassar 30 caracteres.");
      return;
    }

    if (password.length > 50) {
      setError("A senha não pode ultrapassar 50 caracteres.");
      return;
    }

    if (!/^[a-zA-Z0-9._]+$/.test(username)) {
      setError("O usuário contém caracteres inválidos.");
      return;
    }

    setLoading(true);

    try {
      await login({ username: username.trim(), password });

      const who = await me();
      const role = who?.user?.role || "func";

      sessionStorage.setItem("auth_user", JSON.stringify(who.user));

      if (role === "admin") navigate("/admin");
      else navigate("/admin/itens");
    } catch (err) {
      // tratamento simples como você pediu
      setError("Usuário ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* formulário */}
      <div className="flex items-center justify-center px-6 sm:px-12 bg-gradient-to-br from-[#065F46] via-emerald-700 to-emerald-800">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 sm:p-10">
          <button
            onClick={() => navigate("/")}
            className="mb-6 text-gray-500 hover:text-[#10B981] transition"
            type="button"
          >
            <FiArrowLeft size={22} />
          </button>

          <h1 className="text-3xl font-bold text-[#065F46] mb-2 text-center">
            Acesso Administrativo
          </h1>
          <p className="text-sm text-gray-600 text-center mb-6">
            Entre com suas credenciais para acessar o painel.
          </p>

          {error && (
            <div className="mb-6 flex items-center gap-2 justify-center rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
              <FiAlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* usuário */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Usuário
              </label>
              <input
                id="username"
                type="text"
                maxLength={30}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Digite seu usuário"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#10B981] outline-none"
                required
              />
            </div>

            {/* senha */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  maxLength={50}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  className="w-full px-4 py-3 pr-11 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#10B981] outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-[#10B981]"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            {/* botão entrar */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#10B981] text-white font-semibold py-3 rounded-lg transition text-lg shadow-md ${
                loading
                  ? "opacity-60 cursor-not-allowed"
                  : "hover:bg-emerald-600 hover:shadow-lg"
              }`}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>

      {/* imagem */}
      <div className="hidden lg:flex flex-col items-center justify-center bg-white p-10">
        <img
          src={secureImg}
          alt="Ilustração de segurança"
          className="w-full max-w-xl mb-6 drop-shadow-md"
        />
        <h2 className="text-2xl font-semibold text-[#065F46]">
          Segurança em primeiro lugar
        </h2>
        <p className="text-sm text-gray-600 mt-2 max-w-sm text-center">
          Este painel é exclusivo para uso interno. Certifique-se de que possui
          credenciais válidas.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
