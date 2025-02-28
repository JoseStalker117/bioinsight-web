from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import firebase_admin
from firebase_admin import credentials, firestore, auth
import json, datetime, os, pytz, pyrebase
from datetime import datetime


# Se inicializa Pyrebase y sus variables
with open(os.path.join(os.path.dirname(__file__), 'Pyrebase.json')) as config_file:
    firebaseConfig = json.load(config_file)
firebase = pyrebase.initialize_app(firebaseConfig)

auth = firebase.auth()
database = firebase.database()

# Componente Firebase-Admin API y sus variables
cred = credentials.Certificate(os.path.join(os.path.dirname(__file__), 'Firebase-admin.json'))
firebase_admin.initialize_app(cred)

firestore = firestore.client()


#Página de pruebas
def test(request):
    return render(request, 'front-test.html')


class Login(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({'error': 'Email y contraseña son requeridos'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Autenticación del usuario con Pyrebase
            user = auth.sign_in_with_email_and_password(email, password)
            id_token = user['idToken']
            
            # Establece la cookie de idToken
            response = Response({'message': 'Login exitoso del usuario', 'idToken': id_token}, status=status.HTTP_200_OK)
            response.set_cookie(
                key='idToken',
                value=id_token,
                httponly=False,
                secure=False, #HTTPS
                samesite='Lax'
            )
            return response
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)


class Register(APIView):
    def post(self, request):
        nombre = request.data.get('nombre')
        apellidos = request.data.get('apellidos')
        username = request.data.get('username')
        password = request.data.get('password')

        if not nombre or not apellidos or not username or not password:
            return Response({'error': 'Todos los campos son requeridos'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Crea el usuario Auth de firebase.
            email = username + "@bioinsight.com"
            user = auth.create_user_with_email_and_password(email, password)

            # Envía un correo de verificación
            #auth.send_email_verification(user['idToken'])

            user_id = user['localId']
            
            user_data = {
                'nombre': nombre,
                'apellidos': apellidos,
                'username': username,
                'creationdate': datetime.now(pytz.timezone('America/Mexico_City')),
                'admin': False,
                'foto': 0
            }
            firestore.collection('usuarios').document(user_id).set(user_data)

            # Autenticación del usuario para obtener el idToken
            user = auth.sign_in_with_email_and_password(email, password)
            id_token = user['idToken']  # Ahora puedes obtener el idToken

            # Establece la cookie con el idToken
            response = Response({'message': 'Usuario registrado exitosamente', 'userId': user_id}, status=status.HTTP_201_CREATED)
            response.set_cookie(
                key='idToken',
                value=id_token,
                httponly=False,
                secure=False,  # Cambiar a True en producción
                samesite='Lax'
            )
            return response
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        
class Querry(APIView):
    def get(self, request):
        id_token = request.COOKIES.get('idToken')

        if not id_token:
            return Response({'error': 'Token de autorización requerido'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            data = firebase.database().get(id_token)
            return Response(data.val(), status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'Error al consultar la base de datos'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class Form(APIView):
    def post(self, request):
        nombre = request.data.get('nombre')
        email = request.data.get('email')
        mensaje = request.data.get('mensaje')

        if not nombre or not email or not mensaje:
            return Response({'error': 'Todos los campos son requeridos'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            contacto_data = {
                'nombre': nombre,
                'email': email,
                'mensaje': mensaje,
                'fecha': datetime.now(pytz.timezone('America/Mexico_City'))
            }
            firestore.collection('contacto').add(contacto_data)

            return Response({'message': 'Mensaje enviado exitosamente'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        
class UpdateProfile(APIView):
    def put(self, request):
        id_token = request.COOKIES.get('idToken')

        if not id_token:
            return Response({'error': 'Token de autorización requerido'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            decoded_token = firebase_admin.auth.verify_id_token(id_token)
            user_id = decoded_token['uid']

            # Obtiene los nuevos datos del perfil
            nombre = request.data.get('nombre')
            apellidos = request.data.get('apellidos')
            foto = request.data.get('foto')  # Nueva clave para la foto

            # Convierte la clave foto a un tipo de dato numérico, si es posible
            if foto is not None:
                try:
                    foto = int(foto)
                except ValueError:
                    return Response({'error': 'El campo foto debe ser un número entero'}, status=status.HTTP_400_BAD_REQUEST)

            # Verifica que se hayan proporcionado al menos algunos datos
            if not nombre and not apellidos and foto is None:
                return Response({'error': 'Al menos uno de los campos debe ser proporcionado'}, status=status.HTTP_400_BAD_REQUEST)

            # Prepara los datos a actualizar
            user_data = {}
            if nombre:
                user_data['nombre'] = nombre
            if apellidos:
                user_data['apellidos'] = apellidos
            if foto is not None:  # Asegúrate de que la foto no sea None
                user_data['foto'] = foto

            # Actualiza los datos del usuario en Firestore
            firestore.collection('usuarios').document(user_id).update(user_data)

            return Response({'message': 'Perfil actualizado exitosamente'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetProfile(APIView):
    def get(self, request):
        id_token = request.COOKIES.get('idToken')

        if not id_token:
            return Response({'error': 'Token de autorización requerido'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            decoded_token = firebase_admin.auth.verify_id_token(id_token)
            user_id = decoded_token['uid']

            # Obtiene la información del usuario desde Firestore
            user_doc = firestore.collection('usuarios').document(user_id).get()
            if not user_doc.exists:
                return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)

            user_data = user_doc.to_dict()

            if 'creationdate' in user_data:
                            creation_date = user_data['creationdate']
                            if isinstance(creation_date, datetime):
                                user_data['creationdate'] = creation_date.strftime('%Y-%m-%d %H:%M:%S')  # Formato de texto

            # Establece la cookie con el idToken
            response = Response({'message': 'Información del usuario obtenida exitosamente', 'user': user_data}, status=status.HTTP_200_OK)
            response.set_cookie(
                key='userData',
                value=json.dumps(user_data),  # Convierte el diccionario a una cadena JSON
                httponly=False,
                secure=False,  # Cambiar a True en producción
                samesite='Lax'
            )

            return response
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ResetPassword(APIView):
    def post(self, request):
        email = request.data.get('email')

        if not email:
            return Response({'error': 'El correo electrónico es requerido'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Envía un correo de restablecimiento de contraseña
            auth.send_password_reset_email(email)

            return Response({'message': 'Correo de restablecimiento de contraseña enviado exitosamente'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ResendEmail(APIView):
    def post(self, request):
        id_token = request.COOKIES.get('idToken')

        if not id_token:
            return Response({'error': 'Token de autorización requerido'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            auth.send_email_verification(id_token)

            return Response({'message': 'Correo de verificación reenviado exitosamente'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class Logout(APIView):
    def post(self, request):
        response = Response({'message': 'Sesión cerrada exitosamente'}, status=status.HTTP_200_OK)
        response.delete_cookie('idToken')
        response.delete_cookie('userData')
        return response


class DeleteAccount(APIView):
    def post(self, request):
        id_token = request.COOKIES.get('idToken')

        if not id_token:
            return Response({'error': 'Token de autorización requerido'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            decoded_token = firebase_admin.auth.verify_id_token(id_token)
            user_id = decoded_token['uid']
            
            
            firebase_admin.auth.delete_user(user_id)
            firestore.collection('usuarios').document(user_id).delete()

            response = Response({'message': 'Cuenta eliminada exitosamente(auth y firestore)'}, status=status.HTTP_200_OK)
            #Elimina las cookies
            response.delete_cookie('idToken')
            response.delete_cookie('userData')
            return response
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
           

class LinkOAuth(APIView):
    def post(self, request):
        id_token = request.COOKIES.get('idToken')
        oauth_token = request.data.get('oauth_token')  # Token de OAuth de la aplicación de terceros
        provider = request.data.get('provider')  # Nombre del proveedor (ej. 'google', 'facebook')
        phone_number = request.data.get('phone_number')  # Número de teléfono a vincular

        if not id_token or not provider:
            return Response({'error': 'Token de autorización y proveedor son requeridos'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Verifica el token y obtiene el uid del usuario
            decoded_token = firebase_admin.auth.verify_id_token(id_token)
            user_id = decoded_token['uid']

            # Vincula la cuenta de OAuth y el número de teléfono al usuario
            if provider == 'google':
                # Lógica para vincular cuenta de Google
                pass  # Implementa la lógica específica para Google
            elif provider == 'facebook':
                # Lógica para vincular cuenta de Facebook
                pass  # Implementa la lógica específica para Facebook
            
            # Vincula el número de teléfono
            if phone_number:
                auth.update_user(user_id, phone_number=phone_number)

            return Response({'message': f'Cuenta de {provider} y número de teléfono vinculados exitosamente'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class UnlinkOAuth(APIView):
    def post(self, request):
        id_token = request.COOKIES.get('idToken')
        provider = request.data.get('provider')  # Nombre del proveedor (ej. 'google', 'facebook')

        if not id_token or not provider:
            return Response({'error': 'Token de autorización y proveedor son requeridos'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Verifica el token y obtiene el uid del usuario
            decoded_token = firebase_admin.auth.verify_id_token(id_token)
            user_id = decoded_token['uid']

            # Desvincula la cuenta de OAuth del usuario
            if provider == 'google':
                # Lógica para desvincular cuenta de Google
                pass  # Implementa la lógica específica para Google
            elif provider == 'facebook':
                # Lógica para desvincular cuenta de Facebook
                pass  # Implementa la lógica específica para Facebook
            
            # Desvincula el número de teléfono (opcionalmente puedes establecerlo como None)
            auth.update_user(user_id, phone_number=None)

            return Response({'message': f'Cuenta de {provider} desvinculada y número de teléfono eliminado exitosamente'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class DatabaseRTD(APIView):
    @csrf_exempt
    def get(self, request):
        id_token = request.COOKIES.get('idToken')
        module_name = request.query_params.get('module_name')  # Obtener desde la URL
        doc_data = request.query_params.get('doc_data')  # Obtener desde la URL
        
        if not doc_data:
            return Response({'error': 'doc_data es requerido para consultar el nodo child'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            data = database.child(module_name).child(doc_data).get(id_token)
            if not data.val():
                return Response({'error': 'Dispositivo no encontrado'}, status=status.HTTP_404_NOT_FOUND)
            return Response(data.val(), status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @csrf_exempt
    def post(self, request):
        id_token = request.COOKIES.get('idToken')
        module_name = request.data.get('module_name')
        doc_data = request.data.get('doc_data')
        data = request.data.get('data')

        if not module_name or not doc_data or not data:
            return Response({'error': 'module_name, doc_data y data son requeridos'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            database.child(module_name).child(doc_data).set(data, token=id_token)
            return Response({'message': 'Datos guardados exitosamente'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @csrf_exempt
    def put(self, request):
        id_token = request.COOKIES.get('idToken')
        module_name = request.data.get('module_name')
        doc_data = request.data.get('doc_data')
        data = request.data.get('data')

        if not module_name or not doc_data or not data:
            return Response({'error': 'module_name, doc_data y data son requeridos'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            database.child(module_name).child(doc_data).update(data, token=id_token)
            return Response({'message': 'Datos actualizados exitosamente'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @csrf_exempt
    def delete(self, request):
        id_token = request.COOKIES.get('idToken')
        module_name = request.query_params.get('module_name')  # Obtener desde la URL
        doc_data = request.query_params.get('doc_data')  # Obtener desde la URL

        if not doc_data:
            return Response({'error': 'doc_data es requerido para modificar el nodo.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            database.child(module_name).child(doc_data).remove(id_token)
            return Response({'message': 'Datos eliminados exitosamente'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        
# >>>   Métodos de Luis xddd    <<<
class ModbusData(APIView):
    def get(self, request):
        # Cambiar para obtener el id_token de la cookie
        id_token = request.COOKIES.get('idToken')
        if not id_token:
            return Response({'error': 'Token de autorización requerido'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            decoded_token = auth.get_account_info(id_token)  
            uid = decoded_token['users'][0]['localId']
            data = database.child('Modbus').get(token=id_token)   
            if data.each():
                result = {item.key(): item.val() for item in data.each()} 
                return Response(result, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'No se encontraron datos en la base de datos'}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({'error': 'Error al consultar la base de datos'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        
class Modulo1(APIView):
    def get(self, request):
        id_token = request.COOKIES.get('idToken')
        if not id_token:
            return Response({'error': 'Token de autorización requerido'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            data = database.child('Modulo1').get(id_token)   

            if data.each():
                result = {item.key(): item.val() for item in data.each()}
                return Response(result, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'No se encontraron datos en la base de datos'}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({'error': 'Error al consultar la base de datos'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
  
        
class Modulo2(APIView):
    def get(self, request):
        id_token = request.COOKIES.get('idToken')
        if not id_token:
            return Response({'error': 'Token de autorización requerido'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            data = database.child('Modulo2').get(id_token)   

            if data.each():
                result = [
                    {**item.val(), "id": item.key(), "timestamp": int(item.key())}
                    for item in data.each()
                ]
                return Response(result, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'No se encontraron datos en la base de datos'}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({'error': 'Error al consultar la base de datos'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
# >>>   Métodos de Luis xddd    <<<
        
#hello