from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    #path('admin/', admin.site.urls),
    path('rest/', include('rest.urls')),
    
    #NOTA: Dejar las rutas vacias al final de la lista
    path('', include('Webpage.urls')),
]
