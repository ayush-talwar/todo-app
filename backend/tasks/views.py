from rest_framework import viewsets, permissions
from .models import Tasks
from .serializers import TaskSerializer

class TaskViewSet(viewsets.ModelViewSet):
  serializer_class = TaskSerializer
  permission_classes = [permissions.IsAuthenticated]
  
  def get_queryset(self):
    queryset = Tasks.objects.filter(owner = self.request.user)
    #status based filter query
    status_param = self.request.query_params.get('status')
    if status_param:
      queyrset = Tasks.objects.filter(status = status_param)
    priority_param = self.request.query_params.get('priority')
    if priority_param:
      queryset = Tasks.objects.filter(priority = priority_param)
    return queryset
  
  def perform_create(self, serializer):
    serializer.save(owner = self.request.user)
