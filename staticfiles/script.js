//TODO: cambiar a variable global la url del backend

async function login(event) {
    event.preventDefault(); // Evita el envío del formulario por defecto
    const email = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    
    const response = await fetch('http://127.0.0.1:8000/rest/login', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
        // Almacena el token en una cookie
        appendHttpResponse('Login exitoso');
        document.cookie = `idToken=${data.idToken}; path=/`; 
        setTimeout(() => {
            getProfile();
        }, 3000); // Cambia 2000 a la cantidad de milisegundos que desees
    } else {
        appendHttpResponse(`Error en el login: ${data.error}`);
    }
}


async function Querry() {
    const idToken = getCookie('idToken');
    const response = await fetch('http://127.0.0.1:8000/rest/querry', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}` // Envía el token en el encabezado de autorización
        },
        credentials: 'include' // Asegúrate de incluir las credenciales para enviar cookies
    });
    const data = await response.json();
    if (response.ok) {
        document.getElementById('response').textContent = JSON.stringify(data, null, 2); // Muestra el JSON en el placeholder
        appendHttpResponse('Consulta de Modbus exitosa.');
    } else {
        document.getElementById('response').textContent = 'Error al consultar la API Modbus';
        appendHttpResponse(`Error al consultar la API Modbus: ${data.error}`);
    }
}


function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}


async function registerUser(nombre, apellidos, username, password) {
    const response = await fetch('http://127.0.0.1:8000/rest/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, apellidos, username, password }),
    });
    const data = await response.json();
    if (response.ok) {
        appendHttpResponse(`Registro exitoso: Usuario ${username} registrado`);
        setTimeout(() => {
            getProfile();
        }, 3000); 
    } else {
        appendHttpResponse(`Error en el registro: ${data.error}`);
    }
    return data;
}


async function resetPassword(email) {
    const response = await fetch('http://127.0.0.1:8000/rest/reset-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });
    const data = await response.json();
    if (response.ok) {
        appendHttpResponse(`Correo de restablecimiento enviado a: ${email}`);
    } else {
        appendHttpResponse(`Error al restablecer contraseña: ${data.error}`);
    }
    return data;
}


async function getProfile() {
    const response = await fetch('http://127.0.0.1:8000/rest/get-profile', {
        method: 'GET',
        credentials: 'include',
    });
    const data = await response.json();
    if (response.ok) {
        document.getElementById('response').textContent = JSON.stringify(data, null, 2);
        appendHttpResponse('Perfil obtenido exitosamente');
        // Almacena los datos del usuario en una cookie
        document.cookie = `userData=${JSON.stringify(data.user)}; path=/`;
    } else {
        appendHttpResponse(`Error al obtener perfil: ${data.error}`);
    }
    return data;
}


async function updateProfile() {
    const nombre = document.getElementById('updateNombre').value;
    const apellidos = document.getElementById('updateApellidos').value;
    const foto = document.getElementById('updateFoto').value;
    
    const response = await fetch('http://127.0.0.1:8000/rest/update-profile', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, apellidos, foto }),
    });
    const data = await response.json();
    if (response.ok) {
        appendHttpResponse('Perfil actualizado exitosamente');
    } else {
        appendHttpResponse(`Error al actualizar perfil: ${data.error}`);
    }
    return data;
}


async function logout() {
    const response = await fetch('http://127.0.0.1:8000/rest/logout', {
        method: 'POST',
        credentials: 'include',
    });
    const data = await response.json();
    if (response.ok) {
        appendHttpResponse('Sesión cerrada exitosamente');
    } else {
        appendHttpResponse(`Error al cerrar sesión: ${data.error}`);
    }
    return data;
}


async function deleteAccount() {
    const response = await fetch('http://127.0.0.1:8000/rest/delete-account', {
        method: 'POST',
        credentials: 'include',
    });
    const data = await response.json();
    if (response.ok) {
        appendHttpResponse('Cuenta eliminada exitosamente (Auth y Firestore)');
    } else {
        appendHttpResponse(`Error al eliminar cuenta: ${data.error}`);
    }
    return data;
}


async function resendEmail() {
    const response = await fetch('http://127.0.0.1:8000/rest/resend-email', {
        method: 'POST',
        credentials: 'include',
    });
    const data = await response.json();
    if (response.ok) {
        appendHttpResponse('Correo de verificación reenviado exitosamente.');
    } else {
        appendHttpResponse(`Error al reenviar correo: ${data.error}`);
    }
    return data;
}


async function sendContactMessage(nombre, email, mensaje) {
    const response = await fetch('http://127.0.0.1:8000/rest/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, email, mensaje }),
    });
    const data = await response.json();
    if (response.ok) {
        appendHttpResponse(`Mensaje de contacto enviado exitosamente por: ${nombre}`);
    } else {
        appendHttpResponse(`Error al enviar mensaje de contacto: ${data.error}`);
    }
    return data;
}


async function linkOAuth(provider, oauth_token, phone_number) {
    const response = await fetch('http://127.0.0.1:8000/rest/link-oauth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ provider, oauth_token, phone_number }),
    });
    const data = await response.json();
    if (response.ok) {
        appendHttpResponse(`Cuenta de ${provider} vinculada exitosamente`);
    } else {
        appendHttpResponse(`Error al vincular cuenta de ${provider}: ${data.error}`);
    }
    return data;
}


async function unlinkOAuth(provider) {
    const response = await fetch('http://127.0.0.1:8000/rest/unlink-oauth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ provider }),
    });
    const data = await response.json();
    if (response.ok) {
        appendHttpResponse(`Cuenta de ${provider} desvinculada exitosamente`);
    } else {
        appendHttpResponse(`Error al desvincular cuenta de ${provider}: ${data.error}`);
    }
    return data;
}


async function queryRTD(module_name, doc_data) {
    const response = await fetch(`http://127.0.0.1:8000/rest/rtd/${module_name}/${doc_data}`, {
        method: 'GET',
        credentials: 'include',
    });
    const data = await response.json();
    if (response.ok) {
        document.getElementById('response').textContent = JSON.stringify(data, null, 2);
        appendHttpResponse(`Consulta RTD exitosa para módulo: ${module_name}`);
    } else {
        appendHttpResponse(`Error en consulta RTD: ${data.error}`);
    }
    return data;
}


