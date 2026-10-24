from django.contrib.auth.models import User
from rest_framework import status
from django.urls import reverse
from rest_framework.test import APITestCase
from .models import Tasks
from datetime import date, timedelta

# Create your tests here.
class TaskAPITest(APITestCase):
  def setUp(self):
    #runs before every test method, so each test starts fresh
    self.alice = User.objects.create_user(username="alice", password="alicepass123")
    self.bob =  User.objects.create_user(username="bob", password="bobpass123")
    self.list_url = reverse('task-list')
    self.client.force_authenticate(user=self.alice)
    
  def test_unauthenticated_request_is_rejected(self):
    self.client.force_authenticate(user=None) #log out
    response = self.client.get(self.list_url)
    self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
  def test_task_created_belongs_to_logged_in_user(self):
    response = self.client.post( self.list_url, {'title': 'Buy milk', 'priority': 'high'}, format='json')
    self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    task = Tasks.objects.get()
    self.assertEqual(task.owner, self.alice)
    self.assertEqual(response.data['owner'], 'alice')
    
  def test_client_cannot_choose_the_owner(self):
    response = self.client.post(self.list_url, {'title':'sneaky one', 'owner':'bob'}, format='json')
    self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    self.assertEqual(Tasks.objects.get().owner, self.alice)
    
  def test_list_only_returns_own_task(self):
    Tasks.objects.create(title='Alice task', owner=self.alice)
    Tasks.objects.create(title='Bob task', owner=self.bob)
    response = self.client.get(self.list_url)
    self.assertEqual(response.status_code, status.HTTP_200_OK)
    titles = [task['title'] for task in response.data]
    self.assertEqual(titles, ['Alice task'])
  
  def test_cannot_access_other_user_tasks(self):  
    bobs_task = Tasks.objects.create(owner=self.bob, title="Bob's private task")
    url = reverse('task-detail', args=[bobs_task.id])
    self.assertEqual(self.client.get(url).status_code, status.HTTP_404_NOT_FOUND)
    self.assertEqual(self.client.patch(url,{'title':'hacked'}, format='json').status_code, 
    status.HTTP_404_NOT_FOUND)
    self.assertEqual(self.client.delete(url).status_code, status.HTTP_404_NOT_FOUND)
    bobs_task.refresh_from_db() # reload from db to prove nothing changed
    self.assertEqual(bobs_task.title, "Bob's private task")
    
class TaskFilterAndOrderingAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="alice", password="alicepass")
        self.other = User.objects.create_user(username="bob", password="bobpass")
        self.client.force_authenticate(user=self.user)
        self.url = reverse("task-list")

        today = date.today()
        # Alice's tasks, created in this order
        Tasks.objects.create(
            owner=self.user, title="pay rent", priority="high", category="home",
            status="pending", due_date=today + timedelta(days=5),
        )
        Tasks.objects.create(
            owner=self.user, title="write report", priority="medium", category="work",
            status="completed", due_date=today + timedelta(days=1),
        )
        Tasks.objects.create(
            owner=self.user, title="water plants", priority="low", category="home",
            status="pending", due_date=None,
        )
        # Bob's task
        Tasks.objects.create(
            owner=self.other, title="Bob Task", priority="high", category="home",
            status="pending",
        )

    def titles(self, **params):
        res = self.client.get(self.url, params)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        return [task["title"] for task in res.data]

    # filtering
    def test_filter_by_status(self):
        self.assertCountEqual(self.titles(status="pending"), ["pay rent", "water plants"])
        self.assertEqual(self.titles(status="completed"), ["write report"])

    def test_filter_by_priority(self):
        self.assertEqual(self.titles(priority="high"), ["pay rent"])

    def test_filter_by_category(self):
        self.assertCountEqual(self.titles(category="home"), ["pay rent", "water plants"])

    def test_filters_combine(self):
        result = self.titles(priority="high", category="home", status="pending")
        self.assertEqual(result, ["pay rent"])

    def test_filters_not_leak_other_user_tasks(self):
        self.assertNotIn("Bob Task", self.titles(priority="high"))
        self.assertNotIn("Bob Task", self.titles(category="home"))

    def test_filter_with_invalid_parameter(self):
        self.assertEqual(self.titles(status="alshfoiaewt"), [])

    def test_query_params_outside_whitelist_are_ignored(self):
        res = self.titles(owner="bob")
        self.assertCountEqual(res, ["pay rent", "write report", "water plants"])

    # ordering
    def test_order_by_due_dates_soonest_first_and_missing_last(self):
        res = self.titles(ordering="due_date")
        self.assertEqual(res, ["write report", "pay rent", "water plants"])

    def test_order_by_priority(self):  # high -> medium -> low
        res = self.titles(ordering="priority")
        self.assertEqual(res, ["pay rent", "write report", "water plants"])

    def test_ordering_default_newest_first_oldest_reverses_it(self):
        self.assertEqual(self.titles(), ["water plants", "write report", "pay rent"])
        self.assertEqual(self.titles(ordering="oldest"), ["pay rent", "write report", "water plants"])

    def test_unknown_ordering_falls_back_to_default(self):
        self.assertEqual(self.titles(ordering="bogus"), ["water plants", "write report", "pay rent"])