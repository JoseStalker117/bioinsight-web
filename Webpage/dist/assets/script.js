async function login(event) {
    event.preventDefault(); // Evita el envío del formulario por defecto
    const email = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    //TODO: cambiar a variable global
    const response = await fetch('http://127.0.0.1:8000/rest/login', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
        const data = await response.json();
        document.cookie = `idToken=${data.idToken}; path=/`; // Almacena el token en una cookie
        alert('Login exitoso');
    } else {
        alert('Error en el login');
    }
}

async function fetchModbusData() {
    const idToken = getCookie('idToken'); // Obtiene el token de la cookie
    const response = await fetch('http://127.0.0.1:8000/rest/querry', { // Reemplaza con la URL de tu API Modbus
        method: 'GET', // Cambiado a GET
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}` // Envía el token en el encabezado de autorización
        },
        credentials: 'include' // Asegúrate de incluir las credenciales para enviar cookies
    });
    if (response.ok) {
        const data = await response.json();
        document.getElementById('response').textContent = JSON.stringify(data, null, 2); // Muestra el JSON en el placeholder
    } else {
        document.getElementById('response').textContent = 'Error al consultar la API Modbus';
    }
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Nueva función para registrar un usuario
async function registerUser(nombre, apellidos, username, password) {
    const response = await fetch('http://127.0.0.1:8000/rest/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, apellidos, username, password }),
    });
    return response.json();
}

// Nueva función para restablecer la contraseña
async function resetPassword(email) {
    const response = await fetch('http://127.0.0.1:8000/rest/reset-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });
    return response.json();
}

// Nueva función para obtener el perfil del usuario
async function getProfile() {
    const response = await fetch('http://127.0.0.1:8000/rest/get-profile', {
        method: 'GET',
        credentials: 'include',
    });
    return response.json();
}

// Nueva función para actualizar el perfil del usuario
async function updateProfile(nombre, apellidos, foto) {
    const response = await fetch('http://127.0.0.1:8000/rest/update-profile', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, apellidos, foto }),
    });
    return response.json();
}

// Nueva función para cerrar sesión
async function logout() {
    const response = await fetch('http://127.0.0.1:8000/rest/logout', {
        method: 'POST',
        credentials: 'include',
    });
    return response.json();
}

// Nueva función para eliminar la cuenta
async function deleteAccount() {
    const response = await fetch('http://127.0.0.1:8000/rest/delete-account', {
        method: 'POST',
        credentials: 'include',
    });
    return response.json();
}

// Nueva función para enviar un mensaje de contacto
async function sendContactMessage(nombre, email, mensaje) {
    const response = await fetch('http://127.0.0.1:8000/rest/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, email, mensaje }),
    });
    return response.json();
}

// Nueva función para vincular cuentas de OAuth
async function linkOAuth(provider, oauth_token, phone_number) {
    const response = await fetch('http://127.0.0.1:8000/rest/link-oauth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ provider, oauth_token, phone_number }),
    });
    return response.json();
}

// Nueva función para desvincular cuentas de OAuth
async function unlinkOAuth(provider) {
    const response = await fetch('http://127.0.0.1:8000/rest/unlink-oauth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ provider }),
    });
    return response.json();
}

// Nueva función para consultar datos en tiempo real
async function queryRTD(module_name, doc_data) {
    const response = await fetch(`http://127.0.0.1:8000/rest/rtd/${module_name}/${doc_data}`, {
        method: 'GET',
        credentials: 'include',
    });
    return response.json();
}

// Nueva función para guardar datos en tiempo real
async function saveRTD(module_name, doc_data, data) {
    const response = await fetch(`http://127.0.0.1:8000/rest/rtd/${module_name}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ doc_data, data }),
    });
    return response.json();
}

// Nueva función para actualizar datos en tiempo real
async function updateRTD(module_name, doc_data, data) {
    const response = await fetch(`http://127.0.0.1:8000/rest/rtd/${module_name}/${doc_data}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data }),
    });
    return response.json();
}

// Nueva función para eliminar datos en tiempo real
async function deleteRTD(module_name, doc_data) {
    const response = await fetch(`http://127.0.0.1:8000/rest/rtd/${module_name}/${doc_data}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    return response.json();
}