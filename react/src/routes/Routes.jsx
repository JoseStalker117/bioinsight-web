import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, useNavigate, useLocation, Route } from "react-router-dom";

// componets
import HeaderComponent from "../Components/Header";
import Footer from "../Components/Footer";

// paginas principales
import Home from "../App";
import Productos from "../pages/Productos";
import Servicios from "../pages/Servicios";
import Nosotros from "../pages/Nosotros";
import Contacto from "../pages/Contacto";

// pagina no encontrada
import NotFound from "../pages/NotFound";

// nueva vista
import App2 from "../App2";
import Modulo1 from "../App/Modulo1"
import Modulo2 from "../App/Modulo2";

const AppRoutes = () => {
    return (
        <Router>
            {/* Encabezado que aparece en todas las paginas, excepto en ciertas paginas */}
            <HeaderLocation />
            <Routes>
                {/* paginas de la primer vista */}
                <Route path="/" element={ <Home/> } />
                <Route path="/productos" element={ <Productos /> } />
                <Route path="/servicios" element={ <Servicios /> } />
                <Route path="/nosotros" element={ <Nosotros /> } />
                <Route path="/contacto" element={ <Contacto /> } />

                {/* Pagina no encontrada */}
                <Route path="*" element={<NotFound />} />
                
                {/* paginas de la segunda vista */}
                <Route path="/modbus" element={ <App2 /> } />
                <Route path="/modulo1" element={ <Modulo1 /> } />
                <Route path="/modulo2" element={ <Modulo2 /> } />
            </Routes>

            <Footer />
        </Router>
    );
};

// FUNCION PARA CONTROLAR LA VISIBILIDAD EL "Header" EN CIERTAS RUTAS.
const HeaderLocation = () => {
    // Obtenemos la ubicacion actual
    const location = useLocation(); 
    // Array con las rutas de paginas en las que no aparecera el "Header"
    const paths = ["/dashboard", "/modbus", "/modulo1", "/modulo2"]
    // Verificamos que la ruta actual no este dentro del array, si, si esta
    //devolvemos un null, para que no se renderize el header, si no, devolvemos el componente "Header"
    return paths.includes(location.pathname) ? null : <HeaderComponent />;
}



export default AppRoutes;