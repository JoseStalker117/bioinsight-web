import React from "react";
import "../css/Footer.css";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter, FaDiscord, FaYoutube, FaTiktok, FaEnvelope, } from "react-icons/fa";
import { MailOutlined, PhoneOutlined, PushpinOutlined } from "@ant-design/icons";

const Footer: React.FC = () => {
  return (
    <div className="footer-container">
      <div className="footer-top">
        {/* Acerca de Bioinsight */}
        <div className="footer-item">
          <h3>Acerca de Bioinsight</h3>
          <p>Buscamos ser una opción viable para nuestros consumidores, ofreciendo un servicio simple.</p>
        </div>

        {/* Enlaces */}
        <div className="footer-item">
          <h3>Enlaces</h3>
          <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/productos">Productos</Link></li>
            <li><Link to="/servicios">Servicios</Link></li>
            <li><Link to="/acerca-de-nosotros">Acerca de Nosotros</Link></li>
            <li><Link to="/contactanos">Contacto</Link></li>
          </ul>
        </div>

        {/* Contacto */}
        <div className="footer-item">
          <h3>Contacto</h3>
          <p><a href="mailto:info@bioinsight.com"><MailOutlined /> info@bioinsight.com</a></p>
          <p><a href="tel:+1234567890"><PhoneOutlined /> +1 234 567 890</a></p>
          <p><PushpinOutlined /> Santa Catarina, Nuevo Leon</p>
        </div>

        {/* Redes Sociales */}
        <div className="footer-item">
          <h3>Síguenos</h3>
          <div className="social-icons">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
            <a href="https://discord.com" target="_blank" rel="noopener noreferrer"><FaDiscord /></a>
            <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
            <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer"><FaTiktok /></a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
