import React from "react";
import { Typography } from "antd";
import { InView } from "react-intersection-observer";
import "./css/Productos.css";

import Atlas3 from '../images/Atlas03.jpg';
import Modbus3 from '../images/Modbus03.jpg';
import Turbidez1 from '../images/Turbidez01.jpg'; 

const { Title, Paragraph } = Typography;

function Productos() {
  return (
    <div className="page-content">
      <Title className="page-title">Productos</Title>

      <InView threshold={0.5}>
        {({ inView, ref }) => (
          <section ref={ref} className={`section ${inView ? "appear" : ""}`}>
            <Title level={3} className="section-title">Modulo Atlas</Title>
            <div className="text-content">
              <Paragraph className="content-text">
                El módulo Atlas, desarrollado por Atlas Scientific, es un dispositivo basado en Arduino
                es un kit de Acuaponía para monitoreo de tanques líquidos (albercas, acuarios,
                reactivos) este es de código abierto, esto con finalidad para intercambiar módulos (se
                venden por separado) y medir diferentes tipos de datos, este concepto de Código
                Abierto es un recurso importante ya que a través de este pudimos redireccionar la
                información retenida de los sensores y enviarla a nuestra propia base de datos.
              </Paragraph>
              <img src={Atlas3} alt="Modulo Atlas" className="section-image" />
            </div>
          </section>
        )}
      </InView>

      <InView threshold={0.5}>
        {({ inView, ref }) => (
          <section ref={ref} className={`section ${inView ? "appear" : ""}`}>
            <Title level={3} className="section-title">Modulo Modbus</Title>
            <div className="text-content">
              <Paragraph className="content-text">
                Modbus similar al módulo Atlas busca almacenar datos que afectan al crecimiento del
                reactor en su forma de gases. Este prototipo diseñado desde cero es un conjunto de
                sensores de gases de la marca Sectec que son manipulados a través de una interfaz
                RS485, todo esto conectado a un ordenador que gestionará los datos recibidos por los
                sensores, almacenando así sus datos de manera local y en la nube.
              </Paragraph>
              <img src={Modbus3} alt="Modulo Modbus" className="section-image" />
            </div>
          </section>
        )}
      </InView>

      <InView threshold={0.5}>
        {({ inView, ref }) => (
          <section ref={ref} className={`section ${inView ? "appear" : ""}`}>
            <Title level={3} className="section-title">Modulo Turbidez</Title>

            <div className="text-content">
              <Paragraph className="content-text">
                El módulo de turbidez a diferencia de los módulos anteriores este opera de manera
                independiente sin necesidad de una conectividad a la red, este en su simplicidad está
                conectado a un único sensor [DFRobot…] que mide la Turbidez del agua e imprime su
                valor en una pantalla simple de LCD 16x2, cada cierto tiempo se almacena esta
                información en una Tarjeta SD (si está colocada) en un formato de CSV para futuras
                consultas. Este módulo tiene la característica de ser altamente portátil y requerir poca
                conectividad para su funcionamiento.
              </Paragraph>
              <img src={Turbidez1} alt="Modulo Turbidez" className="section-image" />
            </div>
          </section>
        )}
      </InView>
    </div>
  );
}

export default Productos;
