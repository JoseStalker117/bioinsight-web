import Footer from "./utils/Footer";
import "./css/Pages.css";
import "./css/App.css";
import { useState } from "react";
import Swal from "sweetalert2";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import Prueba1 from './Img/Prueba1.jpeg';
import Prueba2 from './Img/Prueba2.jpeg';
import Prueba3 from './Img/Prueba3.jpeg';

function App() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted", formData);

    Swal.fire({
      icon: "success",
      title: "¡Mensaje Enviado!",
      text: "Tu mensaje ha sido enviado con éxito. Nos pondremos en contacto pronto.",
      confirmButtonText: "Aceptar",
    });

    // Limpiar los campos del formulario después del envío
    setFormData({
      name: "",
      email: "",
      message: "",
    });
  };

  return (
    <>
      <div className="page-content">
        <h1>Bienvenido a Bioinsight</h1>
        <p>
          Innovando la ciencia de las microalgas en entornos tecnológicos. Descubre las tecnologías
          para el muestreo, almacenamiento y análisis de datos de tus proyectos.
        </p>

        {/* Botón de acción */}
        <button className="action-button">Explorar más</button>

        {/* Contenedor de tarjetas */}
        {/* <div className="cards-container">
          <div className="card">
            <h3>Compromiso</h3>
            <p>En BioInsight nos comprometemos a que todos nuestros productos sean de calidad y que
              cumplan más allá de las expectativas.</p>
          </div>
          <div className="card">
            <h3>Integridad</h3>
            <p>Toda la información recopilada de los proyectos mantiene la seguridad y estructura para que
              esta información sea ágil y de acceso controlado por el usuario.</p>
          </div>
          <div className="card">
            <h3>Responsividad</h3>
            <p>Nuestras aplicaciones actúan responsivamente siendo susceptibles a fallos eléctricos o de
              conectividad, requiriendo poca interacción para solucionarse.</p>
          </div>
        </div> */}

        {/* Slider de imágenes */}
        <div className="slider-principal">
          <Swiper
            modules={[Pagination, Autoplay]}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            // loop={true}
            loop={false} // desactivamos loop ahorita que no tenemos mas img
            className="slider-container"
          >
            <SwiperSlide>
              <img src={Prueba1} alt="Prueba 1" />
            </SwiperSlide>
            <SwiperSlide>
              <img src={Prueba2} alt="Prueba 2" />
            </SwiperSlide>
            <SwiperSlide>
              <img src={Prueba3} alt="Prueba 3" />
            </SwiperSlide>
          </Swiper>
        </div>


        {/* Formulario de contacto */}
        <div className="form-container">
          <h3>Contáctanos</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-item">
              <label htmlFor="name">Nombre:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-item">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-item">
              <label htmlFor="message">Mensaje:</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="submit-btn">Enviar</button>
          </form>
        </div>

      </div>
      <Footer />
    </>
  );
}

export default App;
