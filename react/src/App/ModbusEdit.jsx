import React, { useState, useEffect } from "react";
import { Table, Button, Input, Space, Modal, Form, InputNumber } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import NavComponent from "../Components/Nav";
import Swal from "sweetalert2";
import axios from "axios";

const ModbusEdit = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form] = Form.useForm();
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);

  const getToken = () => {
    return document.cookie.split("; ").find((row) => row.startsWith("idToken="))?.split("=")[1] || "";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken();
        const response = await axios.get("http://127.0.0.1:8000/rest/modbusdata", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!Array.isArray(response.data)) {
          throw new Error("La respuesta de la API no es un array.");
        }

        const formattedData = response.data.map((item, index) => ({
          key: index.toString(),
          id: item.id,
          timestamp: item.timestamp ? Number(item.timestamp) : 0,
          fecha: item.timestamp ? new Date(Number(item.timestamp)).toLocaleString() : "Sin fecha",
          ...item,
        }));

        // console.log("Datos formateados:", formattedData);
        setDatos(formattedData.sort((a, b) => b.timestamp - a.timestamp));
      } catch (error) {
        Swal.fire("Error", "No se pudieron cargar los datos.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };
  
  const showCreateModal = () => {
    setIsCreating(true);
    setEditingRecord(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = () => {
    if (selectedRowKeys.length === 1) {
      const record = datos.find((item) => item.key === selectedRowKeys[0]);
      setEditingRecord(record);
      form.setFieldsValue(record);
      setIsCreating(false);
      setIsModalVisible(true);
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const token = getToken();

      const filteredData = { ...values };
      delete filteredData.id;
      delete filteredData.fecha;

      const updatedData = {
        module_name: "Modbus",
        doc_data: editingRecord.id,
        data: filteredData,
      };

      const response = await axios.put("http://127.0.0.1:8000/rest/rtd", updatedData, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });

      if (response.status === 200) {
        Swal.fire("Éxito", "Datos actualizados correctamente", "success");
        setIsModalVisible(false);
        setDatos((prevDatos) =>
          prevDatos.map((item) =>
            item.id === editingRecord.id ? { ...item, ...filteredData } : item
          )
        );
      }
    } catch (error) {
      console.error("Error al actualizar los datos:", error);
      Swal.fire("Error", "No se pudieron actualizar los datos.", "error");
    }
  };

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();

      console.log("datos de value:", values)
      const token = getToken();
      if (!token) {
        Swal.fire("Error", "No hay token de autenticación.", "error");
        return;
      }
      const newRecord = {
        module_name: "Modbus",
        doc_data: new Date().getTime().toString(),
        data: values,
      };

      console.log("Enviando datos:", JSON.stringify(newRecord));

      const response = await axios.post("http://127.0.0.1:8000/rest/rtd", newRecord, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        Swal.fire("Éxito", "Registro creado correctamente", "success");
        setIsModalVisible(false);
        setDatos([...datos, { ...values, id: response.data.id, fecha: new Date().toLocaleString() }]);
      }
    } catch (error) {
      console.error("Error al crear registro:", error);
      Swal.fire("Error", "No se pudo crear el registro.", "error");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDelete = () => {
    if (selectedRowKeys.length === 0) return;
    Swal.fire({
      title: "¿Estás seguro?",
      text: `Esta acción eliminará ${selectedRowKeys.length} registro(s).`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = getToken();
          const idsToDelete = selectedRowKeys.map((key) => {
            const record = datos.find((item) => item.key === key);
            return record.id;
          });

          console.log("ids to delete: ", idsToDelete)

          const response = await axios.delete("http://127.0.0.1:8000/rest/rtd", {
            headers: { Authorization: `Bearer ${token}` },
            params: {
              module_name: "Modbus",
              doc_data: idsToDelete,
            },
          });

          if (response.status === 200) {
            Swal.fire("Eliminado", `${selectedRowKeys.length} registro(s) han sido eliminados.`, "success");
            setDatos(datos.filter((item) => !selectedRowKeys.includes(item.key)));
            setSelectedRowKeys([]);
          }
        } catch (error) {
          console.error("Error al eliminar registros:", error);
          Swal.fire("Error", "No se pudieron eliminar los registros.", "error");
        }
      }
    });
  };

  const filteredData = datos.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    {
      title: "Fecha",
      dataIndex: "fecha",
      key: "fecha",
      sorter: (a, b) => a.timestamp - b.timestamp,
      defaultSortOrder: "descend",
    },
    { title: "CO2_IN", dataIndex: "CO2_IN", key: "CO2_IN" },
    { title: "CO2_OUT", dataIndex: "CO2_OUT", key: "CO2_OUT" },
    { title: "NO2_IN", dataIndex: "NO2_IN", key: "NO2_IN" },
    { title: "NO2_OUT", dataIndex: "NO2_OUT", key: "NO2_OUT" },
    { title: "SO2_IN", dataIndex: "SO2_IN", key: "SO2_IN" },
    { title: "SO2_OUT", dataIndex: "SO2_OUT", key: "SO2_OUT" },
    { title: "PAR", dataIndex: "PAR", key: "PAR" },
    { title: "TEMP_1", dataIndex: "TEMP_1", key: "TEMP_1" },
    { title: "TEMP_2", dataIndex: "TEMP_2", key: "TEMP_2" },
  ];

  return (
    <NavComponent>
      <div style={{ padding: "0px 20px" }}>
        <div className="contenedor-primario">
          <h1 style={{ textAlign: "initial" }}>Editor de Modbus</h1>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <Space style={{ marginBottom: 16 }}>
              <Button type="primary" icon={<PlusOutlined />} onClick={showCreateModal}>Crear</Button>
              <Button type="primary" onClick={showEditModal} icon={<EditOutlined />} disabled={selectedRowKeys.length !== 1}>
                Editar
              </Button>
              <Button type="danger" onClick={handleDelete} icon={<DeleteOutlined />} disabled={selectedRowKeys.length === 0}
                style={{ backgroundColor: "red", color: "white" }}
              >
                Eliminar
              </Button>
            </Space>
            <Input
              placeholder="Buscar..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={handleSearch}
              style={{ width: 300 }}
            />
          </div>

          <Table
            rowSelection={{
              selectedRowKeys,
              onChange: setSelectedRowKeys,
            }}
            columns={columns}
            dataSource={filteredData}
            pagination={{ pageSize: 5 }}
          />
        </div>
        {/* Modal de Edición */}
        <Modal
          title={isCreating ? "Crear Registro" : "Editar Registro"}
          visible={isModalVisible}
          onOk={isCreating ? handleCreate : handleSave}
          onCancel={handleCancel}
        >
          <Form form={form} layout="vertical">

            {!isCreating && (
              <Space style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                <Form.Item label="ID (Nodo)" name="id">
                  <Input disabled />
                </Form.Item>
                <Form.Item label="Fecha" name="fecha">
                  <Input disabled />
                </Form.Item>
              </Space>
            )}

            <Space style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
              <Form.Item label="CO2_IN" name="CO2_IN" rules={[{ required: true, message: "Ingrese el CO2_IN" }]}>
                <InputNumber style={{ width: "100%" }} step={0.01} />
              </Form.Item>
              <Form.Item label="CO2_OUT" name="CO2_OUT" rules={[{ required: true, message: "Ingrese el CO2_OUT" }]}>
                <InputNumber style={{ width: "100%" }} step={0.01} />
              </Form.Item>
            </Space>

            <Space style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
              <Form.Item label="NO2_IN" name="NO2_IN" rules={[{ required: true, message: "Ingrese el NO2_IN" }]}>
                <InputNumber style={{ width: "100%" }} step={0.01} />
              </Form.Item>
              <Form.Item label="NO2_OUT" name="NO2_OUT" rules={[{ required: true, message: "Ingrese el NO2_OUT" }]}>
                <InputNumber style={{ width: "100%" }} step={0.01} />
              </Form.Item>
            </Space>

            <Space style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
              <Form.Item label="SO2_IN" name="SO2_IN" rules={[{ required: true, message: "Ingrese el SO2_IN" }]}>
                <InputNumber style={{ width: "100%" }} step={0.01} />
              </Form.Item>
              <Form.Item label="SO2_OUT" name="SO2_OUT" rules={[{ required: true, message: "Ingrese el SO2_OUT" }]}>
                <InputNumber style={{ width: "100%" }} step={0.01} />
              </Form.Item>
            </Space>

            <Form.Item label="PAR" name="PAR" rules={[{ required: true, message: "Ingrese el PAR" }]}>
              <InputNumber style={{ width: "100%" }} step={0.01} />
            </Form.Item>

            <Space style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
              <Form.Item label="TEMP_1" name="TEMP_1" rules={[{ required: true, message: "Ingrese el TEMP_1" }]}>
                <InputNumber style={{ width: "100%" }} step={0.01} />
              </Form.Item>
              <Form.Item label="TEMP_2" name="TEMP_2" rules={[{ required: true, message: "Ingrese el TEMP_2" }]}>
                <InputNumber style={{ width: "100%" }} step={0.01} />
              </Form.Item>
            </Space>
          </Form>
        </Modal>
      </div>
    </NavComponent>
  );
};

export default ModbusEdit;
