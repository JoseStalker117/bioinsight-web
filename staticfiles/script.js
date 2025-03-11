//TODO: cambiar a variable global la url del backend

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}


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
        appendHttpResponse('Login exitoso');
        document.cookie = `idToken=${data.idToken}; path=/`; 
        setTimeout(() => {
            getProfile();
        }, 1500);
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
            'Authorization': `Bearer ${idToken}`
        },
        credentials: 'include'
    });
    const data = await response.json();
    if (response.ok) {
        document.getElementById('response').textContent = JSON.stringify(data, null, 2);
        appendHttpResponse('Consulta de Database RTD exitosa.');
    } else {
        document.getElementById('response').textContent = 'Error al consultar la API Modbus';
        appendHttpResponse(`Error al consultar la API Modbus: ${data.error}`);
    }
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
        document.getElementById('updateNombre').value = '';
        document.getElementById('updateApellidos').value = '';
        document.getElementById('updateFoto').value = '';
    } else {
        appendHttpResponse(`Error en el registro: ${data.error}`);
    }
    return data;
}


async function sendForm(event) {
    event.preventDefault();

    const nombre = document.getElementById('formNombre').value;
    const email = document.getElementById('formEmail').value;
    const mensaje = document.getElementById('formMensaje').value;

    const response = await fetch('http://127.0.0.1:8000/rest/form', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, email, mensaje }),
    });
    const data = await response.json();
    if (response.ok) {
        appendHttpResponse(`Mensaje de contacto enviado exitosamente por: ${nombre}`);
        document.getElementById('formNombre').value = '';
        document.getElementById('formEmail').value = '';
        document.getElementById('formMensaje').value = '';
    } else {
        appendHttpResponse(`Error al enviar mensaje de contacto: ${data.error}`);
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
        document.getElementById('updateNombre').value = '';
        document.getElementById('updateApellidos').value = '';
        document.getElementById('updateFoto').value = '';
    } else {
        appendHttpResponse(`Error al actualizar perfil: ${data.error}`);
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
        document.getElementById('emailInput').value = '';
    } else {
        appendHttpResponse(`Error al restablecer contraseña: ${data.error}`);
    }
    return data;
}


