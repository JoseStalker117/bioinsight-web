import React, { useState, useEffect } from "react";
import { Button, Form, Input } from "antd";
import Swal from "sweetalert2";
import '../css/Form-Contacto.css';
import { UserOutlined, MailOutlined } from "@ant-design/icons";
import { apiFetch, API_ENDPOINTS } from "./apiConfig";

const FormContactoComponent = () => {
    const [form] = Form.useForm();

    async function sendContactMessage(nombre, email, mensaje) {
        try {
            const data = await apiFetch(API_ENDPOINTS.FORM, {
                method: 'POST',
                body: JSON.stringify({ nombre, email, mensaje }),
            });

            Swal.fire({
                icon: "success",
                title: "¡Mensaje Enviado!",
                text: `Mensaje enviado. Nos pondremos en contacto pronto: ${nombre}`,
                confirmButtonText: "Aceptar",
            });
            form.resetFields();
            return data;
        } catch (error) {
            console.error(`Error al enviar mensaje de contacto: ${error.message}`);
        }
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