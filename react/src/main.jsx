import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppRoutes from "./router/Routes";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppRoutes />
  </StrictMode>
)