async function resendEmail() {
    const response = await fetch('http://127.0.0.1:8000/rest/resend-email', {
        method: 'GET',
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


async function logout() {
    const response = await fetch('http://127.0.0.1:8000/rest/logout', {
        method: 'GET',
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
     // Nombre de la tabla
    const table = document.getElementById('tableSelector').value;
     // Nodo a editar
    const docData = document.getElementById('nodeInput').value;
     // Método HTTP
    const httpMethod = document.getElementById('httpMethodSelector').value;
     // Datos en formato JSON
    const jsonData = document.getElementById('jsonInput').value;

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
    if (userData) {
        document.getElementById('updateNombre').value = userData.nombre || '';
        document.getElementById('updateApellidos').value = userData.apellidos || '';
        document.getElementById('updateFoto').value = userData.foto || '';
        appendHttpResponse('Datos recolectados y remplazados');
    } else {
        alert('No se encontraron datos de usuario.');
        appendHttpResponse('No hay Datos para mostrar');
    }
}


function handleOAuthSelection(provider) {
    let selectedProvider = provider;
    const inputContainer = document.getElementById('oauthInputContainer');
    const tokenInput = document.getElementById('oauthTokenInput');
    const phoneInput = document.getElementById('phoneNumberInput');
    
    inputContainer.style.display = 'block';
    
    // Mostrar/ocultar campos según el proveedor seleccionado
    if (provider === 'phone_number') {
        tokenInput.style.display = 'none';
        phoneInput.style.display = 'inline-block';
    } else {
        tokenInput.style.display = 'inline-block';
        phoneInput.style.display = 'none';
    }
    
    // Resaltar el proveedor seleccionado
    document.querySelectorAll('.oauth-cell').forEach(cell => {
        cell.style.backgroundColor = 'white';
    });
    event.currentTarget.style.backgroundColor = '#e3f2fd';
}


async function changePassword() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;

    const response = await fetch('http://127.0.0.1:8000/rest/change-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
    });

    const data = await response.json();
    if (response.ok) {
        document.cookie = `idToken=${data.idToken}; path=/`;
        appendHttpResponse('Contraseña cambiada exitosamente');

        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
    } else {
        appendHttpResponse(`Error al cambiar la contraseña: ${data.error}`);
    }
    return data;
}


async function checkAdmin() {
    const uid = document.getElementById('adminUid').value;

    const response = await fetch('http://127.0.0.1:8000/rest/isadmin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid }),
    });

    const data = await response.json();
    if (response.ok) {
        appendHttpResponse(`Estado de Administrador: ${data.is_admin ? 'Es Administrador' : 'No es Administrador'}`);
    } else {
        appendHttpResponse(`Error al verificar estado de administrador: ${data.error}`);
    }
    return data;


}


async function addUser() {
    const username = document.getElementById('addUsername').value;
    const nombre = document.getElementById('addNombre').value;
    const apellidos = document.getElementById('addApellidos').value;
    const admin = document.getElementById('addAdmin').value === 'true';

    const response = await fetch('http://127.0.0.1:8000/rest/admin-adduser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, nombre, apellidos, admin }),
    });

    const data = await response.json();
    if (response.ok) {
        appendHttpResponse(`Usuario agregado exitosamente: ${username}. Contraseña: ${data.password}`);
    } else {
        appendHttpResponse(`Error al agregar usuario: ${data.error}`);
    }
}


async function getContactos() {
    const response = await fetch('http://127.0.0.1:8000/rest/admin-buzon', {
        method: 'GET',
        credentials: 'include',
    });

    const data = await response.json();
    if (response.ok) {
        const responseDiv = document.getElementById('response');
        responseDiv.innerHTML = ''; // Clear previous responses

        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';

        // Create table header
        const header = table.createTHead();
        const headerRow = header.insertRow(0);
        ['Fecha', 'Nombre', 'Email', 'Mensaje', 'Acciones'].forEach((text, index) => {
            const cell = headerRow.insertCell(index);
            cell.textContent = text;
            cell.style.border = '1px solid #ccc';
            cell.style.padding = '8px';
            cell.style.backgroundColor = '#f2f2f2';
        });

        // Create table body
        const tbody = table.createTBody();
        Object.entries(data).forEach(([id, contacto]) => {
            const row = tbody.insertRow();
            ['Fecha', 'Nombre', 'Email', 'Mensaje'].forEach((key, index) => {
                const cell = row.insertCell(index);
                cell.textContent = contacto[key.toLowerCase()];
                cell.style.border = '1px solid #ccc';
                cell.style.padding = '8px';
            });

            // Add delete button
            const deleteCell = row.insertCell(4);
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.style.backgroundColor = '#dc3545';
            deleteButton.style.color = 'white';
            deleteButton.style.border = 'none';
            deleteButton.style.padding = '5px 10px';
            deleteButton.style.borderRadius = '4px';
            deleteButton.style.cursor = 'pointer';
            deleteButton.onclick = () => deleteContacto(id);
            deleteCell.appendChild(deleteButton);
        });

        appendHttpResponse(`Buzón de contacto recuperado exitosamente`);
        responseDiv.appendChild(table);
    } else {
        appendHttpResponse(`Error al obtener contactos: ${data.error}`);
    }
}

async function deleteContacto(contactoId) {
    const response = await fetch(`http://127.0.0.1:8000/rest/admin-buzon?contacto_id=${contactoId}`, {
        method: 'DELETE',
        credentials: 'include',
    });

    const data = await response.json();
    if (response.ok) {
        appendHttpResponse(`Contacto eliminado exitosamente: ${contactoId}`);
        getContactos(); // Refresh the contact list
    } else {
        appendHttpResponse(`Error al eliminar contacto: ${data.error}`);
    }
}


async function manageUser() {
    const userId = document.getElementById('manageUserId').value;
    const admin = document.getElementById('manageAdmin').value === 'true';

    const response = await fetch('http://127.0.0.1:8000/rest/admin-usuarios', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId, admin }),
    });

    const data = await response.json();
    if (response.ok) {
        appendHttpResponse(`Estado de administrador actualizado para el usuario: ${userId}`);
    } else {
        appendHttpResponse(`Error al actualizar estado de administrador: ${data.error}`);
    }
}

