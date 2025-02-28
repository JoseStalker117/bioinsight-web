import * as React from "react";
// import "../css/Pages.css";
import { Typography } from "antd";
import { useInView } from 'react-intersection-observer';
import "../css/Nosotros.css";
// import UANL from '../Img/UANL-FA01.webp';
// import UANL2 from '../Img/UANL-FA02.webp';
// import UniNombre from '../Img/UniversidadNombre.jpeg';

const { Title, Paragraph } = Typography;

function Nosotros() {
  const options = {
    triggerOnce: false,
    threshold: 0.2,
  };

  const { ref: historiaRef, inView: historiaInView } = useInView(options);
  const { ref: misionRef, inView: misionInView } = useInView(options);
  const { ref: visionRef, inView: visionInView } = useInView(options);

  return (
    <div className="page-content">
      <Title level={1} className="page-title">Sobre Nosotros</Title>

      {/* Historia */}
      <section
        ref={historiaRef}
        className={`card ${historiaInView ? 'slide-in' : 'slide-out'}`}
      >
        <div className="text-content">
          <Title level={2}>Historia</Title>
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
        {/* <img src={UniNombre} alt="Prueba 1" className="section-image" /> */}
      </section>

      {/* Misión */}
      <section
        ref={misionRef}
        className={`card ${misionInView ? 'slide-in' : 'slide-out'}`}
      >
        <div className="text-content">
          <Title level={3}>Misión</Title>
          <Paragraph className="content-text">
            Nuestra misión como empresa es ofrecer el mejor servicio que se adapte a las
            necesidades de nuestros clientes, siempre aplicando las mejores tecnologías que el mercado ofrece a un costo accesible.
          </Paragraph>
        </div>
        {/* <img src={UANL} alt="Misión" className="section-image" /> */}
      </section>

      {/* Visión */}
      <section
        ref={visionRef}
        className={`card ${visionInView ? 'slide-in' : 'slide-out'}`}
      >
        <div className="text-content">
          <Title level={4}>Visión</Title>
          <Paragraph className="content-text">
            A corto plazo, en BioInsight buscamos ser una opción viable para nuestros
            consumidores, ofreciendo un servicio simple y fácil de instalar y operar, a la par que seguimos aplicando nuevas tecnologías que entren al mercado.
          </Paragraph>
        </div>
        {/* <img src={UANL2} alt="Visión" className="section-image" /> */}
      </section>
    </div>
  );
}

export default Nosotros;
