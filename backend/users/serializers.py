from rest_framework import serializers
from django.contrib.auth.models import User


class RegisterSerializer(serializers.ModelSerializer):
  password = serializers.CharField(write_only=True, min_length=8) #accept passowrd in request but don't send in the response that's why write_only
  
  class Meta:
    model = User
    fields = ['id', 'username', 'email', 'password']
    
  def create(self, validated_date):
    user = User.objects.create_user(
      username = validated_date["username"],
      email = validated_date["email"],
      password=validated_date["password"] #hashes the password
    )
    return user