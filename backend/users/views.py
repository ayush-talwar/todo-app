from rest_framework import permissions, generics
from .serializers import RegisterSerializer


class RegisterView(generics.CreateAPIView):
  serializer_class = RegisterSerializer
  permission_classes = [permissions.AllowAny]
  authentication_classes = [] # ignore any tokens sent to this endpoint