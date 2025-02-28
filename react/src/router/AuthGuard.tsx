import React from "react";
import { Navigate } from "react-router-dom";

const AuthGuard = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("authToken"); // Verifica si el usuario tiene token

  return token ? children : <Navigate to="/login-required" replace />;
};

export default AuthGuard;
