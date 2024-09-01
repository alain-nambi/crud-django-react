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
                {'message': 'Cet adresse e-mail est déjà utilisé'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
         # Check if email already exists
        if User.objects.filter(username=username).exists():
            return Response(
                {'message': 'Cette utilisateur est déjà utilisé.'},
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
                'user': serializer.data,
                'message': f'Utilisateur {user.username} a été créé avec succès'
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
    
@api_view(['POST'])
def validate_token(request):
    token_key = request.data.get('token')
    user = request.data.get('user')
    
    print(token_key, user)
    
    if not token_key:
        return Response({"detail": "Token is missing"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Check if the token exists in the database
        token = Token.objects.filter(key=token_key, user=user['id']).first()
        if not token:
            return Response({"detail": "Invalide token"}, status=status.HTTP_401_UNAUTHORIZED)
        return Response({"detail": "Token is valid"}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"detail": "Invalid token or error occurred"}, status=status.HTTP_401_UNAUTHORIZED)