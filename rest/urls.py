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
    path('form', Form.as_view(), name='Formulario'),
    path('getprofile', GetProfile.as_view(), name='GetProfile'),
    path('updateprofile', UpdateProfile.as_view(), name='UpdateProfile'),
    path('reset-password', ResetPassword.as_view(), name='ResetPassword'),
    path('resend-email', ResendEmail.as_view(), name='ResendEmail'),
    path('logout', Logout.as_view(), name='Logout'),
    path('delete-account', DeleteAccount.as_view(), name='DeleteAccount'),
    path('link-oauth', LinkOAuth.as_view(), name='LinkOAuth'),
    path('unlink-oauth', UnlinkOAuth.as_view(), name='UnlinkOAuth'),
    path('rtd', RTD.as_view(), name='RTD Crud'),
]