from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import firebase_admin
from firebase_admin import credentials, firestore, auth
from firebase_admin import auth as admin_auth
from firebase_admin.auth import ExpiredIdTokenError, InvalidIdTokenError
import json, datetime, os, pytz, pyrebase
from datetime import datetime, timedelta
from django.utils import timezone
import requests

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
                secure=False,
                samesite='Lax',
                max_age=3600
            )
            return response
        except requests.exceptions.RequestException as e:
            if 'INVALID_LOGIN_CREDENTIALS' in str(e):
                return Response({'error': 'Usuario o contraseña incorrectos'}, status=status.HTTP_401_UNAUTHORIZED)
            error_message = str(e)
            return Response({'error': 'Error en la solicitud de autenticación', 'details': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            error_message = str(e)
            return Response({'error': 'Error inesperado', 'details': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class Register(APIView):
    def post(self, request):
        nombre = request.data.get('nombreReg')
        apellidos = request.data.get('apellidosReg')
        username = request.data.get('usernameReg')
        password = request.data.get('passwordReg')

        if not nombre or not apellidos or not username or not password:
            return Response({'error': 'Todos los campos son requeridos'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Crea el usuario Auth de firebase.
            email = username + "@bioinsight.com"
            user = auth.create_user_with_email_and_password(email, password)

            # Envía un correo de verificación
            auth.send_email_verification(user['idToken'])

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
            response = Response({'message': 'Usuario registrado exitosamente'}, status=status.HTTP_201_CREATED)
            response.set_cookie(
                key='idToken',
                value=id_token,
                httponly=False,
                secure=False,
                samesite='Lax',
                max_age=3600
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
        id_token = request.headers.get('Authorization')
        if id_token and id_token.startswith('Bearer '):
            id_token = id_token.split('Bearer ')[1]
        else:
            return Response({'error': 'Token de autorización requerido'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            decoded_token = firebase_admin.auth.verify_id_token(id_token)
            user_id = decoded_token['uid']

            # Obtiene los nuevos datos del perfil
            nombre = request.data.get('nombre')
            apellidos = request.data.get('apellidos')
            foto = request.data.get('foto')

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
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return Response({'error': 'Token de autorización requerido'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Extraer el token después de 'Bearer '
        id_token = auth_header.split(' ')[1]  
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
                value=json.dumps(user_data),
                httponly=False,
                secure=False,
                samesite='Lax',
                max_age=3600
            )

            return response
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ChangePassword(APIView):
    def post(self, request):
        # id_token = request.COOKIES.get('idToken')
        id_token = request.headers.get('Authorization')

        if id_token and id_token.startswith('Bearer '):
            id_token = id_token.split('Bearer ')[1]
        else:
            return Response({'error': 'Token de autorización requerido'}, status=status.HTTP_400_BAD_REQUEST)

        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')

        if not id_token:
            return Response({'error': 'Token de autorización requerido'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not current_password or not new_password:
            return Response({'error': 'Las contraseñas son requeridas para el movimiento.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user_info = auth.get_account_info(id_token)
            email = user_info['users'][0]['email']
            
            try:
                auth.sign_in_with_email_and_password(email, current_password)
            except Exception as e:
                return Response({'error': 'La contraseña actual es incorrecta'}, status=status.HTTP_401_UNAUTHORIZED)

            user_id = user_info['users'][0]['localId']
            admin_auth.update_user(user_id, password=new_password)
            user = auth.sign_in_with_email_and_password(email, new_password)
            id_token = user['idToken']
            
            # Correct way to create the response object
            response = Response({'message': 'Contraseña actualizada exitosamente'}, status=status.HTTP_200_OK)
            response.set_cookie(
                key='idToken',
                value=id_token,
                httponly=False,
                secure=False,
                samesite='Lax',
                max_age=3600
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
    def get(self, request):
        # id_token = request.COOKIES.get('idToken')
        id_token = request.headers.get('Authorization')

        if id_token and id_token.startswith('Bearer '):
            id_token = id_token.split('Bearer ')[1]
        else:
            return Response({'error': 'Token de autorización requerido'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            auth.send_email_verification(id_token)

            return Response({'message': 'Correo de verificación reenviado exitosamente'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class Logout(APIView):
    def get(self, request):
        response = Response({'message': 'Sesión cerrada exitosamente'}, status=status.HTTP_200_OK)
        response.delete_cookie('idToken')
        response.delete_cookie('userData')
        return response


class DeleteAccount(APIView):
    def get(self, request):
        # id_token = request.COOKIES.get('idToken')

        # if not id_token:
        #     return Response({'error': 'Token de autorización requerido'}, status=status.HTTP_400_BAD_REQUEST)
        id_token = request.headers.get('Authorization')

        if id_token and id_token.startswith('Bearer '):
            id_token = id_token.split('Bearer ')[1]
        else:
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
          
          
class GetLinkedServices(APIView):
    def get(self, request):
        # Obtener el token de autorización
        id_token = request.headers.get('Authorization')
        if id_token and id_token.startswith('Bearer '):
            id_token = id_token.split('Bearer ')[1]
        else:
            return Response({'error': 'Token de autorización requerido'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Verificar el token de Firebase
            decoded_token = firebase_admin.auth.verify_id_token(id_token)
            user_id = decoded_token['uid']

            # Obtener los servicios vinculados al usuario
            user = admin_auth.get_user(user_id)

            linked_services = {}

            # Verificar si está vinculado a servicios
            if user.phone_number:
                linked_services['phone_number'] = user.phone_number

            if 'google.com' in user.provider_data:
                linked_services['google'] = True

            if 'github.com' in user.provider_data:
                linked_services['github'] = True

            if 'microsoft.com' in user.provider_data:
                linked_services['microsoft'] = True

            return Response({'message': 'Servicios vinculados obtenidos', 'data': linked_services}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
         
# api para telefono
class LinkOAuth(APIView):
    def post(self, request):
        # id_token = request.COOKIES.get('idToken')
        id_token = request.headers.get('Authorization')
        if id_token and id_token.startswith('Bearer '):
            id_token = id_token.split('Bearer ')[1]
        else:
            return Response({'error': 'Token de autorización requerido'}, status=status.HTTP_400_BAD_REQUEST)

        oauth_token = request.data.get('oauth_token')
        provider = request.data.get('provider')
        phone_number = request.data.get('phone_number')

        if not id_token or not provider:
            return Response({'error': 'Token de autorización y proveedor son requeridos'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            decoded_token = firebase_admin.auth.verify_id_token(id_token)
            user_id = decoded_token['uid']
            
            if provider == 'phone_number':
                admin_auth.update_user(user_id, phone_number=phone_number)

            elif provider == 'google':
                admin_auth.update_user(
                    user_id,
                    provider_to_link=auth.GoogleAuthProvider.credential(oauth_token)
                )
            elif provider == 'github':
                admin_auth.update_user(
                    user_id,
                    provider_to_link=auth.GithubAuthProvider.credential(oauth_token)
                )
            elif provider == 'microsoft':
                admin_auth.update_user(
                    user_id,
                    provider_to_link=auth.OAuthProvider('microsoft.com').credential(oauth_token)
                )
            return Response({'message': f'Cuenta de {provider} y/o número de teléfono vinculados exitosamente'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
 
# api de telefono
class UnlinkOAuth(APIView):
    def post(self, request):
        # id_token = request.COOKIES.get('idToken')
        id_token = request.headers.get('Authorization')
        if id_token and id_token.startswith('Bearer '):
            id_token = id_token.split('Bearer ')[1]
        else:
            return Response({'error': 'Token de autorización requerido'}, status=status.HTTP_400_BAD_REQUEST)

        provider = request.data.get('provider') 

        if not id_token or not provider:
            return Response({'error': 'Token de autorización y proveedor son requeridos'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            decoded_token = firebase_admin.auth.verify_id_token(id_token)
            user_id = decoded_token['uid']

            if provider == 'phone_number':
                admin_auth.update_user(user_id, phone_number=None)
            if provider == 'google':
                # Desvincular cuenta de Google
                admin_auth.update_user(
                    user_id,
                    provider_to_unlink=['google.com']
                )
            elif provider == 'github':
                # Desvincular cuenta de Github
                admin_auth.update_user(
                    user_id,
                    provider_to_unlink=['github.com']
                )
            elif provider == 'microsoft':
                # Desvincular cuenta de Microsoft
                admin_auth.update_user(
                    user_id,
                    provider_to_unlink=['microsoft.com']
                )

            return Response({'message': f'Cuenta de {provider} desvinculada eliminado exitosamente'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class DatabaseRTD(APIView):
    @csrf_exempt
    def get(self, request):
        id_token = request.COOKIES.get('idToken')
        module_name = request.query_params.get('module_name')  
        doc_data = request.query_params.get('doc_data')  
        
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
        id_token = request.headers.get('Authorization')
        if id_token and id_token.startswith('Bearer '):
            id_token = id_token.split('Bearer ')[1]
        else:
            return Response({'error': 'Token de autorización requerido'}, status=status.HTTP_400_BAD_REQUEST)

        module_name = request.data.get('module_name')
        doc_data = request.data.get('doc_data')
        data = request.data.get('data')

        if not module_name or not doc_data or not data:
            return Response({'error': 'module_name, doc_data y data son requeridos'}, status=status.HTTP_400_BAD_REQUEST)

        decoded_token = firebase_admin.auth.verify_id_token(id_token)
        uid = decoded_token['uid']

        if not is_admin(uid):
            return Response({'error': 'No tienes permisos de administrador'}, status=status.HTTP_403_FORBIDDEN)
        
        timestamp_id = str(int(datetime.utcnow().timestamp()))  

        try:
            database.child(module_name).child(timestamp_id).set(data, token=id_token)
            return Response({'message': 'Datos guardados exitosamente', 'id': timestamp_id}, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(f"Error en POST: {e}") 
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @csrf_exempt
    def put(self, request):
        id_token = request.headers.get('Authorization')
        if id_token and id_token.startswith('Bearer '):
            id_token = id_token.split('Bearer ')[1]
        else:
            return Response({'error': 'Token de autorización requerido'}, status=status.HTTP_400_BAD_REQUEST)

        module_name = request.data.get('module_name')
        doc_data = request.data.get('doc_data')
        data = request.data.get('data')
        
        print(f"module name: {module_name}")
        print(f"doc data: {doc_data}")
        print(f"data: {data}")

        if not module_name or not doc_data or not data:
            return Response({'error': 'module_name, doc_data y data son requeridos'}, status=status.HTTP_400_BAD_REQUEST)

        decoded_token = firebase_admin.auth.verify_id_token(id_token)
        uid = decoded_token['uid']

        if not is_admin(uid):
            return Response({'error': 'No tienes permisos de administrador'}, status=status.HTTP_403_FORBIDDEN)
        try:
            database.child(module_name).child(doc_data).set(data, token=id_token)
            return Response({'message': 'Datos actualizados exitosamente'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @csrf_exempt
    def delete(self, request):
        id_token = request.headers.get('Authorization')
        if id_token and id_token.startswith('Bearer '):
            id_token = id_token.split('Bearer ')[1]
        else:
            return Response({'error': 'Token de autorización requerido'}, status=status.HTTP_400_BAD_REQUEST)

        module_name = request.query_params.get('module_name')  # Obtener desde la URL
        # doc_data = request.query_params.get('doc_data')  # Obtener desde la URL
        doc_data = request.query_params.getlist('doc_data[]')  # Obtener una lista de IDs desde la URL

        if not doc_data:
            return Response({'error': 'doc_data es requerido para modificar el nodo.'}, status=status.HTTP_400_BAD_REQUEST)

        decoded_token = firebase_admin.auth.verify_id_token(id_token)
        uid = decoded_token['uid']

        if not is_admin(uid):
            return Response({'error': 'No tienes permisos de administrador'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            # database.child(module_name).child(doc_data).remove(id_token)
            for doc_id in doc_data:  # Iterar sobre la lista de IDs
                database.child(module_name).child(doc_id).remove(id_token)
            return Response({'message': 'Datos eliminados exitosamente'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# NO SIRVE
class RefreshToken(APIView):
    def get(self, request):
        idToken = request.COOKIES.get('idToken')
        
        if not idToken:
            return Response({'error': 'Es necesario tener un idToken para efectuar este movimiento.'}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            user = auth.refresh(idToken)
            newtoken = user['idToken']
            
            response = Response({
                'idToken': newtoken,
                'message': 'Token refrescado exitosamente'
            }, status=status.HTTP_200_OK)
            
            response.set_cookie(
                key='idToken',
                value=newtoken,
                httponly=False,
                secure=False,
                samesite='Lax',
                max_age=3600
            )
            
            return response
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class OAuthLogin(APIView):
    def post(self, request):
        provider = request.data.get('provider')
        access_token = request.data.get('access_token')

        if not provider or not access_token:
            return Response({'error': 'Proveedor y token de acceso son requeridos'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            if provider == 'google':
                user = auth.sign_in_with_oauth_credential(
                    credential=access_token,
                    provider=provider
                )
            elif provider == 'github':
                user = auth.sign_in_with_oauth_credential(
                    credential=access_token,
                    provider=provider
                )
            elif provider == 'microsoft':
                user = auth.sign_in_with_oauth_credential(
                    credential=access_token,
                    provider=provider
                )
            else:
                return Response({'error': 'Proveedor no soportado'}, status=status.HTTP_400_BAD_REQUEST)

            id_token = user['idToken']
            
            response = Response({'message': f'Login exitoso con {provider}',}, status=status.HTTP_200_OK)
            
            response.set_cookie(
                key='idToken',
                value=id_token,
                httponly=False,
                secure=False,
                samesite='Lax',
                max_age=3600
            )
            
            return response

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)

class OAuthRegister(APIView):
    def post(self, request):
        provider = request.data.get('provider')
        access_token = request.data.get('access_token')
        email = request.data.get('email')
        nombre = request.data.get('nombre')
        apellidos = request.data.get('apellidos')

        if not provider or not access_token or not email or not nombre or not apellidos:
            return Response({'error': 'Proveedor, token de acceso, email, nombre y apellidos son requeridos'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            if provider == 'google':
                user = auth.create_user_with_oauth_credential(
                    credential=access_token,
                    provider=provider,
                    email=email,
                    display_name=f"{nombre} {apellidos}"
                )
            elif provider == 'github':
                user = auth.create_user_with_oauth_credential(
                    credential=access_token,
                    provider=provider,
                    email=email,
                    display_name=f"{nombre} {apellidos}"
                )
            elif provider == 'microsoft':
                user = auth.create_user_with_oauth_credential(
                    credential=access_token,
                    provider=provider,
                    email=email,
                    display_name=f"{nombre} {apellidos}"
                )
            else:
                return Response({'error': 'Proveedor no soportado'}, status=status.HTTP_400_BAD_REQUEST)

            id_token = user['idToken']
            
            response = Response({'message': f'Registro exitoso con {provider}'}, status=status.HTTP_200_OK)
            
            response.set_cookie(
                key='idToken',
                value=id_token,
                httponly=False,
                secure=False,
                samesite='Lax',
                max_age=3600
            )
            
            return response

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)

# >>>   Métodos de Luis xddd    <<<
class ModbusData(APIView):
    def get(self, request):
        id_token = request.headers.get('Authorization')
        if id_token and id_token.startswith('Bearer '):
            id_token = id_token.split('Bearer ')[1]
        else:
            return Response({'error': 'Token de autorización requerido'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # decoded_token = auth.get_account_info(id_token)  
            # uid = decoded_token['users'][0]['localId']
            data = database.child('Modbus').get(token=id_token)   
            if data.each():
                # result = {item.key(): item.val() for item in data.each()} 
                result = [
                    {**item.val(), "id": item.key(), "timestamp": int(item.key())}
                    for item in data.each()
                ]
                return Response(result, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'No se encontraron datos en la base de datos'}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({'error': 'Error al consultar la base de datos'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
              
class Modulo1(APIView):
    def get(self, request):
        id_token = request.headers.get('Authorization')

        if id_token and id_token.startswith('Bearer '):
            id_token = id_token.split('Bearer ')[1]
        else:
            return Response({'error': 'Token de autorización requerido'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            data = database.child('Modulo1').get(id_token)   

            if data.each():
                # result = {item.key(): item.val() for item in data.each()}
                result = [
                    {**item.val(), "id": item.key(), "timestamp": int(item.key())}
                    for item in data.each()
                ]
                return Response(result, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'No se encontraron datos en la base de datos'}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({'error': 'Error al consultar la base de datos'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)  
        
class Modulo2(APIView):
    def get(self, request):
        id_token = request.headers.get('Authorization')

        if id_token and id_token.startswith('Bearer '):
            id_token = id_token.split('Bearer ')[1]
        else:
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
        
# >>>   Métodos de ADMIN    <<<
def is_admin(uid):
    try:
        user_doc = firestore.collection('usuarios').document(uid).get()
        if user_doc.exists:
            user_data = user_doc.to_dict()
            return user_data.get('admin', False)
        return False
    except Exception as e:
        return False
   
class CheckAdmin(APIView):
    def post(self, request):
        uid = request.data.get('uid')

        if not uid:
            return Response({'error': 'UID es requerido'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            admin_status = is_admin(uid)
            return Response({'is_admin': admin_status}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class Admin_AddUser(APIView):
    def post(self, request):
        id_token = request.headers.get('Authorization')
        if id_token and id_token.startswith('Bearer '):
            id_token = id_token.split('Bearer ')[1]
        else:
            return Response({'error': 'Token de autorización requerido'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            decoded_token = firebase_admin.auth.verify_id_token(id_token)
            uid = decoded_token['uid']

            if not is_admin(uid):
                return Response({'error': 'No tienes permisos de administrador'}, status=status.HTTP_403_FORBIDDEN)

            username = request.data.get('username')
            nombre = request.data.get('nombre')
            apellidos = request.data.get('apellidos')
            admin_role = request.data.get('admin', False)
            password = os.urandom(8).hex()

            if not username or not nombre or not apellidos:
                return Response({'error': 'Todos los campos son requeridos'}, status=status.HTTP_400_BAD_REQUEST)

            email = f"{username}@bioinsight.com"
            user = auth.create_user_with_email_and_password(email, password)
            user_id = user['localId']

            user_data = {
                'nombre': nombre,
                'apellidos': apellidos,
                'username': username,
                'creationdate': datetime.now(pytz.timezone('America/Mexico_City')),
                'admin': admin_role,
                'foto': 0                
            }

            firestore.collection('usuarios').document(user_id).set(user_data)

            return Response({'message': 'Usuario creado exitosamente', 'password': password}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class Admin_Buzon(APIView):
    def get(self, request):
        id_token = request.headers.get('Authorization')
        if id_token and id_token.startswith('Bearer '):
            id_token = id_token.split('Bearer ')[1]
        else:
            return Response({'error': 'Token de autorización requerido'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            decoded_token = firebase_admin.auth.verify_id_token(id_token)
            uid = decoded_token['uid']

            if not is_admin(uid):
                return Response({'error': 'No tienes permisos de administrador'}, status=status.HTTP_403_FORBIDDEN)

            contactos = firestore.collection('contacto').get()
            contactos_data = {contacto.id: contacto.to_dict() for contacto in contactos}

            return Response(contactos_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    def delete(self, request):
        id_token = request.headers.get('Authorization')
        if id_token and id_token.startswith('Bearer '):
            id_token = id_token.split('Bearer ')[1]
        else:
            return Response({'error': 'Token de autorización requerido'}, status=status.HTTP_400_BAD_REQUEST)

        contacto_id = request.query_params.get('contacto_id')
        if not contacto_id:
            return Response({'error': 'contacto_id es requerido'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not id_token:
            return Response({'error': 'Token de autorización requerido'}, status=status.HTTP_400_BAD_REQUEST)

        if not contacto_id:
            return Response({'error': 'contacto_id es requerido'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            decoded_token = firebase_admin.auth.verify_id_token(id_token)
            uid = decoded_token['uid']

            if not is_admin(uid):
                return Response({'error': 'No tienes permisos de administrador'}, status=status.HTTP_403_FORBIDDEN)
            
            firestore.collection('contacto').document(contacto_id).delete()

            return Response({'message': 'Contacto eliminado exitosamente'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class Admin_Usuarios(APIView):
    def get(self, request):
        id_token = request.headers.get('Authorization')

        if id_token and id_token.startswith('Bearer '):
            id_token = id_token.split('Bearer ')[1]
        else:
            return Response({'error': 'Token de autorización requerido'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            decoded_token = firebase_admin.auth.verify_id_token(id_token)
            uid = decoded_token['uid']

            if not is_admin(uid):
                return Response({'error': 'No tienes permisos de administrador'}, status=status.HTTP_403_FORBIDDEN)

            # Obtener los usuarios desde Firestore
            usuarios = firestore.collection('usuarios').get()
            if not usuarios:
                return Response({'error': 'No hay usuarios en la colección'}, status=status.HTTP_404_NOT_FOUND)
            
            usuarios_data = [
                {
                    'id': usuario.id,
                    'username': usuario.to_dict().get('username'),
                    'email': f"{usuario.to_dict().get('username')}@bioinsight.com",
                    'admin': usuario.to_dict().get('admin')
                }
                for usuario in usuarios
            ]
            return Response(usuarios_data, status=status.HTTP_200_OK)

        except ExpiredIdTokenError as e:
            print("Token expirado:", str(e))
            return Response({'error': 'El token ha expirado. Por favor inicie sesión nuevamente.'}, status=status.HTTP_401_UNAUTHORIZED)
        except InvalidIdTokenError as e:
            print("Token inválido:", str(e))
            return Response({'error': 'El token proporcionado no es válido.'}, status=status.HTTP_401_UNAUTHORIZED)
        except firestore.exceptions.NotFound as e:
            print("Firestore no encontrado:", str(e))
            return Response({'error': 'No se pudo acceder a la base de datos de Firestore.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except firestore.exceptions.PermissionDenied as e:
            print("Permiso denegado a Firestore:", str(e))
            return Response({'error': 'Permiso denegado al acceder a Firestore.'}, status=status.HTTP_403_FORBIDDEN)
        except Exception as e:
            return Response({'error': 'Ocurrió un error inesperado.', 'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def put(self, request):
        # id_token = request.COOKIES.get('idToken')
        # if not id_token:
        #     return Response({'error': 'Token de autorización requerido'}, status=status.HTTP_400_BAD_REQUEST)
        id_token = request.headers.get('Authorization')

        if id_token and id_token.startswith('Bearer '):
            id_token = id_token.split('Bearer ')[1]
        else:
            return Response({'error': 'Token de autorización requerido'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            decoded_token = firebase_admin.auth.verify_id_token(id_token)
            uid = decoded_token['uid']

            if not is_admin(uid):
                return Response({'error': 'No tienes permisos de administrador'}, status=status.HTTP_403_FORBIDDEN)

            user_id = request.data.get('user_id')
            admin_role = request.data.get('admin')

            if user_id is None or admin_role is None:
                return Response({'error': 'user_id y admin son requeridos'}, status=status.HTTP_400_BAD_REQUEST)

            user_ref = firestore.collection('usuarios').document(user_id)
            user_ref.update({'admin': admin_role})

            return Response({'message': 'Perfil actualizado exitosamente'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class Admin_Restore(APIView):
    def post(self, request):
        # id_token = request.COOKIES.get('idToken')
        # if not id_token:
        #     return Response({'error': 'Token de autorización requerido'}, status=status.HTTP_400_BAD_REQUEST)
        id_token = request.headers.get('Authorization')
        if id_token and id_token.startswith('Bearer '):
            id_token = id_token.split('Bearer ')[1]
        else:
            return Response({'error': 'Token de autorización requerido'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            decoded_token = firebase_admin.auth.verify_id_token(id_token)
            uid = decoded_token['uid']

            if not is_admin(uid):
                return Response({'error': 'No tienes permisos de administrador'}, status=status.HTTP_403_FORBIDDEN)

            user_id = request.data.get('uid')
            if not user_id:
                return Response({'error': 'uid es requerido'}, status=status.HTTP_400_BAD_REQUEST)

            password = os.urandom(8).hex()
            firebase_admin.auth.update_user(user_id, password=password)

            return Response({'message': 'Contraseña restablecida exitosamente', 'new_password': password}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request):
        id_token = request.headers.get('Authorization')
        if id_token and id_token.startswith('Bearer '):
            id_token = id_token.split('Bearer ')[1]
        else:
            return Response({'error': 'Token de autorización requerido'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            decoded_token = firebase_admin.auth.verify_id_token(id_token)
            uid = decoded_token['uid']

            if not is_admin(uid):
                return Response({'error': 'No tienes permisos de administrador'}, status=status.HTTP_403_FORBIDDEN)

            user_id = request.query_params.get('uid')
            if not user_id:
                return Response({'error': 'uid es requerido'}, status=status.HTTP_400_BAD_REQUEST)

            firebase_admin.auth.delete_user(user_id)
            firestore.collection('usuarios').document(user_id).delete()

            return Response({'message': 'Cuenta eliminada exitosamente'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
