import React, { useState } from "react";
import { Layout, Menu, Button, Drawer, Modal, Form, Input } from "antd";
import { LoginOutlined, MenuOutlined, FacebookOutlined, InstagramOutlined, MailOutlined, GoogleOutlined } from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../css/Header.css";
import Logo from "../assets/Bioinsight.svg";

const { Header: AntHeader } = Layout;

const AppHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuVisible, setMenuVisible] = useState(false);
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [isLogin, setIsLogin] = useState(true); // Estado para saber si estamos en el formulario de login o registro
  const [form] = Form.useForm(); // Instancia del formulario

  const [errors, setErrors] = useState("");

  const handleMenuClick = () => setMenuVisible(false);
  const showLoginModal = () => setLoginModalVisible(true);
  const closeLoginModal = () => {
    setLoginModalVisible(false);
    setErrors("");
    setIsLogin(true); // Restablecer a la vista de login al cerrar
  };

  const menuKeys: { [key: string]: string } = {
    '/': '1',
    '/productos': '2',
    '/servicios': '3',
    '/acerca-de-nosotros': '4',
    '/contactanos': '5',
  }

  const menuItems = [
    { key: "1", label: "Inicio", onClick: () => navigate("/") },
    { key: "2", label: "Productos", onClick: () => navigate("/productos") },
    { key: "3", label: "Servicios", onClick: () => navigate("/servicios") },
    { key: "4", label: "Acerca de Nosotros", onClick: () => navigate("/acerca-de-nosotros") },
    { key: "5", label: "Contáctanos", onClick: () => navigate("/contactanos") },
  ];

  const onFinishLogin = (values) => {
    console.log("Datos de login:", values);
    if (values.username !== "admin" || values.password !== "1234") {
      setErrors("Usuario o contraseña incorrectos");
    } else {
      setErrors("");
      closeLoginModal();
    }
  };

  const onFinishRegister = (values) => {
    console.log("Datos de registro:", values);
    form.resetFields(); // Limpiar el formulario después de completar el registro
    setErrors("");
  };

  const handleSwitchForm = () => {
    setIsLogin((prev) => !prev); // Alternar entre login y registro
    setErrors(""); // Limpiar errores cuando se cambia de formulario
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
        <Button type="primary" icon={<LoginOutlined />} onClick={showLoginModal} className="login-btn">
          Iniciar Sesión
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
          <Button type="primary" icon={<LoginOutlined />} onClick={showLoginModal} block>
            Iniciar Sesión
          </Button>
        </div>
      </Drawer>

      {/* Modal de Inicio de Sesión */}
      <Modal
        title={`Bioinsight - ${isLogin ? 'Iniciar Sesión' : 'Registrarse'}`}
        open={loginModalVisible}
        onCancel={closeLoginModal}
        footer={null}
        height={600}
        width={500} // Ajustar tamaño del modal
      >
        {/* Header de errores */}
        {errors && (
          <div style={{ backgroundColor: "#ff4d4f", color: "white", padding: "10px", textAlign: "center", borderRadius: "5px", marginBottom: "15px" }}>
            {errors}
          </div>
        )}

        {/* Formulario */}
        {isLogin ? (
          <Form layout="vertical" onFinish={onFinishLogin}>
            {/* Logo */}
            <div style={{ textAlign: "center", marginBottom: "15px" }}>
              <img src={Logo} alt="Logo" style={{ width: "80px", borderRadius: "50%", border: "2px solid black" }} />
            </div>

            {/* Campos de usuario y contraseña */}
            <Form.Item label="Usuario" name="username" rules={[{ required: true, message: "Por favor, ingresa tu usuario" }]}>
              <Input placeholder="Escribe tu usuario" />
            </Form.Item>
            <Form.Item label="Contraseña" name="password" rules={[{ required: true, message: "Por favor, ingresa tu contraseña" }]}>
              <Input.Password placeholder="Escribe tu contraseña" />
            </Form.Item>

            {/* Botón de acceso */}
            <Button type="primary" htmlType="submit" block>
              Iniciar Sesión
            </Button>
          </Form>
        ) : (
          <Form layout="vertical" onFinish={onFinishRegister} form={form}>
            {/* Logo */}
            <div style={{ textAlign: "center", marginBottom: "15px" }}>
              <img src={Logo} alt="Logo" style={{ width: "80px", borderRadius: "50%", border: "2px solid black" }} />
            </div>

            {/* Campos adicionales para registro */}
            <Form.Item label="Nombre Completo" name="RegistroNombre" rules={[{ required: true, message: "Por favor, ingresa tu nombre completo" }]}>
              <Input placeholder="Escribe tu nombre completo" />
            </Form.Item>
            <Form.Item label="Correo Electrónico" name="Registroemail" rules={[{ required: true, type: "email", message: "Por favor, ingresa un correo electrónico válido" }]}>
              <Input placeholder="Escribe tu correo electrónico" />
            </Form.Item>
            <Form.Item label="Usuario" name="RegistroUsername" rules={[{ required: true, message: "Por favor, ingresa un nombre de usuario" }]}>
              <Input placeholder="Escribe tu usuario" />
            </Form.Item>
            <Form.Item label="Contraseña" name="RegistroPassword" rules={[{ required: true, message: "Por favor, ingresa tu contraseña" }]}>
              <Input.Password placeholder="Escribe tu contraseña" />
            </Form.Item>

            {/* Botón de registro */}
            <Button type="primary" htmlType="submit" block>
              Registrarse
            </Button>
          </Form>
        )}

        {/* Redes Sociales */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <p style={{ marginBottom: "5px" }}>O inicia sesión con:</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
            <Button type="default" shape="circle" icon={<MailOutlined />} ></Button>
            <Button type="default" shape="circle" icon={<GoogleOutlined />} ></Button>
            <Button type="default" shape="circle" icon={<FacebookOutlined />} ></Button>
            <Button type="default" shape="circle" icon={<InstagramOutlined />} ></Button>
          </div>
        </div>

        {/* Enlace para cambiar entre Login y Registro */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          {isLogin ? (
            <p>¿No tienes cuenta? <a onClick={handleSwitchForm}>Regístrate aquí</a></p>
          ) : (
            <p>¿Ya tienes cuenta? <a onClick={handleSwitchForm}>Inicia sesión aquí</a></p>
          )}
        </div>
      </Modal>
    </AntHeader >
  );
};

export default AppHeader;
