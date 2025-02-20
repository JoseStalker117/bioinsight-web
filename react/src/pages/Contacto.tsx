import React, {useState} from "react";
import Swal from "sweetalert2";
import "../css/Pages.css";
import "../css/App.css";
import { Typography } from "antd";
import { triggerFocus } from "antd/es/input/Input";
import { useInView } from "react-intersection-observer";

const { Title, Paragraph } = Typography;

function Contacto() {
  const options = {
    triggerFocus: false,
    threshold: 0.2,
  }

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


  const { ref: contactoRef, inView: contactoInView } = useInView(options);
  const { ref: formularioRef, inView: formularioInView } = useInView(options);

  return (
    <div className="page-content">
      <Title level={1} className="page-title">Contacto</Title>

      <section
        ref={contactoRef}
        className={`card ${contactoInView ? 'slide-in' : 'slide-out'}`}
      >
        <div className="text-content">
          <Title level={2}>Contacto</Title>
          <Paragraph className="content-text">
            No contamos con una oficina o departamento por el momento pero puedes dejarnos
            tus comentarios o propuestas a través del siguiente formulario y nos pondremos en
            contacto con usted en la brevedad.
          </Paragraph>
        </div>
      </section>

      {/* <section>
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
      </section> */}




    </div>
  );
}

export default Contacto;
