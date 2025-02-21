from django.urls import path, re_path
from django.views.generic import TemplateView, RedirectView
from .views import *

urlpatterns = [
    #Vista de pruebas
    path('test', test, name='Testpage'),
    
    #REST API
    path('login', Login.as_view(), name='Login'),
    path('querry', Querry.as_view(), name='Querry'),
    path('register', Register.as_view(), name='Registro'),
    path('contacto', Form.as_view(), name='Formulario'),
    path('getprofile', GetProfile.as_view(), name='GetProfile'),
    path('updateprofile', UpdateProfile.as_view(), name='UpdateProfile'),
]