import pytest
from django.contrib.auth.models import User
from rest_framework.test import APIClient

@pytest.fixture
def api_client():
  return APIClient()

@pytest.fixture
def alice(db):
  return User.objects.create_user(username="alice", password="alicepass")

@pytest.fixture
def bob(db):
  return User.objects.create_user(username="bob", password="bobpass")

@pytest.fixture
def alice_client(api_client, alice):
  api_client.force_authenticate(user=alice)
  return api_client