from django.contrib import admin
from django.urls import path
from .views import is_healthy, create_user, whoami

urlpatterns = [
    path('healthy/', is_healthy, name = 'is_healthy'),
    path('register', create_user, name='create_user'),
    path('whoami/', whoami, name='whoami')
]