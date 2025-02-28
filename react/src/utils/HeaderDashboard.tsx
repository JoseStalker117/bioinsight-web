import React, { useState, useEffect } from "react";
import { Layout, Menu, Button, Drawer, Form, message } from "antd";
import { LogoutOutlined, MenuOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/Header.css";
import Logo from "../assets/Bioinsight.svg";
import axios from 'axios'

const { Header: AntHeader } = Layout;

const HeaderDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuVisible, setMenuVisible] = useState(false);
  // const [form] = Form.useForm(); // Instancia del formulario proximamente
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleMenuClick = () => setMenuVisible(false);

  const menuKeys: { [key: string]: string } = {
    '/modbus': '1',
    '/modulo1': '2',
    '/modulo2': '3',
  }

  const menuItems = [
    { key: "1", label: "Modbus", onClick: () => navigate("/modbus") },
    { key: "2", label: "Modulo1", onClick: () => navigate("/modulo1") },
    { key: "3", label: "Modulo2", onClick: () => navigate("/modulo2") },
  ];

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken"); 
    message.success("Sesión cerrada correctamente");
    navigate("/");
  };

  return (
    <AntHeader className="app-header">
      {/* Logo y Nombre */}
      <div className="logo-container">
        <img src={Logo} alt="Logo" className="logo" />
        <span className="project-name">Bioinsight</span>
      </div>

      {/* Menú para pantallas grandes */}
      <Menu mode="horizontal" className="menu" selectedKeys={[menuKeys[location.pathname] || "1"]} items={menuItems} />

      {/* Botón de Inicio de Sesión y Menú en móviles */}
      <div className="menu-actions">
        <Button type="primary" icon={<LogoutOutlined />} onClick={handleLogout} className="login-btn">
          Cerrar Sesion
        </Button>
        <Button className="menu-btn" type="text" icon={<MenuOutlined />} onClick={() => setMenuVisible(true)} />
      </div>

      {/* Drawer para menú en móviles */}
      <Drawer
        title="Menú"
        placement="right"
        onClose={() => setMenuVisible(false)}
        open={menuVisible}
        styles={{ body: { padding: 20 } }}
      >
        <Menu mode="vertical" onClick={handleMenuClick} selectedKeys={[menuKeys[location.pathname] || "1"]} items={menuItems} />
        <div style={{ padding: "10px" }}>
          <Button type="primary" icon={<LogoutOutlined />} onClick={handleLogout} block>
            Cerrar Sesion
          </Button>
        </div>
      </Drawer>
    </AntHeader >
  );
};

export default HeaderDashboard;
