import React, { useEffect, useState } from "react";
import { Table, Input, Button, Space, Popconfirm, Modal } from "antd";
import {
  SearchOutlined, MailOutlined, DeleteOutlined,
  SortAscendingOutlined, SortDescendingOutlined
} from "@ant-design/icons";
import NavComponent from "../Components/Nav";
import Swal from "sweetalert2";

const Buzon = () => {
  const [mensajes, setMensajes] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

  async function getBuzon() {
    try {
      const idToken = document.cookie.split('; ').find(row => row.startsWith('idToken='))?.split('=')[1];

      const response = await fetch('http://127.0.0.1:8000/rest/admin-buzon', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        },
      });

      const data = await response.json();

      const mensajesArray = Object.entries(data).map(([id, msg]) => ({
        key: id,
        nombre: msg.nombre || "Desconocido",
        email: msg.email || "No disponible",
        fecha: msg.fecha ? new Date(msg.fecha) : null,
        mensaje: msg.mensaje || "Sin mensaje",
      }));

      setMensajes(mensajesArray);
    } catch (error) {
      console.error("Error en la petición:", error);
    }
  }

  // Función para eliminar mensaje
  const handleDelete = async (mensajeId) => {
    const idToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('idToken='))
      ?.split('=')[1];

    try {
      const response = await fetch(`http://127.0.0.1:8000/rest/admin-buzon?contacto_id=${mensajeId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Authorization": `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setMensajes((prevMensajes) => prevMensajes.filter(msg => msg.key !== mensajeId));
        Swal.fire("Eliminado", "El mensaje ha sido eliminado correctamente.", "success");
      } else {
        Swal.fire("Error", data.error || "No se pudo eliminar el mensaje.", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Hubo un problema al intentar eliminar el mensaje.", "error");
    }
  };


  useEffect(() => {
    getBuzon();
  }, []);

  // Filtrar mensajes por nombre o email
  const filteredData = mensajes.filter(
    (item) =>
      item.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
      item.email.toLowerCase().includes(searchText.toLowerCase())
  );

  // Ordenar los datos según la fecha
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortOrder) return 0;
    return sortOrder === "asc"
      ? a.fecha - b.fecha
      : b.fecha - a.fecha;
  });

  // Abrir modal con mensaje
  const handleViewMessage = (record) => {
    setSelectedMessage(record);
    setModalVisible(true);
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedMessage(null);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  // Definir columnas de la tabla
  const columns = [
    { title: "Nombre", dataIndex: "nombre", key: "nombre" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: (
        <Space>
          Fecha<Button type="link" icon={sortOrder === "asc" ? <SortAscendingOutlined /> : <SortDescendingOutlined />} onClick={toggleSortOrder} />
        </Space>
      ),
      dataIndex: "fecha",
      key: "fecha",
      render: (text) => text ? new Date(text).toLocaleString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }) : "No registrada",
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (_, record) => (
        <Space>
          <Button type="primary" icon={<MailOutlined />} onClick={() => handleViewMessage(record)}>
            Ver mensaje
          </Button>
          <Popconfirm title="¿Eliminar mensaje?" onConfirm={() => handleDelete(record.key)} okText="Sí" cancelText="No">
            <Button type="danger" icon={<DeleteOutlined />}>Eliminar</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <NavComponent>
      <div style={{ padding: "0px 20px", marginTop: "-30px" }}>
        <h1>Buzón de Mensajes</h1>

        {/* Buscador */}
        <Input
          placeholder="Buscar por nombre o email..."
          prefix={<SearchOutlined />}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300, marginBottom: 16 }}
        />

        <Table columns={columns} dataSource={sortedData} pagination={{ pageSize: 5, textAlign: 'center' }} />

        {/* Modal de Ver Mensaje */}
        <Modal
          title={selectedMessage ? `Mensaje de ${selectedMessage.nombre}` : ""}
          visible={modalVisible}
          centered
          onCancel={handleCloseModal}
          footer={[
            <Button key="close" type="primary" onClick={handleCloseModal}>
              Cerrar
            </Button>,
          ]}
        >
          {selectedMessage && (
            <div>
              <p><strong>Email:</strong> {selectedMessage.email}</p>
              {/* <p><strong>Fecha:</strong> {selectedMessage.fecha}</p> */}
              <p><strong>Mensaje:</strong></p>
              <p><strong>Fecha:</strong> {new Date(selectedMessage.fecha).toLocaleString('es-MX', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}</p>
              <p style={{ background: "#f5f5f5", padding: 10, borderRadius: 5 }}>{selectedMessage.mensaje}</p>
            </div>
          )}
        </Modal>
      </div>
    </NavComponent>
  );
};

export default Buzon;
