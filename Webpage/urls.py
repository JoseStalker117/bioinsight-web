from django.urls import path, re_path
from django.views.generic import TemplateView, RedirectView

urlpatterns = [
    path('', TemplateView.as_view(template_name='index.html'), name='mainpage'),
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html'), name='react-app')
    #re_path(r'^(?P<path>.*)$', TemplateView.as_view(template_name='mainpage.html')),
]
