from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    email = serializers.EmailField(required=True)  # Ensure email is required
    username = serializers.CharField(required=True)  # Ensure username is required
    
    class Meta(object):
        model = User
        fields = [
            'id',
            'username',
            'email',
            'password'
        ]