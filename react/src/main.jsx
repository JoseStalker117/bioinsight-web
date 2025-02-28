import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppRoutes from "./router/Routes";
import './css/index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppRoutes />
  </StrictMode>
)
