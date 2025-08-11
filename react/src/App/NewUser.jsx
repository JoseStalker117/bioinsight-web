import React, { useState } from "react";
import { Form, Input, Button, Select } from "antd";
import NavComponent from "../Components/Nav";
import { ClearOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import { apiFetch, API_ENDPOINTS } from "../utils/apiConfig";

const { Option } = Select;

const NewUser = () => {
  const [formData, setFormData] = useState({
    username: "",
    nombre: "",
    apellidos: "",
    admin: false, 
  });
  const [form] = Form.useForm();
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.username || !formData.nombre || !formData.apellidos) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Todos los campos son requeridos',
      });
      return;
    }

    try {
      const data = await apiFetch(API_ENDPOINTS.ADMIN_ADDUSER, {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      Swal.fire({
        icon: 'success',
        title: 'Exito',
        text: `Usuario creado exitosamente. La contraseña es: ${data.password}`,
      });
      setFormData({
        username: "",
        nombre: "",
        apellidos: "",
        admin: false,
      });
      form.resetFields();
      setErrorMessage("");
    } catch (error) {
      if (error.message && error.message.includes('EMAIL_EXISTS')) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'El Usuario ya está registrado. Intenta con otro.',
          confirmButtonText: 'Aceptar',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Ocurrió un error al registrar al usuario.',
          confirmButtonText: 'Aceptar',
        });
      }
    }
  };

  const handleReset = async () => {
    const Limpiar = await Swal.fire({
      title: '¿Estás seguro?',
      text: "¡Esto borrará todos los datos del formulario!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, limpiar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    });
    if (Limpiar.isConfirmed) {
      setFormData({
        username: "",
        nombre: "",
        apellidos: "",
        admin: false,
      });
      form.resetFields();
      setErrorMessage("");
    }
  };

  return (
    <NavComponent>
      <div style={{ padding: "50px" }}>
        <div className="contenedor-primario">

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", }}>
            <h2 style={{ margin: 0 }}>Crear Nuevo Usuario</h2>
            <Button onClick={handleReset} style={{ backgroundColor: "red", borderStyle: "none", color: "white", fontWeight: "bold", padding: "8px 16px", }}>
              <ClearOutlined /> Limpiar
            </Button>
          </div>

          <Form
            form={form}
            name="new-user"
            onFinish={handleSubmit}
            layout="vertical"
          >
            <Form.Item
              label="Nombre de usuario"
              name="username"
              rules={[{ required: true, message: "Por favor ingresa el Nombre de usuario" }]}
            >
              <Input
                value={formData.username}
                onChange={handleChange}
                name="username"
                placeholder="Ingresa el nombre de Nombre de usuario"
              />
            </Form.Item>

            <Form.Item
              label="Nombre"
              name="nombre"
              rules={[{ required: true, message: "Por favor ingresa el nombre" }]}
            >
              <Input
                value={formData.nombre}
                onChange={handleChange}
                name="nombre"
                placeholder="Ingresa el nombre"
              />
            </Form.Item>

            <Form.Item
              label="Apellidos"
              name="apellidos"
              rules={[{ required: true, message: "Por favor ingresa los apellidos" }]}
            >
              <Input
                value={formData.apellidos}
                onChange={handleChange}
                name="apellidos"
                placeholder="Ingresa los apellidos"
              />
            </Form.Item>

            <Form.Item
              label="Rol de Administrador"
              name="admin"
            >
              <Select
                value={formData.admin}
                onChange={(value) => setFormData({ ...formData, admin: value })}
                placeholder="Seleccionar rol"
              >
                <Option value={true}>Administrador</Option>
                <Option value={false}>Usuario</Option>
              </Select>
            </Form.Item>

            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

            <Form.Item style={{
              margin: "20px",
              padding: "10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}>
              <Button type="primary" htmlType="submit" style={{ width: "auto" }}>
                Crear Usuario
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </NavComponent>
  );
};

export default NewUser;