async function getUsuarios() {
    const response = await fetch('http://127.0.0.1:8000/rest/admin-usuarios', {
        method: 'GET',
        credentials: 'include',
    });

    const data = await response.json();
    if (response.ok) {
        const responseDiv = document.getElementById('response');
        responseDiv.innerHTML = ''; // Clear previous responses

        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';

        // Create table header
        const header = table.createTHead();
        const headerRow = header.insertRow(0);
        ['ID', 'Username', 'Email', 'Admin', 'Acciones'].forEach((text, index) => {
            const cell = headerRow.insertCell(index);
            cell.textContent = text;
            cell.style.border = '1px solid #ccc';
            cell.style.padding = '8px';
            cell.style.backgroundColor = '#f2f2f2';
        });

        // Create table body
        const tbody = table.createTBody();
        data.forEach(usuario => {
            const row = tbody.insertRow();
            ['id', 'username', 'email', 'admin'].forEach((key, index) => {
                const cell = row.insertCell(index);
                cell.textContent = usuario[key];
                cell.style.border = '1px solid #ccc';
                cell.style.padding = '8px';
            });

            // Add action buttons
            const actionCell = row.insertCell(4);
            const resetButton = document.createElement('button');
            resetButton.textContent = 'Restablecer Contraseña';
            resetButton.style.backgroundColor = '#007bff';
            resetButton.style.color = 'white';
            resetButton.style.border = 'none';
            resetButton.style.padding = '5px 10px';
            resetButton.style.borderRadius = '4px';
            resetButton.style.cursor = 'pointer';
            resetButton.onclick = () => resetPassword(usuario.id);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar Cuenta';
            deleteButton.style.backgroundColor = '#dc3545';
            deleteButton.style.color = 'white';
            deleteButton.style.border = 'none';
            deleteButton.style.padding = '5px 10px';
            deleteButton.style.borderRadius = '4px';
            deleteButton.style.cursor = 'pointer';
            deleteButton.onclick = () => deleteUser(usuario.id);

            actionCell.appendChild(resetButton);
            actionCell.appendChild(deleteButton);
        });

        appendHttpResponse(`Tabla de usuarios recuperada exitosamente.`);
        responseDiv.appendChild(table);
    } else {
        appendHttpResponse(`Error al obtener usuarios: ${data.error}`);
    }
}

async function resetPassword(userId) {
    const response = await fetch('http://127.0.0.1:8000/rest/admin-restore', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ uid: userId }),
    });

    const data = await response.json();
    if (response.ok) {
        appendHttpResponse(`Contraseña restablecida exitosamente para el usuario ${userId}. Nueva contraseña: ${data.new_password}`);
    } else {
        appendHttpResponse(`Error al restablecer contraseña: ${data.error}`);
    }
}

async function deleteUser(userId) {
    const confirmDelete = confirm('¿Estás seguro de que deseas eliminar esta cuenta? Esta acción no se puede deshacer.');
    if (!confirmDelete) {
        return;
    }

    const response = await fetch(`http://127.0.0.1:8000/rest/admin-restore?uid=${userId}`, {
        method: 'DELETE',
        credentials: 'include',
    });

    const data = await response.json();
    if (response.ok) {
        appendHttpResponse(`Cuenta eliminada exitosamente para el usuario ${userId}`);
        getUsuarios(); // Refresh the user list
    } else {
        appendHttpResponse(`Error al eliminar cuenta: ${data.error}`);
    }
}