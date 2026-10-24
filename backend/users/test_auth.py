import pytest
from django.urls import reverse
from rest_framework import status
from django.contrib.auth.models import User

pytestmark = pytest.mark.django_db

#Register Tests

def test_register_user_with_hashed_password(api_client):
  payload = {"username":"alice", "email":"abc@gmail.com", "password":"alicepass123"}
  new_user = api_client.post(reverse('register'), payload, format='json')
  assert new_user.status_code == status.HTTP_201_CREATED
  user = User.objects.get(username="alice")
  assert user.password != "alicepass123"
  assert user.check_password('alicepass123')
  
def test_password_not_leak_in_response(api_client):
  payload = {"username":"alice", "email":"abc@gmail.com", "password":"alicepass123"}
  new_user = api_client.post(reverse('register'), payload, format='json')
  assert 'password' not in new_user.data
  
def test_rejects_duplicate_username(api_client, alice):
  payload = {"username":"alice", "email":"abc@gmail.com", "password":"newpass123"}
  url = reverse('register')
  new_user = api_client.post(url, payload, format='json')
  assert new_user.status_code == status.HTTP_400_BAD_REQUEST
  assert "username" in new_user.data
  assert User.objects.filter(username="alice").count() == 1
  alice.refresh_from_db()
  assert alice.check_password("alicepass")
  
def test_register_with_small_password(api_client):
  payload = {"username":"new", "password":"ab"}
  url = reverse("register")
  res = api_client.post(url, payload, format='json')
  assert res.status_code == status.HTTP_400_BAD_REQUEST
  assert "password" in res.data
  assert not User.objects.filter(username="new")
  
def test_register_works_with_stale_token(api_client):
  api_client.credentials(HTTP_AUTHORIZATION='Bearer stale-token')
  payload = {"username":"new", "password":"newpass123", "email":"testmal@gmail.com"}
  url = reverse("register")
  res = api_client.post(url, payload, format='json')
  assert res.status_code == status.HTTP_201_CREATED
  
#Login Tests
CREDENTIALS ={"username":"abc", "password":"abcpass123"}
ALICE_LOGIN = {"username":"alice", "password":"alicepass"}
LOGIN_URL = "token_obtain_pair"
REFRESH_URL = "token_refresh"

def test_login_returns_access_refresh_tokens(api_client, alice):
  res = api_client.post(reverse(LOGIN_URL), ALICE_LOGIN, format='json')
  assert res.status_code == status.HTTP_200_OK
  assert 'access' in res.data
  assert 'refresh' in res.data
  
def test_login_with_wrong_password(api_client, alice):
  credentials = {**ALICE_LOGIN, "password":"wrong"}
  res = api_client.post(reverse(LOGIN_URL), credentials, format='json')
  assert res.status_code == status.HTTP_401_UNAUTHORIZED
  assert 'access' not in res.data
  assert 'refresh' not in res.data
  
def test_login_access_token_unlocks_protected_endpoints(api_client, alice):
  res = api_client.post(reverse(LOGIN_URL), ALICE_LOGIN, format='json')
  assert res.status_code == status.HTTP_200_OK
  access_token = res.data["access"]
  api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
  tasks_url = reverse('task-list')
  tasks = api_client.get(tasks_url)
  assert tasks.status_code == status.HTTP_200_OK
  
def test_refresh_endpoint_returns_new_access_token(api_client, alice):
  alice_login = api_client.post(reverse(LOGIN_URL), ALICE_LOGIN, format='json')
  assert alice_login.status_code == status.HTTP_200_OK
  refresh_token = alice_login.data["refresh"]
  res = api_client.post(reverse(REFRESH_URL), {"refresh":refresh_token}, format='json')
  assert res.status_code == status.HTTP_200_OK
  assert 'access' in res.data