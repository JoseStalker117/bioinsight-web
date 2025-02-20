import React from "react";
import "../css/Pages.css";
import "../css/Servicios.css";
import { Typography } from "antd";
import { useInView } from "react-intersection-observer";
import ModBus1 from '../Img/Modbus01_16_11zon.webp';
import ModBus2 from '../Img/Modbus02_17_11zon.webp';
import ModBus3 from '../Img/Modbus03_18_11zon.webp';

const { Title, Paragraph } = Typography;

function Servicios() {

  const options = {
    triggerOnce: false,
    threshold: 0.2,
  }

  const { ref: soporteTecnicoRef, inView: soporteTecnicoInView } = useInView(options);
  const { ref: cordinacionProductosRef, inView: cordinacionProductosInView } = useInView(options);
  const { ref: AlmacenamientoDatosRef, inView: AlmacenamientoDatosInView } = useInView(options);

  return (
    <div className="page-content">
      <Title level={1} className="page-title">Servicios</Title>

      <section
        ref={soporteTecnicoRef}
        className={`card ${soporteTecnicoInView ? 'slide-in' : 'slide-out'}`}
      >
        <div className="text-content">
          <Title level={2}>Soporte Tecnico</Title>
          <Paragraph className="content-text">
            Bioinsight ofrece servicio de soporte técnico para capacitación de usuarios finales
            para los diferentes productos proporcionados para el laboratorio, desde la instalación
            y calibración de equipos, uso diario y acceso a la información para análisis de datos.          </Paragraph>
        </div>
        <img src={ModBus1} alt="" className="section-image" />
      </section>

      <section
        ref={cordinacionProductosRef}
        className={`card ${cordinacionProductosInView ? 'slide-in' : 'slide-out'}`}
      >
        <div className="text-content">
          <Title level={3}>Coordinación de Productos</Title>
          <Paragraph className="content-text">
            En Bioinsight nos comprometemos con nuestro cliente para ofrecerle la mejor
            atención y asesoramiento, ¿buscas hostear tu servidor? Nosotros te apoyamos,
            ¿quieres un dispositivo que realice tareas en específico? Lo construimos, ¿Requieres
            automatizar un proceso? Nosotros te resolvemos.
          </Paragraph>
        </div>
        <img src={ModBus2} alt="" className="section-image" />
      </section>

      <section
        ref={AlmacenamientoDatosRef}
        className={`card ${AlmacenamientoDatosInView ? 'slide-in' : 'slide-out'}`}
      >
        <div className="text-content">
          <Title level={3}>Almacenamiento de datos</Title>
          <Paragraph className="content-text">
            Sabemos lo importante que la información es importante para ti y nuestra
            infraestructura es todo lo que puedas imaginar, nuestra base de datos cuenta con una
            seguridad basada en autenticación de usuario, tu decides quien tiene acceso y quien
            no. Todas las operaciones realizadas en nuestra interfaz son acompañadas de un
            usuario rastreable para monitorear movimientos indebidos en tu aplicación.
            </Paragraph>
        </div>
        <img src={ModBus3} alt="" className="section-image" />
      </section>
    </div>
  );
}

export default Servicios;
