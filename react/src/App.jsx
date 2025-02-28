import Footer from "./utils/Footer";
import "./css/Pages.css";
import "./css/App.css";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import axios from "axios";
import { Layout, Menu, Button, Drawer, Modal, Form, Input, message } from "antd";

const imageUrls = [
  "https://i.ibb.co/b5KLF4vN/Microalga02.webp", 
  "https://i.ibb.co/NgphXP9Y/Microalga04.webp",
  "https://i.ibb.co/ccMcwzqD/Microalga03.webp"
];

const explorar = () => {
  alert("gfdgrtbr")
};

function App() {
  const [message, setMessage] = useState("");
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    try {
      await axios.post('http://localhost:8000/rest/contacto', values, {
        headers: { "Content-Type": "application/json" },
      });
      Swal.fire({
        icon: "success",
        title: "¡Mensaje Enviado!",
        text: "Mensaje enviado. Nos pondremos en contacto pronto.",
        confirmButtonText: "Aceptar",
      });
      form.resetFields();

    } catch (error) {
      console.error('Error al registrar:', error);
      setErrorMsg(
        error.response?.data?.message || "Error al registrar usuario. Intenta de nuevo."
      );
    }
  }

  return (
    <>
      <div className="page-content">
        <h1>Bienvenido a Bioinsight</h1>
        <div>
          <h1>Prueba de Conexión</h1>
          <p>{message}</p>
        </div>
        <p>
          Innovando la ciencia de las microalgas en entornos tecnológicos. Descubre las tecnologías
          para el muestreo, almacenamiento y análisis de datos de tus proyectos.
        </p>

        {/* Botón de acción */}
        <button className="action-button" onClick={explorar}>Explorar más</button>

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
            {imageUrls.map((url, index) => (
              <SwiperSlide key={index}>
                <img src={url} alt={`Slide ${index + 1}`} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>


        {/* Formulario de contacto */}
        <div className="form-container">
          <Form form={form} onFinish={handleSubmit}>
            <Form.Item label="Nombre" name="nombre" rules={[{ required: true, message: "Por favor, ingresa tu nombre" }]}>
              <Input placeholder="Escribe tu nombre" />
            </Form.Item>
            <Form.Item label="Correo Electrónico" name="email" rules={[{ required: true, message: "Por favor, ingresa tu correo electrónico" }]}>
              <Input placeholder="Escribe tu correo electrónico" />
            </Form.Item>
            <Form.Item label="Mensaje" name="mensaje" rules={[{ required: true, message: "Por favor, ingresa un Mensaje" }]}>
              <Input placeholder="Escribe tu Mensaje" />
            </Form.Item>
            <Button type="primary" htmlType="submit" block>
              Enviar
            </Button>
          </Form>
        </div>

      </div>
      <Footer />
    </>
  );
};

export default App;
