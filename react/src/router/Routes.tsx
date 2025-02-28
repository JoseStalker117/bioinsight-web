import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Header from "../utils/Header";

import LoginRequired from "./LoginRequired";
import AuthGuard from "./AuthGuard";

// PAGINA DE INICIO
import App from "../App";

// PAGINAS MENU
import Productos from "../pages/Productos";
import Servicios from "../pages/Servicios";
import Nosotros from "../pages/nosotros";
import Contacto from "../pages/contacto";

// PAGINAS DE ADMINISTRADOR
import Modbus from "../admin/Modbus";
import Modulo1 from "../admin/Modulo1";
import Modulo2 from "../admin/Modulo2";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <AuthRedirect /> {/* componente que redirige si hay un token */}
      {/* <Header/> */}
      <ConditionalHeader /> {/* Renderiza el encabezado solo si no está en /dashboard */}
      <Routes>
        {/* INICIO */}
        <Route path="/" element={<App />} />
        <Route path="/login-required" element={<LoginRequired />} />

        {/* MENU */}
        <Route path="/productos" element={<Productos />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/acerca-de-nosotros" element={<Nosotros />} />
        <Route path="/contactanos" element={<Contacto />} />

        {/* Paginas de amdiminstrador */}
        <Route path="/modbus"
          element={
            <AuthGuard>
              <Modbus />
            </AuthGuard>
          }
        />

        <Route path="/modulo1"
          element={
            <AuthGuard>
              <Modulo1 />
            </AuthGuard>
          }
        />

        <Route path="/modulo2"
          element={
            <AuthGuard>
              <Modulo2 />
            </AuthGuard>
          }
        />

      </Routes>
    </Router>
  );
};

// Rutas donde vamos a ocultar el header y vamos a usar otro encabezado
const ConditionalHeader: React.FC = () => {
  const location = useLocation();
  const hiddenPaths = ["/modbus", "/modulo1", "/modulo2"]; 

  return hiddenPaths.includes(location.pathname) ? null : <Header />;
};

const AuthRedirect: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation(); 

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      const currentPath = location.pathname;
      const adminPaths = ["/modbus", "/modulo1", "/modulo2"];

      if (!adminPaths.includes(currentPath)) {
        navigate("/modbus"); 
      }
    }
  }, [navigate, location]);

  return null;
};


export default AppRoutes;
