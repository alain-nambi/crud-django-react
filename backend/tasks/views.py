from django.shortcuts import render

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import serializers

from .serializers import TaskSerializer

from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404

from .models import Task, Status


@api_view(['POST'])
def create_task(request):    
    serializer = TaskSerializer(data=request.data)
    if serializer.is_valid():
        validated_data = serializer.validated_data
        
        title = validated_data['title']
        description = validated_data['description']
        status_id = validated_data['status']
        user_id = validated_data['user']
        
        Task.objects.create(
            title=title,
            description=description,
            status=status_id,
            user=user_id
        )
        
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )
    
    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )
    
@api_view(['PUT'])
def update_task(request):
    serializer = TaskSerializer(data=request.data)
    if serializer.is_valid():
        validated_data = serializer.validated_data
        
        task_id = request.data.get('task_id')
        user_id = request.data.get('user_id')
        title = validated_data['title']
        description = validated_data['description']
        status_id = validated_data['status']
        
        task_instance = get_object_or_404(Task, id=int(task_id), user=int(user_id))
        if task_instance:
            task_instance.title = title
            task_instance.description = description
            task_instance.status = status_id
            task_instance.save()

            return Response(
                serializer.data,
                status=status.HTTP_200_OK
            )
        
        return Response(
            serializer.errors,
            status=status.HTTP_401_UNAUTHORIZED
        )
        
@api_view(['DELETE'])
def delete_task(request):
    task_id = request.data.get('task_id')
    user_id = request.data.get('user_id')
    
    task_instance = get_object_or_404(Task, id=int(task_id), user=int(user_id))
    if task_instance:
        task_instance.delete()
        
        return Response(
            {'message': f'La tâche {task_instance.title} a été supprimé avec succès'},
            status=status.HTTP_204_NO_CONTENT
        )
            

@api_view(['GET'])
def get_tasks(request):
    tasks = Task.objects.all()
    return Response(
        {'tasks' : tasks}
    )