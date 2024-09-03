from datetime import datetime, timedelta
import locale

from django.utils import timezone
from django.shortcuts import get_object_or_404
from django.db.models import Q

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Task, Status
from django.contrib.auth.models import User
from .serializers import TaskSerializer


import schedule

from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags

@api_view(['POST'])
def create_task(request):    
    serializer = TaskSerializer(data=request.data)
    if serializer.is_valid():
        validated_data = serializer.validated_data
        
        title = validated_data['title']
        description = validated_data['description']
        user_id = validated_data['user']
        estimated_time = validated_data['estimated_time']
        due_date = validated_data['due_date']
        
        status_instance = Status.objects.get(pk=1)
        
        Task.objects.create(
            title=title,
            description=description,
            status=status_instance,
            user=user_id,
            estimated_time=estimated_time,
            due_date=due_date
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
    title = request.data.get('title')
    description = request.data.get('description')
    status_name = request.data.get('status_name')
    
    estimated_time = request.data.get('estimated_time')
    
    # Convert seconds to interval
    estimated_time_interval = str(timedelta(seconds=int(estimated_time)))
    
    due_date = request.data.get('due_date')
    
    task_instance = get_object_or_404(Task, id=int(task_id), user=int(user_id))
    status_instance = Status.objects.filter(name=status_name).first()
    
    if task_instance:
        task_instance.title = title
        task_instance.description = description
        task_instance.status = status_instance
        task_instance.estimated_time = estimated_time_interval
        task_instance.due_date = due_date
        task_instance.save()

        return Response(
            {'message': f'{task_instance.title} a été mis à jour avec succès'},
            status=status.HTTP_200_OK
        )
    
    return Response(
       {'message': f'Une erreur est survenue lors de la mise à jour de la tâche {task_instance.title}'},
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
            {'message': f'La tâche {task_instance.title} a été supprimée avec succès'},
            status=status.HTTP_200_OK
        )
    return Response(
        {'message': f'Une erreur est survenue lors de la suppression de la tâche {task_instance.title}'},
        status=status.HTTP_400_BAD_REQUEST
    )       

@api_view(['GET'])
def get_tasks(request):
    user_id = request.query_params.get('user_id')
    status_param = request.query_params.get('status', None)
    sort_order = request.query_params.get('sort_order', None)
    search_query = request.query_params.get('search_query', '')

    tasks = Task.objects.filter(user_id=user_id).order_by('-updated_at')

    if status_param and status_param != 'null':
        tasks = tasks.filter(status__name=status_param)

    if search_query:
        tasks = tasks.filter(Q(title__icontains=search_query) | Q(description__icontains=search_query))

    if sort_order and sort_order != 'null':
        if sort_order == "A-Z":
            tasks = tasks.order_by('title')
        elif sort_order == "Z-A":
            tasks = tasks.order_by('-title')
                
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def search_task(request):
    user_id = request.data.get('user_id')
    q_search = request.data.get('q_search', '')

    # Filter tasks based on the user_id and search query (q_search)
    tasks = Task.objects.filter(
        user_id=user_id
    ).filter(Q(title__icontains=q_search) | Q(description__icontains=q_search))

    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)

def transform_french_date(timestamp):
    locale.setlocale(locale.LC_TIME, 'fr_FR.UTF-8')
    date = datetime.fromisoformat(str(timestamp))
    return date.strftime('%-d %B %Y')

def cron_task_due_soon(user):
    tasks = Task.objects.filter(
        due_date__lte=timezone.now() + timedelta(days=1),
        status__name__in=['ongoing', 'blocked'],
        user_id=int(user.id)
    )

    status_dict = {
        'ongoing': 'En cours',
        'blocked': 'En blocage',
        'finished': 'Terminé'
    }

    for task in tasks:
        context = {
            'task_title': task.title,
            'task_description': task.description,
            'task_status': status_dict.get(task.status.name, task.status.name),
            'due_date': transform_french_date(task.due_date),
            'overdue': task.due_date < timezone.now(),
        }

        html_message = render_to_string('task_reminder_email.html', context)
        plain_message = strip_tags(html_message)
        subject = f"Rappel de tâche: {task.title}"

        try:
            send_mail(
                subject=subject,
                message=plain_message,
                from_email='alainnambi.work@gmail.com',
                recipient_list=['alainnambi.work@gmail.com', user.email],
                fail_silently=False,
                html_message=html_message,
            )
            print(f"Reminder email sent for task {task.title}")
        except Exception as e:
            print(f"Failed to send email for task {task.title}: {e}")

def cron_job():
    # Assume you have a way to get the current user. For simplicity, this example assumes all users
    users = [user for user in User.objects.all()]  # Adjust as needed
    for user in users:
        cron_task_due_soon(user)

# Schedule the job at specific times Madagascar time
schedule.every().day.at("05:00").do(cron_job)
schedule.every().day.at("08:00").do(cron_job)
schedule.every().day.at("11:00").do(cron_job)
schedule.every().day.at("14:00").do(cron_job)
schedule.every().day.at("13:53").do(cron_job)