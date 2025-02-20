import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "../utils/Header";

// PAGINA DE INICIO
import App from "../App";

// PAGINAS MENU
import Productos from "../pages/Productos";
import Servicios from "../pages/Servicios";
import Nosotros from "../pages/nosotros";
import Contacto from "../pages/contacto";
import Register from "../utils/Register";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Header/>
      <Routes>
        {/* INICIO */}
        <Route path="/" element={<App />} />

        {/* MENU */}
        <Route path="/productos" element={<Productos />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/acerca-de-nosotros" element={<Nosotros />} />
        <Route path="/contactanos" element={<Contacto />} />

        <Route path="/registrarse" element={<Register />} />

      </Routes>
    </Router>
  );
};

export default AppRoutes;
