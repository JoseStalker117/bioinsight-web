from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    #path('admin/', admin.site.urls),
    path('web/', include('Webpage.urls')),
    path('rest/', include('rest.urls')),
]
