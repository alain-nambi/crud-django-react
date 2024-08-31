"""
URL configuration for todo_project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from accounts.views import signup, login, validate_token
from tasks.views import create_task, get_tasks, delete_task, update_task

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/accounts/signup/', signup, name='signup'),
    path('api/accounts/signin/', login, name='signin'),
    path('api/accounts/validate-token', validate_token, name='validate-token'),
    path('api/tasks/create', create_task, name='create-task'),
    path('api/tasks/list', get_tasks, name='task-list'),
    path('api/tasks/update', update_task, name='update-task'),
    path('api/tasks/delete', delete_task, name='delete-task'),
]
