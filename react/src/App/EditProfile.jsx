import React, { useState, useEffect } from "react";
import { Button, Input, Space, Row, Col, Card, Typography, Tooltip, Modal, Form } from "antd";
import { UploadOutlined, LockOutlined, MailOutlined, GithubOutlined, GoogleOutlined } from "@ant-design/icons";
import { FaMicrosoft } from "react-icons/fa";
import NavComponent from "../Components/Nav";
import Logo from "../assets/Bioinsight.svg";
import Swal from "sweetalert2";
import { PhoneOutlined } from "@ant-design/icons";

const { Title } = Typography;

const EditProfile = () => {
  const idToken = document.cookie.split("; ").find((row) => row.startsWith("idToken"))?.split("=")[1];
  const userDataRaw = document.cookie.split("; ").find((row) => row.startsWith("userData="))?.split("=")[1];
  const userData = userDataRaw ? JSON.parse(decodeURIComponent(userDataRaw)) : {};
  const [nombre, setNombre] = useState(userData.nombre || "");
  const [apellidos, setApellidos] = useState(userData.apellidos || "");
  const [profilePic, setProfilePic] = useState(null);
  const [isLinked, setIsLinked] = useState({
    sms: false,
    google: false,
    microsoft: false,
    github: false,
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+52"); 
  useEffect(() => {
    const fetchLinkedServices = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/rest/get-linked-services", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          const linkedServices = data.data || {};
          setIsLinked({
            sms: !!linkedServices.phone_number,
            google: !!linkedServices.google,
            microsoft: !!linkedServices.microsoft,
            github: !!linkedServices.github,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: data.error || "Hubo un error al obtener los servicios vinculados.",
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error de conexión",
          text: "Hubo un error de conexión. Intenta nuevamente.",
        });
      }
    };

    fetchLinkedServices();
  }, [idToken]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      Swal.fire({
        icon: "error",
        title: "Número de teléfono inválido",
        text: "Por favor ingresa un número de teléfono válido.",
      });
      return;
    }

    try {
      const token = document.cookie.split("; ").find((row) => row.startsWith("idToken="))?.split("=")[1];
      if (!token) {
        throw new Error("No se encontró el token de autenticación.");
      }

      const response = await fetch("http://127.0.0.1:8000/rest/link-oauth", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone_number: `${countryCode}${phoneNumber}`,  
          provider: 'phone_number',  
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Número vinculado",
          text: "El número ha sido vinculado exitosamente.",
        });

        setIsModalVisible(false);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.error || "Hubo un error al vincular el número.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error de conexión",
        text: "Hubo un error de conexión. Intenta nuevamente.",
      });
    }
  };


  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
  };

  const handleSaveChanges = async () => {
    if (!nombre || !apellidos) {
      Swal.fire({
        icon: 'error',
        title: 'Campos incompletos',
        text: 'El nombre y los apellidos son obligatorios.',
      });
      return;
    }

    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "¿Deseas actualizar los datos de tu perfil?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, actualizar',
      cancelButtonText: 'No, cancelar',
    });

    if (result.isConfirmed) {
      const formData = new FormData();

      formData.append("nombre", nombre);
      formData.append("apellidos", apellidos);

      if (profilePic) {
        formData.append("foto", profilePic);
      }

      try {
        const response = await fetch("http://127.0.0.1:8000/rest/update-profile", {
          method: "PUT",
          body: formData,
          headers: {
            "Authorization": `Bearer ${idToken}`
          },
        });

        const data = await response.json();

        if (data.message === "Perfil actualizado exitosamente") {
          Swal.fire({
            icon: 'success',
            title: 'Perfil actualizado',
            text: 'Tu perfil ha sido actualizado exitosamente.',
          }).then(() => {
            const updatedUserData = { ...userData, nombre: nombre, apellidos: apellidos };
            if (profilePic) {
              updatedUserData.foto = profilePic.name;
            }

            const userDataString = JSON.stringify(updatedUserData);
            document.cookie = `userData=${userDataString}; path=/`;

            setNombre(updatedUserData.nombre);
            setApellidos(updatedUserData.apellidos);
            setProfilePic(null);

            window.location.reload();
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error al actualizar',
            text: 'Hubo un error al actualizar el perfil.',
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error de conexión',
          text: 'Hubo un error de conexión. Intenta nuevamente.',
        });
      }
    }
  };

  const handleLinkService = (service) => {
    setIsLinked((prevState) => {
      const newState = { ...prevState, [service]: !prevState[service] };
      return newState;
    });
  };

  const handleChangePassword = async () => {
    const { value: currentPassword } = await Swal.fire({
      title: 'Contraseña Actual',
      input: 'password',
      inputLabel: 'Introduce tu contraseña actual',
      inputPlaceholder: 'Contraseña actual',
      inputAttributes: {
        'aria-label': 'Contraseña actual'
      },
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
    });

    if (!currentPassword) return; 

    const { value: newPassword } = await Swal.fire({
      title: 'Nueva Contraseña',
      input: 'password',
      inputLabel: 'Introduce tu nueva contraseña',
      inputPlaceholder: 'Nueva contraseña',
      inputAttributes: {
        'aria-label': 'Nueva contraseña'
      },
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
    });

    if (!newPassword) return; 

    try {
      const response = await fetch("http://127.0.0.1:8000/rest/change-password", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });
      const data = await response.json();

      if (data.message === "Contraseña actualizada exitosamente") {
        Swal.fire({
          icon: 'success',
          title: 'Contraseña Actualizada',
          text: 'Tu contraseña ha sido cambiada exitosamente.',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.error || "Hubo un error al cambiar la contraseña.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'Hubo un error de conexión. Intenta nuevamente.',
      });
    }
  };

  const handleResendConfirmation = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/rest/resend-email", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${idToken}`, 
        },
      });

      const data = await response.json();

      if (data.message === "Correo de verificación reenviado exitosamente") {
        Swal.fire({
          icon: 'success',
          title: 'Verificación Reenviada',
          text: 'El correo de verificación ha sido reenviado.',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.error || "Hubo un error al reenviar la confirmación.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'Hubo un error de conexión. Intenta nuevamente.',
      });
    }
  };

  return (
    <NavComponent>
      <div style={{ padding: "20px", maxWidth: "1200px", margin: "auto" }}>
        <Title level={2}>Editar Perfil</Title>

        <Row gutter={24}>
          <Col span={16}>
            <Card style={{ marginBottom: "20px", textAlign: "center" }}>
              <div
                style={{
                  display: "inline-block",
                  position: "relative",
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "4px solid rgb(0, 0, 0)",
                  marginBottom: "10px",
                }}
              >
                <img
                  src={profilePic ? URL.createObjectURL(profilePic) : Logo}
                  alt="Foto de perfil"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <input
                type="file"
                onChange={handleImageChange}
                style={{ display: "none" }}
                id="profilePicInput"
              />
              <label htmlFor="profilePicInput">
                <Tooltip title="Próximamente disponible">
                  <Button icon={<UploadOutlined />} type="primary">Cambiar Foto</Button>
                </Tooltip>
              </label>

              <Row gutter={16} style={{ marginTop: "20px" }}>
                <Col span={12}>
                  <Input placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                </Col>
                <Col span={12}>
                  <Input placeholder="Apellidos" value={apellidos} onChange={(e) => setApellidos(e.target.value)} />
                </Col>
              </Row>
            </Card>

            <Card style={{ marginBottom: "20px" }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Input addonBefore="Rol" value={userData.admin ? "Administrador" : "Usuario"} disabled />
                </Col>
                <Col span={12}>
                  <Input addonBefore="Fecha de Creación" value={userData.creationdate || ""} disabled />
                </Col>
              </Row>
              <Row gutter={16} style={{ marginTop: "10px" }}>
                <Col span={24}>
                  <Input addonBefore="Username" value={userData.username || ""} disabled />
                </Col>
              </Row>
            </Card>
          </Col>

          <Col span={8}>
            <Card style={{ marginBottom: "20px", textAlign: "center" }}>
              <Space direction="vertical" style={{ width: "100%" }}>
                <Button block icon={<LockOutlined />} onClick={handleChangePassword}>
                  Cambiar Contraseña
                </Button>
                <Button block icon={<MailOutlined />} onClick={handleResendConfirmation}>
                  Reenviar Confirmación
                </Button>
                <Button block type="primary" onClick={handleSaveChanges}>Guardar Cambios</Button>
              </Space>
            </Card>

            <Card title="Servicios Enlazados">
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Button
                    type="primary"
                    icon={<PhoneOutlined />}
                    onClick={() => {
                      handleLinkService('sms'); 
                      showModal(); 
                    }}
                    disabled={isLinked.sms}
                    block
                  >
                    {isLinked.sms ? 'Número vinculado' : 'Vincular número de teléfono'}
                  </Button>
                </Col>
                <Col span={24}>
                  <Tooltip title="Próximamente disponible">
                    <Button
                      icon={<GoogleOutlined />}
                      disabled={isLinked.google} 
                      block
                    >
                      {isLinked.google ? 'Google vinculado' : 'Vincular con Google'}
                    </Button>
                  </Tooltip>
                </Col>
                <Col span={24}>
                  <Tooltip title="Próximamente disponible">
                    <Button
                      block
                      icon={<FaMicrosoft />}
                      disabled={isLinked.microsoft}
                    >
                      {isLinked.microsoft ? 'Microsoft vinculado' : 'Vincular con Microsoft'}
                    </Button>
                  </Tooltip>
                </Col>
                <Col span={24}>
                  <Tooltip title="Próximamente disponible">
                    <Button
                      block
                      icon={<GithubOutlined />}
                      disabled={isLinked.github}
                    >
                      {isLinked.github ? 'Github vinculado' : 'Vincular con Github'}
                    </Button>
                  </Tooltip>
                </Col>
              </Row>
            </Card>

          </Col>
        </Row>

        <Modal
          title="Vincula tu número de teléfono"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null} 
        >
          <Form>
            <Row gutter={16}>
              <Col span={6}>
                <Input
                  value={countryCode}
                  disabled
                  style={{ width: "100%" }}
                />
              </Col>
              <Col span={18}>
                <Input
                  placeholder="Ingresa tu número de teléfono"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  style={{ width: "100%" }}
                />
              </Col>
            </Row>
            <div style={{ marginTop: "16px" }}>
              <Button type="primary" onClick={handleOk} style={{ width: "100%" }}>
                Vincular número
              </Button>
            </div>
          </Form>
        </Modal>

      </div>
    </NavComponent>
  );
};

export default EditProfile;
