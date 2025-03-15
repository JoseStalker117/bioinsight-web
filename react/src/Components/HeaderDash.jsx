import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "antd";
import Logo from "../assets/Bioinsight.svg";
import '../css/Header.css'
import Swal from "sweetalert2"

const { Header } = Layout;

const HeaderDash = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [alertShown, setAlertShown] = useState(false); // Para controlar si ya mostramos la alerta
    const [tokenExpired, setTokenExpired] = useState(false);

    function getUserFromCookies() {
        const storedUser = document.cookie.split('; ').find(row => row.startsWith('userData='))?.split('=')[1];
        return JSON.parse(storedUser);
        // return storedUser ? JSON.parse(storedUser.split('=')[1]) : null;
    }

    function decodeJWT(token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    }

    function getTokenExpiration() {
        const token = document.cookie.split('; ').find(row => row.startsWith('idToken='))?.split('=')[1];
        if (!token) return null;

        try {
            const decodedToken = decodeJWT(token);
            const expirationTime = decodedToken.exp * 1000;
            // const expirationTime = (decodedToken.exp - 3565) * 1000; // 59 minutos menos prueba
            return expirationTime;
        } catch (error) {
            console.error("Error al decodificar el token:", error);
            return null;
        }
    }

    function calculateTimeLeft() {
        const expirationTime = getTokenExpiration();
        if (!expirationTime) return "Sin token";

        const now = Date.now();
        const diff = expirationTime - now;

        if (diff <= 0) {
            setTokenExpired(true);
            navigate('/');
            return "Token expirado";
        }

        const secondsLeft = Math.floor(diff / 1000);

        if (secondsLeft === 30 && !alertShown) {
            setAlertShown(true);
            Swal.fire({
                icon: 'warning',
                title: '¡Tu sesión está por expirar!',
                text: `Quedan 30s segundos para que tu sesión expire.`,
                timerProgressBar: true,
                timer: 30000,
            })
        }

        return null;
    }

    useEffect(() => {
        setTimeout(() => {
            const userData = getUserFromCookies();
            if (userData) {
                setUser(userData);
            }
        }, 500);
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            calculateTimeLeft();
        }, 1000); // Revisar cada segundo

        return () => clearInterval(intervalId); // Limpiar el intervalo al desmontar
    }, [alertShown]);

    function Home() {
        navigate('/')
        message.info("¿Ir al inicio?");
    }

    return (
        <Header className='header'>
            <div className="contenedor-logo" onClick={Home}>
                <img src={Logo} alt="Logo" className="logo" />
                <span className="Nombre-projecto">Bioinsight</span>
            </div>

            <div className="menu-actions">
                <span style={{ marginLeft: '10px' }} className="contenedorUsuario1" >
                    {user ? `Bienvenido ${user.nombre}` : ""}
                    {/* <img src={user.profilePicture || Logo} alt="Avatar" className="usuario-avatar" /> */}
                </span>
                {/* <Button type="danger" icon={<LogoutOutlined />} onClick={showLoginModal} className="logout-btn">
                    Cerrar Sesión
                </Button> */}
                {/* <Button className="menu-btn" type="text" icon={<MenuOutlined />} onClick={() => setMenuVisible(true)} /> */}
            </div>
        </Header>
    )
};

export default HeaderDash;