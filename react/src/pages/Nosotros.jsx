import React from 'react';
import { Typography } from "antd";
import { InView } from "react-intersection-observer";
import "./css/Nosotros.css";

import Rediacion from '../images/Remediacion02.jpg';
import Agronomia from '../images/UANL-FA01.jpg';
import Reactor from '../images/Reactor01.jpg';



const { Title, Paragraph } = Typography;

function Nosotros() {
  return (
    <div className="page-content">
      <Title className="page-title">Sobre Nosotros</Title>

      {/* Historia */}
      <InView threshold={0.1}>
        {({ inView, ref }) => (
          <section
            ref={ref}
            className={`section ${inView ? "appear" : ""} contenedor-historia`}
            style={{ opacity: inView ? 1 : 0, transition: "opacity 0.5s ease-in-out" }}
          >
            <Title level={3} className="section-title">Historia</Title>
            <div className="text-content">
              <div className="text-container">
                <div className="text-row">
                  <Paragraph className="content-text">
                    La historia de BioInsight inicia cuando en el laboratorio de remediación (Facultad de
                    Agronomía UANL) se les proporciona un dispositivo para monitoreo de acuaponía
                    (modulo atlas). Para los integrantes del laboratorio quienes son agrónomos, este tipo
                    de procedimientos que requiere el dispositivo para su instalación son métodos ajenos
                    a sus actividades recurrentes, por lo cual se busca a un especialista del área de
                    programación.
                  </Paragraph>
                  <Paragraph className="content-text">
                    Se contacta con nosotros por recomendación el laboratorio, alumnos de la
                    Universidad Tecnológica de Santa Catarina (UTSC). Luego de haber instalado
                    satisfactoriamente ambos módulos atlas en el laboratorio, se reconoce a los alumnos
                    y se les ofrece vacante de practicante para estadías dentro del mismo laboratorio,
                    como proyecto se elabora una continuación con el material Atlas creando la primera
                    base de datos de BioInsight y primeros bocetos de interfaz de usuario (UI).
                  </Paragraph>
                </div>
                <div className="text-row">
                  <Paragraph className="content-text">
                    Posteriormente, se solicita un módulo portátil para medir la turbidez de un líquido,
                    este se arma a través de componentes sencillos montados en una placa Arduino nano,
                    que procesa y almacena todos los procedimientos para su operación.
                  </Paragraph>
                  <Paragraph className="content-text">
                    Finalmente, el último proyecto, fueron proporcionados sensores de gases que operan
                    por protocolo de RS485, luego de meses de desarrollo este fue totalmente integrado
                    en un producto resultante que llamamos el Módulo Modbus.
                  </Paragraph>
                </div>
              </div>
            </div>
            <div className='imagenhistoria'>
              <img src={Agronomia} alt="Historia" className="section-image" />
            </div>
          </section>
        )}
      </InView>

      {/* Misión */}
      <InView threshold={0.5}>
        {({ inView, ref }) => (
          <section
            ref={ref}
            className={`section ${inView ? "appear" : ""}`}
            style={{ opacity: inView ? 1 : 0, transition: "opacity 0.5s ease-in-out" }}
          >
            <Title level={3} className="section-title">Misión</Title>
            <div className="text-content">
              <div className="text-container">
                <Paragraph className="content-text">
                  Nuestra misión como empresa es ofrecer el mejor servicio que se adapte a las
                  necesidades de nuestros clientes, siempre aplicando las mejores tecnologías que el mercado ofrece a un costo accesible.
                </Paragraph>
              </div>
              <img src={Rediacion} alt="Misión" className="section-image" />
            </div>
          </section>
        )}
      </InView>

      {/* Visión */}
      <InView threshold={0.5}>
        {({ inView, ref }) => (
          <section
            ref={ref}
            className={`section ${inView ? "appear" : ""}`}
            style={{ opacity: inView ? 1 : 0, transition: "opacity 0.5s ease-in-out" }}
          >
            <Title level={3} className="section-title">Visión</Title>
            <div className="text-content">
              <div className="text-container">
                <Paragraph className="content-text">
                  A corto plazo, en BioInsight buscamos ser una opción viable para nuestros
                  consumidores, ofreciendo un servicio simple y fácil de instalar y operar, a la par que seguimos aplicando nuevas tecnologías que entren al mercado.
                </Paragraph>
              </div>
              <img src={Reactor} alt="Visión" className="section-image" />
            </div>
          </section>
        )}
      </InView>
    </div>
  );
}

export default Nosotros;
