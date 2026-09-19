// ── pages/AdminLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiArrowLeft, FiAlertCircle } from "react-icons/fi";
import { login, me } from "../services/authApi";
import secureImg from "../assets/undraw_security_0ubl.svg";

// Na demo ninguém digita credenciais: escolhe-se um perfil e entra.
const PERFIS = [
  {
    chave: "admin",
    rotulo: "Entrar como administrador",
    resumo: "Acesso completo: painel, relatórios, locais e usuários.",
    username: "admin",
    password: "admin",
  },
  {
    chave: "func",
    rotulo: "Entrar como funcionário",
    resumo: "Recepção Bloco A: só os itens e o FAQ.",
    username: "recepcao.a",
    password: "demo",
  },
];

const AdminLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [perfil, setPerfil] = useState(PERFIS[0]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const username = perfil.username;
  const password = perfil.password;

  const entrar = async (escolhido) => {
    setPerfil(escolhido);
    setError("");
    setLoading(true);

    try {
      await login({
        username: escolhido.username,
        password: escolhido.password,
      });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    entrar(perfil);
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
                placeholder="Digite seu usuário"
                readOnly
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#10B981] outline-none cursor-default"
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
                  placeholder="Digite sua senha"
                  readOnly
                  className="w-full px-4 py-3 pr-11 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#10B981] outline-none cursor-default"
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

            {/* um botão por perfil: nada para digitar */}
            <div className="space-y-3">
              {PERFIS.map((p, i) => (
                <button
                  key={p.chave}
                  type="button"
                  onClick={() => entrar(p)}
                  disabled={loading}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition shadow-md text-left ${
                    loading ? "opacity-60 cursor-not-allowed" : "hover:shadow-lg"
                  } ${
                    i === 0
                      ? "bg-[#10B981] text-white hover:bg-emerald-600"
                      : "bg-white text-[#065F46] border border-emerald-200 hover:bg-emerald-50"
                  }`}
                >
                  <span className="block text-base">
                    {loading && perfil.chave === p.chave
                      ? "Entrando..."
                      : p.rotulo}
                  </span>
                  <span
                    className={`block text-xs font-normal mt-0.5 ${
                      i === 0 ? "text-emerald-50" : "text-gray-500"
                    }`}
                  >
                    {p.resumo}
                  </span>
                </button>
              ))}
            </div>
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
