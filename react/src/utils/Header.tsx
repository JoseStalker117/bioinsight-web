import React, { useState } from "react";
import { Layout, Menu, Button, Drawer, Modal, Form, Input, message } from "antd";
import { LoginOutlined, MenuOutlined, FacebookOutlined, InstagramOutlined, MailOutlined, GoogleOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/Header.css";
import Logo from "../assets/Bioinsight.svg";
import { apiPost, API_ENDPOINTS } from './apiConfig'

const { Header: AntHeader } = Layout;

const AppHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuVisible, setMenuVisible] = useState(false);
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [isLogin, setIsLogin] = useState(true); // Estado para saber si estamos en el formulario de login o registro
  const [form] = Form.useForm(); // Instancia del formulario
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleMenuClick = () => setMenuVisible(false);
  const showLoginModal = () => setLoginModalVisible(true);
  const closeLoginModal = () => {
    setLoginModalVisible(false);
    setErrorMsg(""); // Limpiar errores al cambiar de formulario
    setIsLogin(true);
  };

  const handleSwitchForm = () => {
    setIsLogin((prev) => !prev); // Alternar entre login y registro
    setErrorMsg(""); // Limpiar errores al cambiar de formulario
    form.resetFields(); // Restablecer campos al cambiar de formulario
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

  const onFinishLogin = async (values) => {
    try {
      const response = await apiPost(API_ENDPOINTS.LOGIN, values);
      console.log("Respuesta del servidor:", response);
      const token = response.idToken;
      console.log("Token guardado:", token);

      localStorage.setItem("authToken", token); // Guardar token en localStorage
      message.success("Inicio de sesión exitoso");
      closeLoginModal();
      navigate("/modbus");
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error);
      setErrorMsg(
        error.message || "Credenciales incorrectas o correo no encontrado"
      );
    }
  };

  const onFinishRegister = async (values: { nombre, apellidos, username, password }) => {
    try {
      await apiPost(API_ENDPOINTS.REGISTER, values);
      message.success("Registro exitoso. Ahora puedes iniciar sesión.");
      form.resetFields();
      setErrorMsg(""); 
      setIsLogin(true);
    } catch (error: any) {
      console.error('Error al registrar:', error);
      setErrorMsg(
        error.message || "Error al registrar usuario. Intenta de nuevo."
      );
    }
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
        width={500}
      >
        {errorMsg && (
          <div style={{ backgroundColor: "#ff4d4f", color: "white", padding: "10px", textAlign: "center", borderRadius: "5px", marginBottom: "15px", fontWeight: "bold" }}>
            {errorMsg}
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
            <Form.Item label="Correo Electrónico" name="email" rules={[{ required: true, message: "Por favor, ingresa tu correo electrónico" }]}>
              <Input placeholder="Escribe tu correo electrónico" />
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
          // <Form layout="vertical" form={form} onFinish={onFinishRegister} >
          <Form form={form} onFinish={isLogin ? onFinishLogin : onFinishRegister} layout="vertical">
            {/* Logo */}
            <div style={{ textAlign: "center", marginBottom: "15px" }}>
              <img src={Logo} alt="Logo" style={{ width: "80px", borderRadius: "50%", border: "2px solid black" }} />
            </div>

            {/* Campos adicionales para registro */}
            <Form.Item label="Nombre" name="nombre" rules={[{ required: true, message: "Por favor, ingresa tu nombre" }]}>
              <Input placeholder="Escribe tu nombre" />
            </Form.Item>
            <Form.Item label="Apellidos" name="apellidos" rules={[{ required: true, message: "Por favor, ingresa tu Apellidos" }]}>
              <Input placeholder="Escribe tu Apellidos" />
            </Form.Item>
            <Form.Item label="Usuario" name="username" rules={[{ required: true, message: "Por favor, ingresa un nombre de usuario" }]}>
              <Input placeholder="Escribe tu usuario" />
            </Form.Item>
            <Form.Item label="Contraseña" name="password" rules={[{ required: true, message: "Por favor, ingresa tu contraseña" }, ...(isLogin ? [] : [{ min: 6, message: 'La contraseña debe tener al menos 6 caracteres' }])]}>
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
