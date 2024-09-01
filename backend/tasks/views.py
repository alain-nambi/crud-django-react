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
        user_id = validated_data['user']
        
        status_instance = Status.objects.get(pk=1)
        
        Task.objects.create(
            title=title,
            description=description,
            status=status_instance,
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
    task_id = request.data.get('task_id')
    user_id = request.data.get('user_id')
    title =  request.data.get('title')
    description =  request.data.get('description')
    status_name =  request.data.get('status_name')
    
    task_instance = get_object_or_404(Task, id=int(task_id), user=int(user_id))
    status_instance = Status.objects.filter(name=status_name).first()
    
    if task_instance:
        task_instance.title = title
        task_instance.description = description
        task_instance.status = status_instance
        task_instance.save()

        return Response(
            {'message': f'{task_instance.title} a été mis à jour avec succès'},
            status=status.HTTP_200_OK
        )
    
    return Response(
       {'message': f'{task_instance.title} a été mis à jour avec succès'},
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
    return Response(
        {'message': f'Une erreur est survenue sur la suppression de la tâche {task_instance.title}'},
        status=status.HTTP_400_BAD_REQUEST
    )       

@api_view(['GET'])
def get_tasks(request):
    user_id = request.query_params.get('user_id')
    
    tasks = Task.objects.filter(user_id=user_id).all()
    serializer = TaskSerializer(tasks, many=True)
    
    return Response(serializer.data)