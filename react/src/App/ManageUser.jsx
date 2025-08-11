import React, { useState, useEffect } from "react";
import { Table, Button, Input, Space, Modal, Form, Select } from "antd";
import { SearchOutlined, DeleteOutlined, RetweetOutlined } from "@ant-design/icons";
import NavComponent from "../Components/Nav";
import { apiGet, apiPost, apiPut, apiDelete, API_ENDPOINTS } from "../utils/apiConfig";
import Swal from "sweetalert2";

const { Option } = Select;

const ManageUser = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await apiGet(API_ENDPOINTS.ADMIN_USUARIOS);

        console.log("respuesta de la api", response);
        if (Array.isArray(response)) {
          setUsuarios(response);
        } else {
          throw new Error("La respuesta no es un array");
        }
        console.log("Respuesta de la API:", response);
      } catch (error) {
        Swal.fire("Error", "No se pudieron cargar los usuarios.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleRestablecerContraseña = async (userId) => {
    try {
      if (!userId) {
        Swal.fire("Error", "No se seleccionó un usuario.", "error");
        return;
      }

      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "¿Deseas restablecer la contraseña de este usuario?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, restablecer",
        cancelButtonText: "Cancelar"
      });

      if (!result.isConfirmed) {
        return;  
      }

      const response = await apiPost(API_ENDPOINTS.ADMIN_RESTORE, { uid: userId });

      if (response && response.new_password) {
        Swal.fire({
          title: "Éxito",
          html: `Contraseña restablecida exitosamente.<br>La nueva contraseña es: <strong>${response.new_password}</strong>`,
          icon: "success",
        });
      } else {
        Swal.fire("Error", "No se pudo restablecer la contraseña.", "error");
      }
    } catch (error) {
      console.log("Server responded with:", error);
      Swal.fire("Error", error.message || "No se pudo restablecer la contraseña.", "error");
    }
  };


  const handleEliminarUsuario = (id) => {
    const usuario = usuarios.find(user => user.id === id); 
    Swal.fire({
      title: "¿Estás seguro?",
      text: `Esta acción eliminará permanentemente al usuario ${usuario.username}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await apiDelete(API_ENDPOINTS.ADMIN_RESTORE, {
            params: { uid: id },
          });

          setUsuarios(usuarios.filter((user) => user.id !== id));
          Swal.fire("Eliminado", "El usuario ha sido eliminado.", "success");
        } catch (error) {
          Swal.fire("Error", "No se pudo eliminar el usuario.", "error");
        }
      }
    });
  };


  const handleChangeRole = async (id, newRole) => {
    const usuario = usuarios.find(user => user.id === id); 
    Swal.fire({
      title: "¿Estás seguro?",
      text: `¿Deseas cambiar el rol del ${usuario.username} a ${newRole}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, cambiar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await apiPut(API_ENDPOINTS.ADMIN_USUARIOS, {
            user_id: id,
            admin: newRole === "Administrador",
          });
          
          setUsuarios(usuarios.map(user => user.id === id ? { ...user, admin: newRole === "Administrador" } : user));
          Swal.fire("Éxito", "Rol actualizado correctamente.", "success");
        } catch (error) {
          Swal.fire("Error", "No se pudo actualizar el rol.", "error");
        }
      }
    });
  };

  const filteredUsuarios = usuarios.filter((usuario) =>
    usuario.username.toLowerCase().includes(searchText.toLowerCase()) ||
    usuario.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    { title: "Usuarios", dataIndex: "username", key: "username" },
    { title: "Correo", dataIndex: "email", key: "email" },
    {
      title: "Rol",
      dataIndex: "admin",
      key: "admin",
      render: (admin, record) => (
        <Select
          value={admin ? "Administrador" : "Usuario"}
          onChange={(newRole) => handleChangeRole(record.id, newRole)}
          style={{ width: 150 }}
        >
          <Option value="Administrador">Administrador</Option>
          <Option value="Usuario">Usuario</Option>
        </Select>
      ),
    },
    {
      title: "Acciones",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Button
            icon={<RetweetOutlined />}
            onClick={() => handleRestablecerContraseña(record.id)}  
          >
            Restablecer Contraseña
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleEliminarUsuario(record.id)}
            danger
          >
            Eliminar
          </Button>
        </Space>
      ),
    }
  ];

  return (
    <NavComponent>
      <div style={{ padding: '20px' }}>
        <div className="contenedor-primario">
          <h1>Gestionar Usuarios</h1>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
            <Space>
              <Input
                placeholder="Buscar usuario..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={handleSearch}
                style={{ width: 300 }}
              />
            </Space>
          </div>

          <Table
            columns={columns}
            dataSource={filteredUsuarios}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 5 }}
          />
        </div>
      </div>
    </NavComponent>
  );
};

export default ManageUser;
