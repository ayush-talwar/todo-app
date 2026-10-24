from datetime import date, timedelta
import pytest
from django.urls import reverse
from rest_framework import status
from .models import Tasks

pytestmark = pytest.mark.django_db #every test in this file may use the database

def test_unauthenticated_request_is_rejected(api_client):
  res = api_client.get(reverse('task-list'))
  assert res.status_code == status.HTTP_401_UNAUTHORIZED
  
def test_create_task_sets_owner_to_logged_user(alice_client, alice):
  res = alice_client.post(reverse('task-list'),{'title':'Buy Milk', 'priority':'high'}, fomrat='json')
  assert res.status_code == status.HTTP_201_CREATED
  assert Tasks.objects.get().owner == alice
  assert res.data["owner"] == 'alice'
  
def test_list_only_returns_own_tasks(alice_client, alice, bob):
  Tasks.objects.create(owner=alice, title="alice's new task")
  Tasks.objects.create(owner=bob, title="bob's new task")
  res = alice_client.get(reverse('task-list'))
  assert [task['title'] for task in res.data] == ["alice's new task"]
  
def test_cannot_modify_another_user_tasks(alice_client, bob):
  bobs_task = Tasks.objects.create(owner=bob, title="bob task 2")
  url = reverse('task-detail', args=[bobs_task.id])
  
  assert alice_client.get(url).status_code == status.HTTP_404_NOT_FOUND
  assert alice_client.patch(url, {"title":"hacked"}, format='json').status_code == status.HTTP_404_NOT_FOUND
  assert alice_client.delete(url).status_code == status.HTTP_404_NOT_FOUND 
  
  bobs_task.refresh_from_db()
  assert bobs_task.title == 'bob task 2'
  
@pytest.fixture
def filter_tasks(alice, bob):
  today = date.today()
  Tasks.objects.create(owner=alice, title='pay rent', priority='high', category='home',
                      status='pending', due_date=today + timedelta(days=5))
  Tasks.objects.create(owner=alice, title='write report', priority='medium', category='work',
                      status='completed', due_date=today + timedelta(days=1))
  Tasks.objects.create(owner=alice, title='water plants', priority='low', category='home',
                      status='pending', due_date=None)
  Tasks.objects.create(owner=bob, title='Bob Task', priority='high', category='home',
                      status='pending')
  
@pytest.mark.parametrize('params, expected', [
    ({'status': 'pending'}, ['pay rent', 'water plants']),
    ({'status': 'completed'}, ['write report']),
    ({'priority': 'high'}, ['pay rent']),
    ({'category': 'home'}, ['pay rent', 'water plants']),
    ({'priority': 'high', 'category': 'home', 'status': 'pending'}, ['pay rent']),
    ({'status': 'nonsense'}, []),
    ({'owner': 'bob'}, ['pay rent', 'water plants', 'write report']),  # not whitelisted: ignored
])

def test_filters(alice_client, filter_tasks, params, expected):
  res = alice_client.get(reverse('task-list'), params)
  assert sorted([task["title"] for task in res.data]) == sorted(expected)
  
@pytest.mark.parametrize('ordering, expected', [
    ('due_date', ['write report', 'pay rent', 'water plants']),
    ('priority', ['pay rent', 'write report', 'water plants']),
    ('oldest', ['pay rent', 'write report', 'water plants']),
    ('', ['water plants', 'write report', 'pay rent']),      # default: newest first
    ('bogus', ['water plants', 'write report', 'pay rent']),  # unknown value: falls back to default
])
def test_ordering(alice_client, filter_tasks, ordering, expected):
    response = alice_client.get(reverse('task-list'), {'ordering': ordering})
    assert [task['title'] for task in response.data] == expected