async function saveRTD(module_name, doc_data, data) {
    const response = await fetch(`http://127.0.0.1:8000/rest/rtd/${module_name}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ doc_data, data }),
    });
    const responseData = await response.json();
    if (response.ok) {
        appendHttpResponse(`Datos guardados exitosamente en módulo: ${module_name}`);
    } else {
        appendHttpResponse(`Error al guardar datos en RTD: ${responseData.error}`);
    }
    return responseData;
}


async function updateRTD(module_name, doc_data, data) {
    const response = await fetch(`http://127.0.0.1:8000/rest/rtd/${module_name}/${doc_data}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data }),
    });
    const responseData = await response.json();
    if (response.ok) {
        appendHttpResponse(`Datos actualizados exitosamente en módulo: ${module_name}`);
    } else {
        appendHttpResponse(`Error al actualizar datos en RTD: ${responseData.error}`);
    }
    return responseData;
}


async function deleteRTD(module_name, doc_data) {
    const response = await fetch(`http://127.0.0.1:8000/rest/rtd/${module_name}/${doc_data}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    const data = await response.json();
    if (response.ok) {
        appendHttpResponse(`Datos eliminados exitosamente del módulo: ${module_name}`);
    } else {
        appendHttpResponse(`Error al eliminar datos de RTD: ${data.error}`);
    }
    return data;
}


async function DatabaseRTD() {
    const table = document.getElementById('tableSelector').value;
    const httpMethod = document.getElementById('httpMethodSelector').value;
    const jsonData = document.getElementById('jsonInput').value;

    switch (httpMethod) {
        case 'GET':
            return await queryRTD(table, jsonData); // Asumiendo que jsonData contiene el doc_data
        case 'POST':
            return await saveRTD(table, null, jsonData); // Aquí null se puede reemplazar si necesitas un doc_data específico
        case 'PUT':
            return await updateRTD(table, null, jsonData); // Aquí null se puede reemplazar si necesitas un doc_data específico
        case 'DELETE':
            return await deleteRTD(table, jsonData); // Asumiendo que jsonData contiene el doc_data
        default:
            appendHttpResponse('Método HTTP no válido.');
            return;
    }
}


function appendHttpResponse(message) {
    const httpResponsesDiv = document.getElementById('httpResponses');
    
    // Crear el contenedor de la respuesta
    const responseBox = document.createElement('div');
    responseBox.className = 'response-box response-container-box ' + (message.includes('Error') ? 'error' : 'success');
    
    // Añadir timestamp
    const timestamp = document.createElement('div');
    timestamp.className = 'timestamp timestamp-box';
    timestamp.textContent = new Date().toLocaleTimeString();
    
    // Añadir mensaje
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message message-box';
    messageDiv.textContent = message;
    
    // Construir la caja de respuesta
    responseBox.appendChild(timestamp);
    responseBox.appendChild(messageDiv);
    
    // Añadir al contenedor principal
    httpResponsesDiv.prepend(responseBox);
    
    const maxResponses = 10;
    while (httpResponsesDiv.children.length > maxResponses) {
        httpResponsesDiv.removeChild(httpResponsesDiv.lastChild);
    }
}