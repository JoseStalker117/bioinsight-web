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
        }, 1500); // Cambia 2000 a la cantidad de milisegundos que desees
        // Limpiar los campos del formulario
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
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
        appendHttpResponse('Consulta de Database RTD exitosa.');
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
        }, 1500); 
        // Limpiar los campos del formulario
        document.getElementById('updateNombre').value = '';
        document.getElementById('updateApellidos').value = '';
        document.getElementById('updateFoto').value = '';
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
        // Limpiar el campo del formulario
        document.getElementById('emailInput').value = ''; // Asegúrate de que el ID sea correcto
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
        setTimeout(() => {
            getProfile();
        }, 1500); 
        // Limpiar los campos del formulario
        document.getElementById('updateNombre').value = '';
        document.getElementById('updateApellidos').value = '';
        document.getElementById('updateFoto').value = '';
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
    // Confirmar la eliminación de la cuenta
    const confirmDelete = confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.');
    if (!confirmDelete) {
        return;
    }

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
        // Limpiar los campos del formulario
        document.getElementById('contactNombre').value = ''; // Asegúrate de que el ID sea correcto
        document.getElementById('contactEmail').value = ''; // Asegúrate de que el ID sea correcto
        document.getElementById('contactMensaje').value = ''; // Asegúrate de que el ID sea correcto
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


async function queryRTD(data) {
    // Construir la URL con parámetros de consulta
    const url = new URL(`http://127.0.0.1:8000/rest/rtd`);
    url.searchParams.append('module_name', data.module_name);
    url.searchParams.append('doc_data', data.doc_data);

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });

    const responseData = await response.json();
    
    // Mostrar la consulta enviada y la respuesta recibida
    appendHttpResponse(`Consulta enviada: ${url.toString()}`);
    
    if (response.ok) {
        document.getElementById('response').textContent = JSON.stringify(responseData, null, 2);
        appendHttpResponse(`Consulta RTD exitosa para módulo: ${data.module_name}`);
    } else {
        appendHttpResponse(`Error en consulta RTD: ${responseData.error}`);
    }
    return responseData;
}


async function saveRTD(data) {
    const response = await fetch(`http://127.0.0.1:8000/rest/rtd`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    const responseData = await response.json();
    
    // Mostrar la consulta enviada y la respuesta recibida
    appendHttpResponse(`Consulta enviada: ${JSON.stringify(data, null, 2)}`);
    
    if (response.ok) {
        appendHttpResponse(`Datos guardados exitosamente en módulo: ${data.module_name}`);
        document.getElementById('response').textContent = JSON.stringify(responseData, null, 2);
    } else {
        appendHttpResponse(`Error al guardar datos en RTD: ${responseData.error}`);
    }
    return responseData;
}


async function updateRTD(data) {
    const response = await fetch(`http://127.0.0.1:8000/rest/rtd`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    const responseData = await response.json();
    
    // Mostrar la consulta enviada y la respuesta recibida
    appendHttpResponse(`Consulta enviada: ${JSON.stringify(data, null, 2)}`);
    
    if (response.ok) {
        appendHttpResponse(`Datos actualizados exitosamente en módulo: ${data.module_name}`);
        document.getElementById('response').textContent = JSON.stringify(responseData, null, 2);
    } else {
        appendHttpResponse(`Error al actualizar datos en RTD: ${responseData.error}`);
    }
    return responseData;
}


async function deleteRTD(data) {
    // Construir la URL con parámetros de consulta
    const url = new URL(`http://127.0.0.1:8000/rest/rtd`);
    url.searchParams.append('module_name', data.module_name);
    url.searchParams.append('doc_data', data.doc_data);

    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });
    const responseData = await response.json();
    
    // Mostrar la consulta enviada y la respuesta recibida
    appendHttpResponse(`Consulta enviada: ${JSON.stringify(data, null, 2)}`);
    
    if (response.ok) {
        appendHttpResponse(`Datos eliminados exitosamente del módulo: ${data.module_name}`);
        document.getElementById('response').textContent = JSON.stringify(responseData, null, 2);
    } else {
        appendHttpResponse(`Error al eliminar datos de RTD: ${responseData.error}`);
    }
    return responseData;
}


async function DatabaseRTD() {
    const table = document.getElementById('tableSelector').value; // Nombre de la tabla
    const docData = document.getElementById('nodeInput').value; // Nodo a editar
    const httpMethod = document.getElementById('httpMethodSelector').value; // Método HTTP
    const jsonData = document.getElementById('jsonInput').value; // Datos en formato JSON

    let data = {
        module_name: table,
        doc_data: docData
    };

    // Solo parsear jsonData para POST y PUT
    if (httpMethod === 'POST' || httpMethod === 'PUT') {
        try {
            const parsedData = JSON.parse(jsonData);
            data.data = parsedData; // Agregar los datos parseados al objeto
        } catch (error) {
            appendHttpResponse('Error: Datos JSON no válidos.');
            return;
        }
    }

    switch (httpMethod) {
        case 'GET':
            return await queryRTD(data); // Solo se envían module_name y doc_data
        case 'POST':
            return await saveRTD(data); // Se envían module_name, doc_data y data
        case 'PUT':
            return await updateRTD(data); // Se envían module_name, doc_data y data
        case 'DELETE':
            return await deleteRTD(data); // Solo se envían module_name y doc_data
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

function loadUserData() {
    const userData = JSON.parse(getCookie('userData')); // Obtener y parsear la cookie
    if (userData) { // Verificar que userData exista
        document.getElementById('updateNombre').value = userData.nombre || ''; // Asignar nombre
        document.getElementById('updateApellidos').value = userData.apellidos || ''; // Asignar apellidos
        document.getElementById('updateFoto').value = userData.foto || ''; // Asignar ID de foto
        appendHttpResponse('Datos recolectados y remplazados');
    } else {
        alert('No se encontraron datos de usuario.');
        appendHttpResponse('No hay Datos para mostrar');
    }
}