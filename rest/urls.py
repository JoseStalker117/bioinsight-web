from django.urls import path, re_path
from django.views.generic import TemplateView, RedirectView
from .views import *

urlpatterns = [
    #REST API
    path('login', Login.as_view(), name='login'),
    path('modbus', Querry.as_view(), name='modbus'),
    path('test', test, name='prueba')
]