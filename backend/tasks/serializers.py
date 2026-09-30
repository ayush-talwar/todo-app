from rest_framework import serializers
from .models import Tasks

class TaskSerializer(serializers.ModelSerializer):
  owner = serializers.ReadOnlyField(source='owner.username')
  class Meta:
    model = Tasks
    fields = '__all__'
    read_only_fields = ['id', 'owner', 'created_at', 'updated_at']