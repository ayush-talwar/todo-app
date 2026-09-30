from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Tasks(models.Model):
  STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
    ]
  PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]
  owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tasks")
  title = models.CharField(max_length=250)
  description = models.TextField(blank=True)
  status = models.CharField(max_length=10,choices=STATUS_CHOICES, default="pending")
  priority = models.CharField(max_length=7, choices=PRIORITY_CHOICES, default="medium")
  category = models.CharField(max_length=100, blank=True)
  due_date = models.DateTimeField(blank=True, null=True)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)
  
  class Meta:
    ordering = ['-created_at']
    
  def __str__(self):
    return self.title
