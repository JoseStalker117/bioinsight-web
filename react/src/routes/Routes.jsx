import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, useNavigate, useLocation, Route } from "react-router-dom";

// componets
import HeaderComponent from "../Components/Header";
import Footer from "../Components/Footer";
import HeaderDash from "../Components/HeaderDash";

// paginas principales
import Home from "../App";
import Productos from "../pages/Productos";
import Servicios from "../pages/Servicios";
import Nosotros from "../pages/Nosotros";
import Contacto from "../pages/Contacto";

// pagina no encontrada
import NotFound from "../pages/NotFound";

// paginas dashboard
import Dashboard from "../App2";
import Atlas1 from "../App/Atlas1";
import Atlas2 from "../App/Atlas2";

// paginas dashboard Editar
import Atlas1Edit from "../App/Atlas1Edit";
import Atlas2Edit from "../App/Atlas2Edit";
import ModbusEdit from "../App/ModbusEdit";

// paginas dashboard administrador
import NewUser from "../App/NewUser";
import ManageUser from "../App/ManageUser";
import Buzon from "../App/Buzon";

// editar perfil
import EditProfile from "../App/EditProfile";

const AppRoutes = () => {
    return (
        <Router>
            {/* Encabezado que aparece en todas las paginas, excepto en ciertas paginas */}
            <HeaderLocation />
            <Routes>
                {/* paginas de la primer vista */}
                <Route path="/" element={<Home />} />
                <Route path="/productos" element={<Productos />} />
                <Route path="/servicios" element={<Servicios />} />
                <Route path="/nosotros" element={<Nosotros />} />
                <Route path="/contacto" element={<Contacto />} />

                {/* Pagina no encontrada */}
                <Route path="*" element={<NotFound />} />

                {/* paginas de la segunda vista */}
                <Route path="/atlas1" element={<Atlas1 />} />
                <Route path="/atlas2" element={<Atlas2 />} />
                <Route path="/modbus" element={<Dashboard />} />

                <Route path="/atlas1Edit" element={<Atlas1Edit />} />
                <Route path="/atlas2Edit" element={<Atlas2Edit />} />
                <Route path="/modbusEdit" element={<ModbusEdit />} />

                <Route path="/newUser" element={<NewUser />} />
                <Route path="/manageUser" element={<ManageUser />} />
                <Route path="/buzon" element={<Buzon />} />

                <Route path="/editarProfile" element={<EditProfile />} />
            </Routes>

            <FooterLocation />
        </Router>
    );
};

const HeaderLocation = () => {
    const location = useLocation();
    const paths = ["/dashboard", "/atlas1", "/atlas2", "/modbus", "/atlas1Edit", "/atlas2Edit", "/modbusEdit", "/newUser", "/manageUser", "/buzon", "/editarProfile"]
    if (paths.includes(location.pathname)) {
        return <HeaderDash />;
    }
    return <HeaderComponent />;
}

const FooterLocation = () => {
    const location = useLocation();
    const paths = ["/dashboard", "/atlas1", "/atlas2", "/modbus", "/atlas1Edit", "/atlas2Edit", "/modbusEdit", "/newUser", "/manageUser", "/buzon", "/editarProfile"]
    return paths.includes(location.pathname) ? null : <Footer />;
}

export default AppRoutes;