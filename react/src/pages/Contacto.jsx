import React from 'react';
import { Typography } from "antd";
import FormContactoComponent from '../utils/Form-Contacto';
import "./css/Contacto.css"; 

const { Title, Paragraph } = Typography;

function Contacto() {
  return (
    <div className="contact-page">
      <Title className="contact-title">Contacto</Title>

      <section className="intro-section">
        <Paragraph className="intro-text">
          No contamos con una oficina o departamento por el momento, pero puedes dejarnos
          tus comentarios o propuestas a través del siguiente formulario y nos pondremos en
          contacto con usted en la brevedad.
        </Paragraph>
      </section>

        <FormContactoComponent />
    </div>
  );
}

export default Contacto;
