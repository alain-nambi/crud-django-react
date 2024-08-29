from django.shortcuts import render

# Create your views here.
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework import serializers

from .serializers import UserSerializer
from django.contrib.auth.models import User

@api_view(['POST'])
def signup(request):
    serializer = UserSerializer(data=request.data)
    
    # Validate the serializer data
    if serializer.is_valid():
        validated_data = serializer.validated_data
        
        # Check if email already exists
        if User.objects.filter(email=validated_data['email']).exists():
            return Response(
                {'email': 'This email is already in use.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create user with the validated data
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        
        # Create an authentication token for the user
        token = Token.objects.create(user=user)
        
        # Return the response with the token and user data
        return Response(
            {'token': token.key, 'user': serializer.data},
            status=status.HTTP_201_CREATED
        )
    
    # If the serializer data is invalid, return errors
    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )
