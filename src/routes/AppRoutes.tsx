import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Home } from "../pages/Home/Home";
import  Login  from "../pages/Login/Login";
import { HomeADMIN } from "../pages/Home/HomeAdmin";

// Componente de Rota Protegida
function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode, requiredRole?: string }) {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const userRole = localStorage.getItem("userRole");

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export function AppRoutes() {
  return (
      <Router>
        <Routes>
          {/* Rota pública - Login */}
          <Route path="/login" element={<Login />} />
          
          {/* Rota inicial redireciona para login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Rotas protegidas - Usuário Normal */}
          <Route 
            path="/ScheduledMeetings" 
            element={
              <ProtectedRoute requiredRole="usuario">
                <Home />
              </ProtectedRoute>
            } 
          />
          
          {/* Rotas protegidas - Admin */}
          <Route 
            path="/ScheduledMeetingsADMIN" 
            element={
              <ProtectedRoute requiredRole="admin">
                <HomeADMIN />
              </ProtectedRoute>
            } 
          />

          {/* Rota 404 - Qualquer outra rota redireciona para login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
  );
}