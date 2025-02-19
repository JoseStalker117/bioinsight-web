from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import pyrebase


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


# Vistas o REST APIS
def prueba(request):
    return HttpResponse("<h1>Página de prueba</h1><p>¡Hola! Esta es una página de prueba usando Django.</p>")


def test(request):
    return render(request, 'front-test.html')


class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({'error': 'Email y contraseña son requeridos'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = auth.sign_in_with_email_and_password(email, password)
            return Response({'idToken': user['idToken']}, status=status.HTTP_200_OK)
        except Exception as e:
            print('Error al iniciar sesión:', e)
            return Response({'error': 'Credenciales inválidas'}, status=status.HTTP_401_UNAUTHORIZED)
