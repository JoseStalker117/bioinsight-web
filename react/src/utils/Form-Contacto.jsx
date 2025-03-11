import React, { useState, useEffect } from "react";
import { Button, Form, Input } from "antd";
import Swal from "sweetalert2";
import '../css/Form-Contacto.css';
import { UserOutlined, MailOutlined } from "@ant-design/icons";

const FormContactoComponent = () => {
    const [form] = Form.useForm();

    async function sendContactMessage(nombre, email, mensaje) {
        const response = await fetch('http://127.0.0.1:8000/rest/form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre, email, mensaje }),
        });

        const data = await response.json(); 

        if (response.ok) {
            Swal.fire({
                icon: "success",
                title: "¡Mensaje Enviado!",
                text: `Mensaje enviado. Nos pondremos en contacto pronto: ${nombre}`,
                confirmButtonText: "Aceptar",
            });
            form.resetFields();
        } else {
            console.error(`Error al enviar mensaje de contacto: ${data.error}`);
        }
        return data;
    }

    return (
        <div className="form-container">
            <Form form={form} className="form-contacto" layout="vertical" onFinish={(values) => sendContactMessage(values.nombre, values.email, values.mensaje)}>
                <h1>Contactanos</h1>
                <Form.Item label="Nombre" name="nombre" rules={[{ required: true, message: "Por favor, ingresa tu nombre" }]}>
                    <Input prefix={<UserOutlined style={{ color: "#333" }} />} placeholder="Escribe tu nombre" />
                </Form.Item>
                <Form.Item label="Correo Electrónico" name="email" rules={[{ required: true, message: "Por favor, ingresa tu correo electrónico" }]}>
                    <Input prefix={<MailOutlined style={{ color: "#333" }} />} placeholder="Escribe tu correo electrónico" />
                </Form.Item>
                <Form.Item label="Mensaje" name="mensaje" rules={[{ required: true, message: "Por favor, ingresa un Mensaje" }]}>
                    <Input.TextArea
                        className="Input-message"
                        placeholder="Escribe tu mensaje"
                    />
                </Form.Item>
                <div className="BtnFormularioContactanos">
                    <Button type="primary" htmlType="submit" block>
                        Enviar
                    </Button>
                </div>
            </Form>
        </div>
    );
};
export default FormContactoComponent;