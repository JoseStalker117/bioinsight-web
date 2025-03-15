import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App2 from './App2';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App2 /> */}
    <AppRoutes />
  </StrictMode>,
);