from django.shortcuts import get_object_or_404, render

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
        email = validated_data['email']
        username = validated_data['username']
        password = validated_data['password']
        
        # Check if email already exists
        if User.objects.filter(email=email).exists():
            return Response(
                {'email': 'This email is already in use.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create user with the validated data
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )
        
        # Create an authentication token for the user
        token = Token.objects.create(user=user)
        
        # Return the response with the token and user data
        return Response(
            {
                'token': token.key, 
                'user': serializer.data
            },
            status=status.HTTP_201_CREATED
        )
    
    # If the serializer data is invalid, return errors
    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


@api_view(['POST'])
def login(request):
    # username = request.data['username']
    email = request.data['email']
    password = request.data['password']
    
    user = get_object_or_404(User, email=email)
    if not user.check_password(password):
        return Response(
            {'user': 'missing user'},
            status=status.HTTP_404_NOT_FOUND
        )
    token, created = Token.objects.get_or_create(user=user)
    serializer = UserSerializer(user)
    
    return Response({
        'token': token.key,
        'user': serializer.data
    })