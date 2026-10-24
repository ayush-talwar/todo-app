from rest_framework import viewsets, permissions

from django.db import models
from .models import Tasks
from .serializers import TaskSerializer
from django.db.models import F, Case, When

class TaskViewSet(viewsets.ModelViewSet):
  serializer_class = TaskSerializer
  permission_classes = [permissions.IsAuthenticated]
  
  def get_queryset(self):
    queryset = Tasks.objects.filter(owner = self.request.user)
    for field in ('status', 'priority', 'category'):
      value = self.request.query_params.get(field)
      if value:
        queryset = queryset.filter(**{field: value})
    ordering = self.request.query_params.get('ordering')
    if ordering == 'due_date':
      queryset = queryset.order_by(F('due_date').asc(nulls_last=True))
    elif ordering == 'priority':
      queryset = queryset.annotate(
        priority_rank = Case(
          When(priority='high', then=0),
          When(priority='medium', then=1),
          default=2,
          output_field=models.IntegerField()
        )
      ).order_by('priority_rank')
    elif ordering == 'oldest':
      queryset = queryset.order_by('created_at')
    return queryset
  
  def perform_create(self, serializer):
    serializer.save(owner = self.request.user)
