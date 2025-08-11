# Sistema de Autenticación - Bioinsight Web

## Descripción General

El sistema de autenticación de Bioinsight Web utiliza un enfoque híbrido basado en cookies con fallback a headers de autorización. Esto proporciona seguridad y flexibilidad para diferentes escenarios de uso.

## Arquitectura

### Frontend (React)
- **Configuración**: `react/src/utils/apiConfig.js`
- **Cliente HTTP**: Axios con `withCredentials: true`
- **Almacenamiento**: Cookies del navegador
- **Fallback**: Headers Authorization cuando las cookies no están disponibles

### Backend (Django)
- **Configuración**: `rest/views.py`
- **Función Helper**: `get_auth_token(request)` - obtiene token de cookies o headers
- **Validación**: Firebase Admin SDK
- **Gestión de Sesiones**: Cookies con expiración de 1 hora

## Flujo de Autenticación

### 1. Login
```javascript
// Frontend envía credenciales
const response = await apiPost('/login', { email, password });

// Backend valida con Firebase y establece cookie
response.set_cookie(
    key='idToken',
    value=id_token,
    httponly=False,
    secure=False,
    samesite='Lax',
    max_age=3600  // 1 hora
);
```

### 2. Peticiones Autenticadas
```javascript
// Frontend - Axios automáticamente envía cookies
const data = await apiGet('/get-profile');

// Backend - Función helper obtiene token
id_token = get_auth_token(request)  // Cookies primero, headers como fallback
```

### 3. Logout
```javascript
// Frontend
await apiGet('/logout');

// Backend elimina cookies
response.delete_cookie('idToken');
response.delete_cookie('userData');
```

## Configuración de Cookies

### Parámetros
- **httponly**: `False` - Permite acceso desde JavaScript
- **secure**: `False` - Funciona en HTTP (cambiar a `True` en producción)
- **samesite**: `'Lax'` - Protección CSRF moderada
- **max_age**: `3600` - Expiración de 1 hora
- **path**: `'/'` - Disponible en todo el sitio

### Seguridad
- Las cookies se envían automáticamente con cada petición
- El backend valida el token con Firebase en cada operación
- Fallback a headers Authorization para casos especiales

## Funciones de Utilidad

### Frontend
```javascript
import { 
    isAuthenticated, 
    getUserData, 
    getCookie, 
    setCookie, 
    deleteCookie 
} from './apiConfig';

// Verificar autenticación
if (isAuthenticated()) {
    // Usuario está logueado
}

// Obtener datos del usuario
const userData = getUserData();

// Manejar cookies manualmente
setCookie('customCookie', 'value', { maxAge: 7200 });
const value = getCookie('customCookie');
deleteCookie('customCookie');
```

### Backend
```python
# Obtener token de autenticación
id_token = get_auth_token(request)
if not id_token:
    return Response({'error': 'Token requerido'}, status=400)

# Verificar token con Firebase
decoded_token = firebase_admin.auth.verify_id_token(id_token)
user_id = decoded_token['uid']
```

## Ventajas del Sistema

1. **Simplicidad**: Las cookies se envían automáticamente
2. **Seguridad**: Validación en cada petición
3. **Flexibilidad**: Fallback a headers cuando sea necesario
4. **Compatibilidad**: Funciona con diferentes navegadores
5. **Mantenibilidad**: Código centralizado y reutilizable

## Consideraciones de Producción

1. **HTTPS**: Cambiar `secure=True` en cookies
2. **Dominio**: Configurar dominio específico para cookies
3. **CORS**: Configurar `credentials: 'include'` en frontend
4. **Firewall**: Asegurar que las cookies no sean bloqueadas
5. **Monitoreo**: Logs de autenticación y errores

## Troubleshooting

### Problemas Comunes
1. **Cookies no se envían**: Verificar `withCredentials: true`
2. **CORS errors**: Configurar backend para aceptar credenciales
3. **Token expirado**: Implementar refresh automático
4. **Cookies bloqueadas**: Verificar configuración del navegador

### Debug
```javascript
// Frontend - Verificar cookies
console.log('Cookies:', document.cookie);
console.log('Auth token:', getCookie('idToken'));

// Backend - Log de autenticación
print(f"Token recibido: {id_token[:20]}...")
```
