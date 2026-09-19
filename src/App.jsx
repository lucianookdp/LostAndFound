import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import AdminItens from "./pages/AdminItens";
import AdminDashboard from "./pages/AdminDashboard";
import UserCreate from "./pages/UserCreate";
import AdminRelatorios from "./pages/AdminRelatorios";
import AdminLocais from "./pages/AdminLocais";
import ProtectedRoute from "./components/ProtectedRoute";
import Faq from "./pages/FAQ"; // <-- nome igual ao que você vai usar

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* protegido: só ADMIN pode acessar dashboard */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* protegido: FUNC e ADMIN podem */}
        <Route
          path="/admin/itens"
          element={
            <ProtectedRoute role={["admin", "func"]}>
              <AdminItens />
            </ProtectedRoute>
          }
        />

        {/* protegido: FUNC e ADMIN podem ver o FAQ */}
        <Route
          path="/admin/faq"
          element={
            <ProtectedRoute role={["admin", "func"]}>
              <Faq /> {/* <-- usa o mesmo nome do import */}
            </ProtectedRoute>
          }
        />

        {/* protegido: só ADMIN pode */}
        <Route
          path="/admin/create-user"
          element={
            <ProtectedRoute role="admin">
              <UserCreate />
            </ProtectedRoute>
          }
        />

        {/* protegido: ADMIN e FUNC podem visualizar relatórios */}
        <Route
          path="/admin/relatorios"
          element={
            <ProtectedRoute role={["admin", "func"]}>
              <AdminRelatorios />
            </ProtectedRoute>
          }
        />

        {/* protegido: só ADMIN pode */}
        <Route
          path="/admin/locais"
          element={
            <ProtectedRoute role="admin">
              <AdminLocais />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
