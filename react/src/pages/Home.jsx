import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Root.css"
import "../css/Home.css"
import CardHomeComponent from "../utils/Cards-home";
import SliderComponent from "../utils/Slider";
import FormContactoComponent from "../utils/Form-Contacto";

function Home() {
  const navigate = useNavigate();

  const explorar = () => {
    navigate('/productos')
  };

  return (
    <div className="contenedor-principal">
      <h1>Bienvenido a Bioinsight</h1>
      <p>
        Innovando la ciencia de las microalgas en entornos tecnológicos. Descubre las tecnologías
        para el muestreo, almacenamiento y análisis de datos de tus proyectos.
      </p>

      {/* Botón de acción */}
      <button className="action-button" onClick={explorar}>Explorar más</button>

      {/* Contenedor de tarjetas */}
      <CardHomeComponent />

      {/* Slider de imagenes */}
      <SliderComponent />

      {/* Formulario de contactanos*/}
      <FormContactoComponent/>
    </div>
  );
}

export default Home;
