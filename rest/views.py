from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import pyrebase
import firebase_admin
from firebase_admin import credentials, firestore, auth
import json, datetime
import os
import pytz #Timezone
from datetime import datetime  # Asegúrate de importar datetime


# Pyrebase backend
firebaseConfig = {
    "apiKey": "AIzaSyCzw2DUuvxuSRya3RMOFvI4vpyM9leqiwU",
    "authDomain": "bioinsight23.firebaseapp.com",
    "databaseURL": "https://bioinsight23-default-rtdb.firebaseio.com",
    "projectId": "bioinsight23",
    "storageBucket": "bioinsight23.firebasestorage.app",
    "messagingSenderId": "24544560116",
    "appId": "1:24544560116:web:2c108cb5e57f9f9356afa1"
}
firebase = pyrebase.initialize_app(firebaseConfig)

auth = firebase.auth()
database = firebase.database()

# Firebase Admin API
cred = credentials.Certificate(os.path.join(os.path.dirname(__file__), 'bioinsight23-firebase-adminsdk-fpdim-54783964e6.json'))
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
            id_token = user['idToken']  # Obtén el idToken

            # Establece la cookie sin HttpOnly y Secure
            response = Response({'message': 'Login exitoso', 'idToken': id_token}, status=status.HTTP_200_OK)
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

        # Verifica que se hayan proporcionado todos los datos requeridos
        if not nombre or not apellidos or not username or not password:
            return Response({'error': 'Todos los campos son requeridos'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Registra al nuevo usuario con Pyrebase
            email = username + "@bioinsight.com"
            user = auth.create_user_with_email_and_password(email, password)

            user_id = user['localId']
            
            user_data = {
                'nombre': nombre,
                'apellidos': apellidos,
                'username': username,
                'creationdate': datetime.datetime.now(pytz.timezone('America/Mexico_City')),# Ajusta a la zona horaria -6
                'admin': False,
                'foto': 0
            }
            firestore.collection('usuarios').document(user_id).set(user_data)  # Asegúrate de que esto sea correcto

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
            # Realiza la consulta a la base de datos
            data = firebase.database().get(id_token)
            return Response(data.val(), status=status.HTTP_200_OK)
        except Exception as e:
            print('Error al consultar la base de datos:', e)
            return Response({'error': 'Error al consultar la base de datos'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class Form(APIView):
    def post(self, request):
        nombre = request.data.get('nombre')
        email = request.data.get('email')
        mensaje = request.data.get('mensaje')

        # Verifica que se hayan proporcionado todos los datos requeridos
        if not nombre or not email or not mensaje:
            return Response({'error': 'Todos los campos son requeridos'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Crea un documento en la colección "contacto"
            contacto_data = {
                'nombre': nombre,
                'email': email,
                'mensaje': mensaje,
                'fecha': datetime.datetime.now(pytz.timezone('America/Mexico_City'))
            }
            firestore.collection('contacto').add(contacto_data)  # Agrega el documento a Firestore

            return Response({'message': 'Mensaje enviado exitosamente'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        
class UpdateProfile(APIView):
    def put(self, request):
        id_token = request.COOKIES.get('idToken')

        if not id_token:
            return Response({'error': 'Token de autorización requerido'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Verifica el token y obtiene el uid del usuario
            decoded_token = firebase_admin.auth.verify_id_token(id_token)
            user_id = decoded_token['uid']

            # Obtiene los nuevos datos del perfil
            nombre = request.data.get('nombre')
            apellidos = request.data.get('apellidos')
            foto = request.data.get('foto')  # Nueva clave para la foto

            # Convierte la clave foto a un tipo de dato numérico, si es posible
            if foto is not None:
                try:
                    foto = int(foto)  # Asegúrate de que foto sea un número entero
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
            # Verifica el token y obtiene el uid del usuario
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

