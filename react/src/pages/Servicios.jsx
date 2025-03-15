import React from "react";
import { Typography } from "antd";
import { InView } from "react-intersection-observer";
import "./css/Productos.css";

import Sensores1 from '../images/Sensores01.jpg'; 
import Electrodos from '../images/Electrodos.jpg';
import Modbus04 from '../images/Modbus04.jpg';

const { Title, Paragraph } = Typography;

function Servicios() {
  return (
    <div className="page-content">
      <Title className="page-title">Servicios</Title>

      <InView threshold={0.5}>
        {({ inView, ref }) => (
          <section ref={ref} className={`section ${inView ? "appear" : ""}`}>
            <Title level={3} className="section-title">Soporte Tecnico</Title>
            <div className="text-content">
              <Paragraph className="content-text">
                Bioinsight ofrece servicio de soporte técnico para capacitación de usuarios finales
                para los diferentes productos proporcionados para el laboratorio, desde la instalación
                y calibración de equipos, uso diario y acceso a la información para análisis de datos.
              </Paragraph>
              <img src={Electrodos} alt="Soporte Tecnico" className="section-image" />
            </div>
          </section>
        )}
      </InView>

      <InView threshold={0.5}>
        {({ inView, ref }) => (
          <section ref={ref} className={`section ${inView ? "appear" : ""}`}>
            <Title level={3} className="section-title">Coordinación de Productos</Title>
            <div className="text-content">
              <Paragraph className="content-text">
                En Bioinsight nos comprometemos con nuestro cliente para ofrecerle la mejor
                atención y asesoramiento, ¿buscas hostear tu servidor? Nosotros te apoyamos,
                ¿quieres un dispositivo que realice tareas en específico? Lo construimos, ¿Requieres
                automatizar un proceso? Nosotros te resolvemos.
              </Paragraph>
              <img src={Sensores1} alt="Coordinación de Productos" className="section-image" />
            </div>
          </section>
        )}
      </InView>

      <InView threshold={0.5}>
        {({ inView, ref }) => (
          <section ref={ref} className={`section ${inView ? "appear" : ""}`}>
            <Title level={3} className="section-title">Almacenamiento de Datos</Title>
            <div className="text-content">
              <Paragraph className="content-text">
                Sabemos lo importante que la información es para ti y nuestra
                infraestructura es todo lo que puedas imaginar, nuestra base de datos cuenta con una
                seguridad basada en autenticación de usuario, tú decides quién tiene acceso y quién
                no. Todas las operaciones realizadas en nuestra interfaz son acompañadas de un
                usuario rastreable para monitorear movimientos indebidos en tu aplicación.
              </Paragraph>
              <img src={Modbus04} alt="Almacenamiento de Datos" className="section-image" />
            </div>
          </section>
        )}
      </InView>
    </div>
  );
}

export default Servicios;
