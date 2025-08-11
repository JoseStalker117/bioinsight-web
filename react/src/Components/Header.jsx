import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Layout, Menu, Button, Drawer, Modal, Form, Input, message, Tooltip } from "antd";
import { LoginOutlined, MenuOutlined, GoogleOutlined, GithubOutlined, WindowsOutlined } from "@ant-design/icons";
import Logo from "../assets/Bioinsight.svg";
import '../css/Header.css'
import Swal from "sweetalert2";
import { apiFetch, API_ENDPOINTS } from "../utils/apiConfig";
const { Header } = Layout;

const HeaderComponent = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [menuVisible, setMenuVisible] = useState(false);
    const [loginModalVisible, setLoginModalVisible] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [form] = Form.useForm();
    const [errorMsg, setErrorMsg] = useState("");
    const [user, setUser] = useState(null);

    // Ponemos "clave" para cada ruta de la pagina
    const menuKeys = {
        "/": "1",
        "/productos": "2",
        "/servicios": "3",
        "/nosotros": "4",
        "/contacto": "5",
    };

    // Array de Menu de Navegacion, para que cuando presione en cada "clave" lo mande a la ruta.
    const menuItems = [
        { key: "1", label: "Home", onClick: () => navigate("/") },
        { key: "2", label: "Productos", onClick: () => navigate("/productos") },
        { key: "3", label: "Servicios", onClick: () => navigate("/servicios") },
        { key: "4", label: "Acerca-de-Nosotros", onClick: () => navigate("/nosotros") },
        { key: "5", label: "Contactanos", onClick: () => navigate("/contacto") },
    ];

    const handleMenuClick = () => setMenuVisible(false);
    const showLoginModal = () => {
        setMenuVisible(false);  
        setLoginModalVisible(true); 
    };

    const closeLoginModal = () => {
        setLoginModalVisible(false);
        setErrorMsg("");
        setIsLogin(true);
    };

    // cambio entre el login y registro
    const handleSwitchForm = () => {
        setIsLogin((prev) => !prev);        
        form.resetFields();
        setErrorMsg("");
    };

    async function login(values) {
        try {
            const { username, password } = values;
            if (!username || !password) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Usuario y contraseña son requeridos',
                    confirmButtonText: 'Aceptar',
                });
                return;
            }

            let email = username;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(username)) {
                email = username + "@bioinsight.com";
            }
            if (!emailRegex.test(email)) {
                Swal.fire({
                    icon: 'error',
                    title: 'Usuario no válido',
                    text: 'El usuario no es válido',
                    confirmButtonText: 'Aceptar',
                });
                return;
            }

            const data = await apiFetch(API_ENDPOINTS.LOGIN, {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });

            document.cookie = `idToken=${data.idToken}; path=/`;
            Swal.fire({
                icon: "success",
                title: "¡Inicio de Sesion correcto!",
                text: `Bienvenido ${username}`,
                confirmButtonText: "Aceptar",
            });
            closeLoginModal();
            getProfile();
            navigate('/modbus');
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: "Error en la conexión al servidor",
                confirmButtonText: 'Aceptar',
            });
        }
    };

    async function getProfile() {
        const token = document.cookie.split('; ').find(row => row.startsWith('idToken='))?.split('=')[1];
        if (!token) { return; }

        try {
            const data = await apiFetch(API_ENDPOINTS.GET_PROFILE, {
                method: 'GET',
                credentials: 'include',
            });

            document.cookie = `userData=${JSON.stringify(data.user)}; path=/`;
            setUser(data.user);
        } catch (error) {
            console.error("Error en la solicitud getProfile:", error);
        }
    }

    useEffect(() => {
        getProfile();
    }, []);

    async function registerUser(values) {
        try {
            const { nombreReg, apellidosReg, usernameReg, passwordReg } = values;
            const data = await apiFetch(API_ENDPOINTS.REGISTER, {
                method: 'POST',
                body: JSON.stringify({
                    nombreReg,
                    apellidosReg,
                    usernameReg,
                    passwordReg
                }),
            });

            Swal.fire({
                icon: 'success',
                title: 'Registro Exitoso',
                text: 'Usuario registrado correctamente',
                confirmButtonText: 'Aceptar',
            });
            setIsLogin(true);
            form.resetFields();
        } catch (error) {
            if (error.message && error.message.includes('EMAIL_EXISTS')) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'El Usuario ya está registrado. Intenta con otro.',
                    confirmButtonText: 'Aceptar',
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.message || 'Ocurrió un error al registrar al usuario.',
                    confirmButtonText: 'Aceptar',
                });
            }
        }
    };

    const showComingSoonMessage = () => {
        message.info("Próximamente disponible");
    };

    return (
        <Header className='header'>
            {/* Contenedor Logo y Nombre del Proyecto */}
            <div className="contenedor-logo">
                <img src={Logo} alt="Logo" className="logo" />
                <span className="Nombre-projecto">Bioinsight</span>
            </div>

            {/* Menú para pantallas grandes */}
            <Menu mode="horizontal" className="menu" selectedKeys={[menuKeys[location.pathname] || "1"]} items={menuItems} />

            {/* Botón para Inicio de Sesión y Menú en móviles */}
            <div className="menu-actions">
                {user ? (
                    <div>
                        <Button type="primary" onClick={() => navigate('/modbus')} >
                            Ir a la Consola
                        </Button>
                        <span style={{ marginLeft: '10px' }} className="contenedorUsuario1" >
                            Bienvenido {user.nombre}
                        </span>
                    </div>
                ) : (
                    <Button type="primary" icon={<LoginOutlined />} onClick={showLoginModal} className="login-btn">
                        Iniciar Sesión
                    </Button>
                )}
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
                {user && (
                    <div className="contenedorUsuario">
                        <span>Bienvenido {user.nombre}</span>
                    </div>
                )}
                <Menu mode="vertical" onClick={handleMenuClick} selectedKeys={[menuKeys[location.pathname] || "1"]} items={menuItems} />
                <div style={{ padding: "10px" }}>
                    {user ? (
                        <Button type="primary" onClick={() => navigate('/modbus')} block>
                            Ir a la Consola
                        </Button>
                    ) : (
                        <Button type="primary" icon={<LoginOutlined />} onClick={showLoginModal} block>
                            Iniciar Sesión
                        </Button>
                    )}
                </div>
            </Drawer>

            {/* Modal de Inicio de Sesión */}
            <Modal
                title={`Bioinsight - ${isLogin ? 'Iniciar Sesión' : 'Registrarse'}`}
                open={loginModalVisible}
                onCancel={closeLoginModal}
                footer={null}
                centered
                // style={{ top: "-12%" }} // Asegura que el modal esté siempre centrado, sin afectar la página
                height={500}
                width={500}
                // destroyOnClose
            >
                {errorMsg && (
                    <div style={{ backgroundColor: "#ff4d4f", color: "white", padding: "10px", textAlign: "center", borderRadius: "5px", marginBottom: "15px", fontWeight: "bold" }}>
                        {errorMsg}
                    </div>
                )}

                {/* Formulario */}
                {isLogin ? (
                    <Form layout="vertical" onFinish={login}>
                        {/* Logo */}
                        <div style={{ textAlign: "center", marginBottom: "15px" }}>
                            <img src={Logo} alt="Logo" style={{ width: "80px", borderRadius: "50%", border: "2px solid black" }} />
                        </div>

                        {/* Campos de usuario y contraseña */}
                        <Form.Item label="Usuario" name="username" rules={[{ required: true, message: "Por favor, ingresa tu Usuario" }]}>
                            <Input placeholder="Escribe tu Usuario" />
                        </Form.Item>
                        <Form.Item label="Contraseña" name="password" rules={[{ required: true, message: "Por favor, ingresa tu contraseña" }]}>
                            <Input.Password placeholder="Escribe tu contraseña" />
                        </Form.Item>

                        {/* Botón de acceso */}
                        <div className="btnIR">
                            <Button type="primary" htmlType="submit" block>
                                Iniciar Sesión
                            </Button>
                        </div>
                    </Form>
                ) : (
                    <Form form={form} onFinish={isLogin ? login : registerUser} layout="vertical">
                        <div style={{ textAlign: "center", marginBottom: "15px" }}>
                            <img src={Logo} alt="Logo" style={{ width: "80px", borderRadius: "50%", border: "2px solid black" }} />
                        </div>

                        <Form.Item label="Nombre" name="nombreReg" rules={[{ required: true, message: "Por favor, ingresa tu nombre" }]}>
                            <Input placeholder="Escribe tu nombre" />
                        </Form.Item>
                        <Form.Item label="Apellidos" name="apellidosReg" rules={[{ required: true, message: "Por favor, ingresa tu Apellidos" }]}>
                            <Input placeholder="Escribe tu Apellidos" />
                        </Form.Item>
                        <Form.Item label="Usuario" name="usernameReg" rules={[{ required: true, message: "Por favor, ingresa un nombre de usuario" }]}>
                            <Input placeholder="Escribe tu usuario" />
                        </Form.Item>
                        <Form.Item label="Contraseña" name="passwordReg" rules={[{ required: true, message: "Por favor, ingresa tu contraseña" }, ...(isLogin ? [] : [{ min: 6, message: 'La contraseña debe tener al menos 6 caracteres' }])]}>
                            <Input.Password placeholder="Escribe tu contraseña" />
                        </Form.Item>
                        <Form.Item
                            label="Confirmar Contraseña"
                            name="confirm"
                            dependencies={['passwordReg']}
                            rules={[
                                { required: true, message: "Por favor, confirma tu contraseña" },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('passwordReg') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Las contraseñas no coinciden'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder="Confirma tu contraseña" />
                        </Form.Item>

                        <div className="btnIR">
                            <Button type="primary" htmlType="submit" block>
                                Registrarse
                            </Button>
                        </div>
                    </Form>
                )}

                {/* Redes Sociales */}
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                    <p style={{ marginBottom: "5px" }}>O inicia sesión con:</p>
                    <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                        <Tooltip title="Próximamente disponible">
                            <Button shape="circle" icon={<GoogleOutlined />} onClick={showComingSoonMessage} />
                        </Tooltip>
                        <Tooltip title="Próximamente disponible">
                            <Button shape="circle" icon={<WindowsOutlined />} onClick={showComingSoonMessage} />
                        </Tooltip>
                        <Tooltip title="Próximamente disponible">
                            <Button shape="circle" icon={<GithubOutlined />} onClick={showComingSoonMessage} />
                        </Tooltip>
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
        </Header>
    )
};

export default HeaderComponent;