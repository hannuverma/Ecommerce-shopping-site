from logging import raiseExceptions
from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from . import serializers 
from rest_framework.response import Response
from rest_framework import status
from google.oauth2 import id_token
from google.auth.transport import requests
from .models import User
from dotenv import load_dotenv
from rest_framework_simplejwt.tokens import RefreshToken
import os

load_dotenv()

CLIENT_ID = os.getenv("CLIENT_ID")


@api_view(["GET"])
@permission_classes([AllowAny])
def is_healthy(request):
    return("The app is healthy")


@api_view(["POST"])
@permission_classes([AllowAny])
def create_user(request):
    serializer = serializers.UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
@permission_classes([AllowAny])
def google_login(request):
    token = request.data.get("token")

    try:
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), CLIENT_ID)
        email = idinfo['email']
        name = idinfo.get('name', email.split('@')[0]) # Fallback for name
        avatar = idinfo.get('picture')


        user, created = User.objects.get_or_create(
            email=email, 
            defaults={
                'username': name,
                'avatar': avatar 
            }
        )
        if not user.is_active:
            return Response({"detail": "Account disabled"}, status=403)

        # Optional: Update the avatar if the user already existed
        if not created and avatar:
            user.avatar = avatar
            user.save()

        refresh = RefreshToken.for_user(user)
        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh)
        })

    except ValueError:
        return Response({"error": "Invalid token"}, status=400)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def whoami(request):
    serializer = serializers.UserSerializer(request.user)
    return Response(serializer.data, status = status.HTTP_200_OK)

