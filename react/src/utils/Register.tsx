import React from "react";
import { Modal, Form, Input, Button } from "antd";
import Logo from "../assets/Bioinsight.svg";

const Register: React.FC = () => {
    const onFinish = (values: any) => {
    console.log("Datos de registro enviados:", values);
  };

  return (
    <Modal
      title="Registrarse"
      footer={null}
      width={500}
    >
      <Form layout="vertical" onFinish={onFinish}>
        <div style={{ textAlign: "center", marginBottom: "15px" }}>
          <img
            src={Logo}
            alt="Logo"
            style={{ width: "80px", borderRadius: "50%", border: "2px solid black" }}
          />
        </div>

        <Form.Item label="Nombre de usuario" name="username" rules={[{ required: true, message: "Por favor, ingresa tu nombre de usuario" }]}>
          <Input placeholder="Escribe tu nombre de usuario" />
        </Form.Item>
        <Form.Item label="Apellidos de usuario" name="apellidos" rules={[{ required: true, message: "Por favor, ingresa tus apellidos de usuario" }]}>
          <Input placeholder="Escribe tu nombre de usuario" />
        </Form.Item>
        <Form.Item label="Correo electrónico" name="email" rules={[{ required: true, message: "Por favor, ingresa tu correo" }]}>
          <Input placeholder="Escribe tu correo electrónico" />
        </Form.Item>
        <Form.Item label="Contraseña" name="password" rules={[{ required: true, message: "Por favor, ingresa tu contraseña" }]}>
          <Input.Password placeholder="Escribe tu contraseña" />
        </Form.Item>

        <Button type="primary" htmlType="submit" block>
          Registrarse
        </Button>
      </Form>
    </Modal>
  );
};

export default Register;
