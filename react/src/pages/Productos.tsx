import React from "react";
import "../css/Pages.css";
import "../css/Productos.css";
// import Atlas from '../Img/Atlas01_2_11zon.webp';
// import ModBus from '../Img/Modbus04_19_11zon.webp';
// import Turbidez from '../Img/Turbidez07.webp';
import { Typography } from "antd";
import { useInView } from "react-intersection-observer";

const { Title, Paragraph } = Typography;

function Productos() {
  const options = {
    triggerOnce: false,
    threshold: 0.2,
  }

  const { ref: modAtlasRef, inView: modAtlasInView } = useInView(options);
  const { ref: modBusRef, inView: modBusInView } = useInView(options);
  const { ref: TurbidezRef, inView: TurbidezInView } = useInView(options);

  return (
    <div className="page-content">
      <Title level={1} className="page-title">Productos</Title>

      <section
        ref={modAtlasRef}
        className={`card ${modAtlasInView ? 'slide-in' : 'slide-out'}`}
      >
        <div className="text-content">
          <Title level={2}>Modulo Atlas</Title>
          <Paragraph className="content-text">
            El módulo Atlas, desarrollado por Atlas Scientific, es un dispositivo basado en Arduino
            es un kit de Acuaponía para monitoreo de tanques líquidos (albercas, acuarios,
            reactivos) este es de código abierto, esto con finalidad para intercambiar módulos (se
            venden por separado) y medir diferentes tipos de datos, este concepto de Código
            Abierto es un recurso importante ya que a través de este pudimos redireccionar la
            información retenida de los sensores y enviarla a nuestra propia base de datos.
          </Paragraph>
          <Paragraph>
            El fin de estos módulos es medir valores del reactor en el estado líquido.
          </Paragraph>
        </div>
        {/* <img src={Atlas} alt="" className="section-image" /> */}
      </section>

      <section
        ref={modBusRef}
        className={`card ${modBusInView ? 'slide-in' : 'slide-out'} `}
      >
        <div className="text-content">
          <Title level={3}>Modulo Modbus</Title>
          <Paragraph className="content-text">
            Modbus similar al módulo Atlas busca almacenar datos que afectan al crecimiento del
            reactor en su forma de gases. Este prototipo diseñado desde cero es un conjunto de
            sensores de gases de la marca Sectec que son manipulados a través de una interfaz
            RS485, todo esto conectado a un ordenador que gestionará los datos recibidos por los
            sensores, almacenando así sus datos de manera local y en la nube.
          </Paragraph>
        </div>
        {/* <img src={ModBus} alt="" className="section-image" /> */}
      </section>

      <section
        ref={TurbidezRef}
        className={`card ${TurbidezInView ? 'slide-in' : 'slide-out'}`}
      >
        <div className="text-content">
          <Title level={4}>Modulo Turbidez</Title>
          <Paragraph className="content-text">
            El módulo de turbidez a diferencia de los módulos anteriores este opera de manera
            independiente sin necesidad de una conectividad a la red, este en su simplicidad está
            conectado a un único sensor [DFRobot…] que mide la Turbidez del agua e imprime su
            valor en una pantalla simple de LCD 16x2, cada cierto tiempo se almacena esta
            información en una Tarjeta SD (si está colocada) en un formato de CSV para futuras
            consultas. Este módulo tiene la característica de ser altamente portátil y requerir poca
            conectividad para su funcionamiento.
          </Paragraph>
        </div>
        {/* <img src={Turbidez} alt="" className="section-image" /> */}
      </section>
    </div>
  );
}

export default Productos;
