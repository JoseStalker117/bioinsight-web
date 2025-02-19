from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import pyrebase
import json


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
storage = firebase.storage()


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
                httponly=False,  # La cookie será accesible desde JavaScript
                secure=False,    # La cookie se enviará a través de HTTP (no HTTPS)
                samesite='Lax'   # Opcional: ayuda a prevenir ataques CSRF
            )
            return response
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)


class Querry(APIView):
    def get(self, request):
        id_token = request.COOKIES.get('idToken')

        if not id_token:
            return Response({'error': 'Token de autorización requerido'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Realiza la consulta a la base de datos
            data = firebase.database().get(id_token)  # Cambia "Modbus" por el nombre de tu colección
            return Response(data.val(), status=status.HTTP_200_OK)
        except Exception as e:
            print('Error al consultar la base de datos:', e)
            return Response({'error': 'Error al consultar la base de datos'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)