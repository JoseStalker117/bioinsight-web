# API Calls Summary

This document lists all the API calls found in the React codebase and shows how they should be migrated to use the new centralized API configuration.

## Found API Calls

### Admin Files

#### `react/src/admin/Modbus.tsx`
- **Line 62**: `axios.get("http://127.0.0.1:8000/rest/modbusdata", {...})`
- **Migration**: `apiGet(API_ENDPOINTS.MODBUSDATA)`

#### `react/src/admin/Modulo1.tsx`
- **Line 56**: `axios.get("http://127.0.0.1:8000/rest/modulo1", {...})`
- **Migration**: `apiGet(API_ENDPOINTS.MODULO1)`

#### `react/src/admin/Modulo2.tsx`
- **Line 58**: `axios.get("http://127.0.0.1:8000/rest/modulo2", {...})`
- **Migration**: `apiGet(API_ENDPOINTS.MODULO2)`

### App Files

#### `react/src/App/Atlas1.jsx` ✅ (MIGRATED)
- **Line 44**: `axios.get("http://127.0.0.1:8000/rest/modulo1", {...})`
- **Migration**: `apiGet(API_ENDPOINTS.MODULO1)` ✅

#### `react/src/App/Atlas1Edit.jsx`
- **Line 25**: `axios.get("http://127.0.0.1:8000/rest/modulo1", {...})`
- **Migration**: `apiGet(API_ENDPOINTS.MODULO1)`
- **Line 85**: `axios.put("http://127.0.0.1:8000/rest/rtd", updatedData, {...})`
- **Migration**: `apiPut(API_ENDPOINTS.RTD, updatedData)`
- **Line 124**: `axios.post("http://127.0.0.1:8000/rest/rtd", newRecord, {...})`
- **Migration**: `apiPost(API_ENDPOINTS.RTD, newRecord)`
- **Line 167**: `axios.delete("http://127.0.0.1:8000/rest/rtd", {...})`
- **Migration**: `apiDelete(API_ENDPOINTS.RTD)`

#### `react/src/App/Atlas2.jsx`
- **Line 44**: `axios.get("http://127.0.0.1:8000/rest/modulo2", {...})`
- **Migration**: `apiGet(API_ENDPOINTS.MODULO2)`

#### `react/src/App/Atlas2Edit.jsx`
- **Line 25**: `axios.get("http://127.0.0.1:8000/rest/modulo2", {...})`
- **Migration**: `apiGet(API_ENDPOINTS.MODULO2)`
- **Line 84**: `axios.put("http://127.0.0.1:8000/rest/rtd", updatedData, {...})`
- **Migration**: `apiPut(API_ENDPOINTS.RTD, updatedData)`
- **Line 123**: `axios.post("http://127.0.0.1:8000/rest/rtd", newRecord, {...})`
- **Migration**: `apiPost(API_ENDPOINTS.RTD, newRecord)`
- **Line 166**: `axios.delete("http://127.0.0.1:8000/rest/rtd", {...})`
- **Migration**: `apiDelete(API_ENDPOINTS.RTD)`

#### `react/src/App/Buzon.jsx`
- **Line 20**: `fetch('http://127.0.0.1:8000/rest/admin-buzon', {...})`
- **Migration**: `apiFetch(API_ENDPOINTS.ADMIN_BUZON, { method: 'GET' })`
- **Line 53**: `fetch(\`http://127.0.0.1:8000/rest/admin-buzon?contacto_id=\${mensajeId}\`, {...})`
- **Migration**: `apiFetch(\`${API_ENDPOINTS.ADMIN_BUZON}?contacto_id=\${mensajeId}\`, { method: 'GET' })`

#### `react/src/App/EditProfile.jsx`
- **Line 31**: `fetch("http://127.0.0.1:8000/rest/get-linked-services", {...})`
- **Migration**: `apiFetch(API_ENDPOINTS.GET_LINKED_SERVICES, { method: 'GET' })`
- **Line 87**: `fetch("http://127.0.0.1:8000/rest/link-oauth", {...})`
- **Migration**: `apiFetch(API_ENDPOINTS.LINK_OAUTH, { method: 'POST', body: JSON.stringify(data) })`
- **Line 169**: `fetch("http://127.0.0.1:8000/rest/update-profile", {...})`
- **Migration**: `apiFetch(API_ENDPOINTS.UPDATE_PROFILE, { method: 'POST', body: JSON.stringify(data) })`
- **Line 253**: `fetch("http://127.0.0.1:8000/rest/change-password", {...})`
- **Migration**: `apiFetch(API_ENDPOINTS.CHANGE_PASSWORD, { method: 'POST', body: JSON.stringify(data) })`
- **Line 290**: `fetch("http://127.0.0.1:8000/rest/resend-email", {...})`
- **Migration**: `apiFetch(API_ENDPOINTS.RESEND_EMAIL, { method: 'POST', body: JSON.stringify(data) })`

