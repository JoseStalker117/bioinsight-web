import React from "react";
import { useNavigate } from "react-router-dom";

const LoginRequired = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Acceso Restringido</h2>
      <p>Debes iniciar sesión para acceder a esta página.</p>
      <button onClick={() => navigate("/")}>Volver al Inicio</button>
    </div>
  );
};

export default LoginRequired;
