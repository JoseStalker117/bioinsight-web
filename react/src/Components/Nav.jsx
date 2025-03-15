import '../css/prueba.css'
import React, { useState, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import Swal from 'sweetalert2';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  MenuOutlined, UserAddOutlined, DatabaseOutlined,
  EditOutlined, MessageOutlined, UsergroupAddOutlined,
  LogoutOutlined, UserOutlined
} from "@ant-design/icons";

const { Content, Footer, Sider } = Layout;

const NavComponent = ({ children }) => {
  const [collapsed, setCollapsed] = useState(window.innerWidth < 1200);
  const navigate = useNavigate();
  const location = useLocation();

  const menuKeys = {
    "/atlas1": "1",
    "/atlas2": "2",
    "/modbus": "3",
    "/atlas1Edit": "4",
    "/atlas2Edit": "5",
    "/modbusEdit": "6",
    "/newUser": "7",
    "/manageUser": "8",
    "/buzon": "9",
    "/editarProfile": "10"
  };

  const menuItems = [
    { label: "Consulta", disabled: true },
    { key: "1", label: "Atlas1", icon: <DatabaseOutlined />, onClick: () => navigate("/atlas1") },
    { key: "2", label: "Atlas2", icon: <DatabaseOutlined />, onClick: () => navigate("/atlas2") },
    { key: "3", label: "Modbus", icon: <DatabaseOutlined />, onClick: () => navigate("/modbus") },
    // { type: "divider" },
    { label: "Editor", disabled: true },
    { key: "4", label: "Atlas1", icon: <EditOutlined />, onClick: () => navigate("/atlas1Edit") },
    { key: "5", label: "Atlas2", icon: <EditOutlined />, onClick: () => navigate("/atlas2Edit") },
    { key: "6", label: "Modbus", icon: <EditOutlined />, onClick: () => navigate("/modbusEdit") },
    // { type: "divider" },
    { label: "Administrador", disabled: true },
    { key: "7", label: "Nuevo Usuario", icon: <UserAddOutlined />, onClick: () => navigate("/newUser") },
    { key: "8", label: "Gestionar Usuario", icon: <UsergroupAddOutlined />, onClick: () => navigate("/manageUser") },
    { key: "9", label: "Buzón de Mensajes", icon: <MessageOutlined />, onClick: () => navigate("/buzon") },
    { key: "10", label: "Editar Perfil", icon: <UserOutlined />, onClick: () => navigate("/editarProfile") },
    { type: "divider" },
    {
      key: "logout",
      label: "Cerrar Sesión",
      onClick: logout,
      icon: <LogoutOutlined />,
      className: "CerrarSesion",
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      setCollapsed(window.innerWidth < 1100);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  async function logout() {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('idToken='))
      ?.split('=')[1];

    // console.log("Token a eliminar: ", token);
    if (!token) {
      console.error("No se encontró el token para cerrar sesión.");
      return;
    }

    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "¡Tu sesión se cerrará!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      const response = await fetch('http://127.0.0.1:8000/rest/logout', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      const data = await response.json();
      if (response.ok) {
        document.cookie = "idToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "userData=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "idToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + window.location.hostname;
        document.cookie = "userData=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + window.location.hostname;

        Swal.fire({
          icon: 'success',
          title: 'Sesión Cerrada',
          text: 'Has cerrado sesión correctamente.',
          confirmButtonText: "Aceptar",
        });
        navigate("/");
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al cerrar sesión.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    } else {
      console.log("Sesión no cerrada");
    }
  }

  return (
    <Layout className="contenedor-layout">
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={() => setCollapsed(!collapsed)}
        className={`barra-lateral ${collapsed ? "collapsed" : ""}`}
        trigger={<MenuOutlined />}
      >
        <Menu mode="inline" selectedKeys={[menuKeys[location.pathname] || "1"]} items={menuItems} />
      </Sider>


      {/* Contenido principal */}
      <Layout className='layout-dashboard'>
        <Content className={`contenedor-principal-dashboard ${collapsed ? "collapsed" : ""}`}>
          {children}
        </Content>
        <Footer className={`layout-footer ${collapsed ? "collapsed" : ""}`}>
          Bioinsight ©2025
        </Footer>
      </Layout>
    </Layout >
  );
};

export default NavComponent;
