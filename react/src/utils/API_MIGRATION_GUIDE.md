# API Migration Guide

This guide explains how to migrate existing API calls to use the new centralized API configuration.

## Overview

All API calls have been centralized in `apiConfig.js` to make it easier to:
- Change the base URL for different environments
- Maintain consistent error handling
- Add authentication automatically
- Standardize API calls across the application

## Migration Steps

### 1. Import the API utilities

Replace direct axios/fetch imports with the new API utilities:

```javascript
// OLD
import axios from 'axios';

// NEW
import { apiGet, apiPost, apiPut, apiDelete, apiFetch, API_ENDPOINTS } from '../utils/apiConfig';
```

### 2. Replace API calls

#### For Axios calls:

```javascript
// OLD
axios.get("http://127.0.0.1:8000/rest/modulo1", {
  headers: {
    Authorization: `Bearer ${token}`,
  }
})

// NEW
apiGet(API_ENDPOINTS.MODULO1)
```

#### For Fetch calls:

```javascript
// OLD
const response = await fetch('http://127.0.0.1:8000/rest/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ email, password }),
});

// NEW
const response = await apiPost(API_ENDPOINTS.LOGIN, { email, password });
```

### 3. Error Handling

The new API utilities include automatic error handling, but you can still catch errors:

```javascript
try {
  const data = await apiGet(API_ENDPOINTS.MODULO1);
  // Handle success
} catch (error) {
  console.error("Error:", error.message);
  // Handle error
}
```

## Available Endpoints

All endpoints are defined in `API_ENDPOINTS`:

- `API_ENDPOINTS.LOGIN` - `/login`
- `API_ENDPOINTS.REGISTER` - `/register`
- `API_ENDPOINTS.LOGOUT` - `/logout`
- `API_ENDPOINTS.GET_PROFILE` - `/get-profile`
- `API_ENDPOINTS.UPDATE_PROFILE` - `/update-profile`
- `API_ENDPOINTS.CHANGE_PASSWORD` - `/change-password`
- `API_ENDPOINTS.RESEND_EMAIL` - `/resend-email`
- `API_ENDPOINTS.GET_LINKED_SERVICES` - `/get-linked-services`
- `API_ENDPOINTS.LINK_OAUTH` - `/link-oauth`
- `API_ENDPOINTS.MODULO1` - `/modulo1`
- `API_ENDPOINTS.MODULO2` - `/modulo2`
- `API_ENDPOINTS.MODBUSDATA` - `/modbusdata`
- `API_ENDPOINTS.RTD` - `/rtd`
- `API_ENDPOINTS.ADMIN_BUZON` - `/admin-buzon`
- `API_ENDPOINTS.ADMIN_USUARIOS` - `/admin-usuarios`
- `API_ENDPOINTS.ADMIN_ADDUSER` - `/admin-adduser`
- `API_ENDPOINTS.ADMIN_RESTORE` - `/admin-restore`
- `API_ENDPOINTS.FORM` - `/form`

## Changing Base URL

To change the API base URL for different environments:

```javascript
import { setBaseUrl } from '../utils/apiConfig';

// For production
setBaseUrl('https://your-production-domain.com/rest');

// For staging
setBaseUrl('https://your-staging-domain.com/rest');

// For local development
setBaseUrl('http://127.0.0.1:8000/rest');
```

## Files to Update

The following files need to be updated to use the new API configuration:

### Admin Files:
- `react/src/admin/Modbus.tsx`
- `react/src/admin/Modulo1.tsx`
- `react/src/admin/Modulo2.tsx`

### App Files:
- `react/src/App/Atlas1.jsx`
- `react/src/App/Atlas1Edit.jsx`
- `react/src/App/Atlas2.jsx`
- `react/src/App/Atlas2Edit.jsx`
- `react/src/App/Buzon.jsx`
- `react/src/App/EditProfile.jsx`
- `react/src/App/ManageUser.jsx`
- `react/src/App/Modbus.jsx`
- `react/src/App/ModbusEdit.jsx`
- `react/src/App/NewUser.jsx`

### Component Files:
- `react/src/Components/Header.jsx`
- `react/src/Components/Nav.jsx`

### Utils Files:
- `react/src/utils/Form-Contacto.jsx`
- `react/src/utils/Header.tsx`

## Benefits

1. **Centralized Configuration**: All API settings in one place
2. **Easy Environment Switching**: Change base URL for different environments
3. **Automatic Authentication**: Token handling is automatic
4. **Consistent Error Handling**: Standardized error handling across all API calls
5. **Type Safety**: Better IDE support with endpoint constants
6. **Maintainability**: Easier to maintain and update API calls