#### `react/src/App/ManageUser.jsx`
- **Line 24**: `axios.get("http://127.0.0.1:8000/rest/admin-usuarios", {...})`
- **Migration**: `apiGet(API_ENDPOINTS.ADMIN_USUARIOS)`
- **Line 74**: `axios.post("http://127.0.0.1:8000/rest/admin-adduser", {...})`
- **Migration**: `apiPost(API_ENDPOINTS.ADMIN_ADDUSER, data)`
- **Line 122**: `axios.delete(\`http://127.0.0.1:8000/rest/admin-restore\`, {...})`
- **Migration**: `apiDelete(API_ENDPOINTS.ADMIN_RESTORE)`
- **Line 154**: `axios.put("http://127.0.0.1:8000/rest/admin-usuarios", {...})`
- **Migration**: `apiPut(API_ENDPOINTS.ADMIN_USUARIOS, data)`

#### `react/src/App/Modbus.jsx`
- **Line 59**: `axios.get("http://127.0.0.1:8000/rest/modbusdata", {...})`
- **Migration**: `apiGet(API_ENDPOINTS.MODBUSDATA)`

#### `react/src/App/ModbusEdit.jsx`
- **Line 25**: `axios.get("http://127.0.0.1:8000/rest/modbusdata", {...})`
- **Migration**: `apiGet(API_ENDPOINTS.MODBUSDATA)`
- **Line 89**: `axios.put("http://127.0.0.1:8000/rest/rtd", updatedData, {...})`
- **Migration**: `apiPut(API_ENDPOINTS.RTD, updatedData)`
- **Line 128**: `axios.post("http://127.0.0.1:8000/rest/rtd", newRecord, {...})`
- **Migration**: `apiPost(API_ENDPOINTS.RTD, newRecord)`
- **Line 171**: `axios.delete("http://127.0.0.1:8000/rest/rtd", {...})`
- **Migration**: `apiDelete(API_ENDPOINTS.RTD)`

#### `react/src/App/NewUser.jsx`
- **Line 39**: `fetch('http://127.0.0.1:8000/rest/admin-adduser', {...})`
- **Migration**: `apiFetch(API_ENDPOINTS.ADMIN_ADDUSER, { method: 'POST', body: JSON.stringify(data) })`

### Component Files

#### `react/src/Components/Header.jsx`
- **Line 85**: `fetch('http://127.0.0.1:8000/rest/login', {...})`
- **Migration**: `apiFetch(API_ENDPOINTS.LOGIN, { method: 'POST', body: JSON.stringify(data) })`
- **Line 129**: `fetch('http://127.0.0.1:8000/rest/get-profile', {...})`
- **Migration**: `apiFetch(API_ENDPOINTS.GET_PROFILE, { method: 'GET' })`
- **Line 158**: `fetch('http://127.0.0.1:8000/rest/register', {...})`
- **Migration**: `apiFetch(API_ENDPOINTS.REGISTER, { method: 'POST', body: JSON.stringify(data) })`

#### `react/src/Components/Nav.jsx`
- **Line 89**: `fetch('http://127.0.0.1:8000/rest/logout', {...})`
- **Migration**: `apiFetch(API_ENDPOINTS.LOGOUT, { method: 'POST' })`

### Utils Files

#### `react/src/utils/Form-Contacto.jsx`
- **Line 10**: `fetch('http://127.0.0.1:8000/rest/form', {...})`
- **Migration**: `apiFetch(API_ENDPOINTS.FORM, { method: 'POST', body: JSON.stringify(data) })`

#### `react/src/utils/Header.tsx`
- **Line 51**: `axios.post('http://localhost:8000/rest/login', values, {...})`
- **Migration**: `apiPost(API_ENDPOINTS.LOGIN, values)`
- **Line 70**: `axios.post('http://localhost:8000/rest/register', values, {...})`
- **Migration**: `apiPost(API_ENDPOINTS.REGISTER, values)`

## Migration Status

- ✅ **Completed**: 1 file (`Atlas1.jsx`)
- ⏳ **Pending**: 15 files

## Next Steps

1. Update each file following the migration guide
2. Test each API call after migration
3. Update the base URL in `apiConfig.js` for different environments as needed

## Benefits After Migration

1. **Single Point of Configuration**: Change base URL in one place
2. **Automatic Authentication**: No need to manually add tokens
3. **Consistent Error Handling**: Standardized error handling across all calls
4. **Better Maintainability**: Easier to update and maintain API calls
5. **Environment Switching**: Easy to switch between development, staging, and production
