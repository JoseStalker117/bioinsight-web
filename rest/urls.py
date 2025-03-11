from django.urls import path, re_path
from django.views.generic import TemplateView, RedirectView
from .views import *

urlpatterns = [
    # Vista de pruebas
    path('test', test, name='Testpage'),
    
    # REST API
    path('login', Login.as_view(), name='Login'),
    path('querry', Querry.as_view(), name='Querry'),
    path('register', Register.as_view(), name='Registro'),
    path('form', Form.as_view(), name='Formulario'),
    path('get-profile', GetProfile.as_view(), name='Get-Profile'),
    path('update-profile', UpdateProfile.as_view(), name='Update-Profile'),
    path('reset-password', ResetPassword.as_view(), name='Reset-Password'),
    path('resend-email', ResendEmail.as_view(), name='Resend-Email'),
    path('logout', Logout.as_view(), name='Logout'),
    path('delete-account', DeleteAccount.as_view(), name='Delete-Account'),
    path('link-oauth', LinkOAuth.as_view(), name='Link-OAuth'),
    path('unlink-oauth', UnlinkOAuth.as_view(), name='Unlink-OAuth'),
    path('rtd', DatabaseRTD.as_view(), name='RTD-Crud'),
    path('change-password', ChangePassword.as_view(), name='Change-Password'),
    path('refresh-token', RefreshToken.as_view(), name='Refresh-Token'),
    path('oauth-login', OAuthLogin.as_view(), name='OAuth-Login'),
    path('oauth-register', OAuthRegister.as_view(), name='OAuth-Register'),
    path('isadmin', CheckAdmin.as_view(), name='Is-Admin'),
    path('admin-adduser', Admin_AddUser.as_view(), name='Admin-AddUser'),
    path('admin-buzon', Admin_Buzon.as_view(), name='Admin-Buzon'),
    path('admin-usuarios', Admin_Usuarios.as_view(), name='Admin-Usuarios'),
    path('admin-restore', Admin_Restore.as_view(), name='Admin-Restore'),
    
    # >>> URLS de Luis xddd <<<
    path('modbusdata', ModbusData.as_view(), name='ModbusData'),
    path('modulo1', Modulo1.as_view(), name='Modulo1'),
    path('modulo2', Modulo2.as_view(), name='Modulo2'),
    # >>> URLS de Luis xddd <<<
]