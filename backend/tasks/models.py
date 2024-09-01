from django.db import models
from django.contrib.auth.models import User

class Status(models.Model):
    name = models.CharField(max_length=100, unique=True)
    
    def __str__(self):
        return self.name

class Task(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    status = models.ForeignKey(Status, on_delete=models.CASCADE, related_name='status', default=1)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='users', default=None)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    estimated_time = models.DurationField(blank=True, null=True)  # Assuming this is optional
    due_date = models.DateTimeField(default=None)

    def __str__(self):
        return self.title
    
