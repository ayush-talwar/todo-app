from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase
from django.urls import reverse

class RegisterAPITest(APITestCase):
  def setUp(self):
    self.url = reverse('register')
    self.valid_payload = {"username":"abc", "email":"abc@gmail.com", "password":"abcpass123"}
    
  def test_register_creates_user_with_hashed_password(self):
    res = self.client.post(self.url, self.valid_payload, format='json')
    self.assertEqual(res.status_code, status.HTTP_201_CREATED)
    user = User.objects.get(username="abc")
    self.assertNotEqual(user.password, "abcpass123")
    self.assertTrue(user.check_password('abcpass123'))
    
  def test_register_does_not_leak_password(self):
    res = self.client.post(self.url, self.valid_payload, format='json')
    self.assertNotIn('password', res.data)
  
  def test_register_rejects_duplicate_username(self):
    User.objects.create_user(username="abc", password="whatever")
    res = self.client.post(self.url, self.valid_payload, format='json')
    self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
    self.assertIn('username', res.data)
  
  def test_register_reject_short_password(self):
    payload = {**self.valid_payload, "password":"a"}
    res = self.client.post(self.url, payload, format='json')
    self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
    self.assertIn('password', res.data)
    self.assertFalse(User.objects.filter(username=payload.get("username")).exists())
  
  def test_register_works_with_stale_token(self): #register doesn't need a token to function
    self.client.credentials(HTTP_AUTHORIZATION="Bearer this-is-a-stale-token")
    res = self.client.post(self.url, self.valid_payload, format='json')
    self.assertEqual(res.status_code, status.HTTP_201_CREATED)
      
class LoginTest(APITestCase):
  def setUp(self):
    self.user = User.objects.create_user(username="abc", password="abcpass123")
    self.url = reverse('token_obtain_pair')
    self.credentials = {"username":"abc", "password":"abcpass123"}
  
  def test_login_return_access_refresh_token(self):
    res = self.client.post(self.url, self.credentials, format='json')
    self.assertEqual(res.status_code, status.HTTP_200_OK)
    self.assertIn('access', res.data)
    self.assertIn('refresh', res.data)
    
  def test_login_with_wrong_password(self):
    bad_pass = {**self.credentials, "password":"badPassword"}
    user = self.client.post(self.url, bad_pass, format='json')
    self.assertEqual(user.status_code, status.HTTP_401_UNAUTHORIZED)
    self.assertNotIn('access', user.data)
  
  def test_login_access_token_unlocks_protected_endpoints(self):
    user = self.client.post(self.url, self.credentials, format='json')
    self.assertEqual(user.status_code, status.HTTP_200_OK)
    token = user.data["access"]
    self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
    tasks = reverse('task-list')
    res = self.client.get(tasks)
    self.assertEqual(res.status_code, status.HTTP_200_OK)
    
  def test_refresh_token_returns_new_access_token(self):
    login = self.client.post(self.url, self.credentials, format='json')
    res = self.client.post(reverse('token_refresh'), {"refresh":login.data["refresh"]}, format="json")
    self.assertEqual(res.status_code, status.HTTP_200_OK)
    self.assertIn('access', res.data)