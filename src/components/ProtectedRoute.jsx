// ── components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  // 🔑 usar sessionStorage em vez de localStorage
  const storedUser = sessionStorage.getItem("auth_user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  // não logado → vai para login
  if (!user) {
    return <Navigate to="/admin-login" replace />;
  }

  // se exigir role específica
  if (role) {
    // se role for string simples → compara direto
    if (typeof role === "string" && user.role !== role) {
      return <Navigate to="/admin-login" replace />;
    }

    // se role for array → só deixa passar se tiver algum válido
    if (Array.isArray(role) && !role.includes(user.role)) {
      return <Navigate to="/admin-login" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
