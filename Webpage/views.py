from django.shortcuts import render
from django.http import HttpResponse

def index(request):
    return HttpResponse("<h1>Página de prueba</h1><p>¡Hola! Esta es una página de prueba usando Django.</p>")