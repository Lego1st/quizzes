from django.db import models
from django.contrib.auth.models import User
from userprofile.models import Profile
from quizzes.constants import *
# Create your models here.

<<<<<<< HEAD
=======

CATEGORIES = (
	('ma', "Math"),
	('cs', "Computer Science"),
	('lg', "Logic")
)

QUIZ_STATUS = (
	('p', 'Pending'),
	('r', 'Rejected'),
	('a', 'Approved')
)

QUESTION_TYPE = (
	('si', 'Single choice'),
	('mu', 'Multiple choice'),
	('ma', 'Matching'),
	('fi', 'Filling in the blank')
)

QUIZ_ACTIONS = (
	('li', 'like'),
	('an', 'answer')
)

>>>>>>> a3cbda573e5d6db5c2b75f1651212fd2cd24597c
## Quiz and Question models
class Quiz(models.Model):
	title = models.CharField(max_length=100)
	brief = models.TextField(max_length=200, null=True)
	rating = models.FloatField(default=0.0)
	created_at = models.DateTimeField(auto_now_add=True)
	status = models.CharField(max_length=1, choices=QUIZ_STATUS, default='p')
	category = models.CharField(max_length=2, choices=CATEGORIES)
	shuffle = models.BooleanField(default=False)
	author = models.ForeignKey(User, related_name='created_quizzes', on_delete=models.CASCADE)

class Question(models.Model):
	quiz = models.ForeignKey(Quiz, related_name='questions', on_delete=models.CASCADE)
	index = models.PositiveIntegerField()
	question_type = models.CharField(max_length=2, choices=QUESTION_TYPE, default='si')
	content = models.TextField()
	options = models.TextField() #json string
	matchings = models.TextField() #json string
	answer = models.TextField() #json string

	class Meta:
		unique_together = ('quiz', 'index')
		ordering = ['index']

class UserSubmission(models.Model):
	quiz = models.ForeignKey(Quiz, related_name='submissions', on_delete=models.CASCADE)
	user = models.ForeignKey(User, related_name='submissions', on_delete=models.CASCADE)

	class Meta:
		unique_together = ('quiz', 'user')

class Answer(models.Model):
	submission = models.ForeignKey(UserSubmission, related_name='answers', on_delete=models.CASCADE)
	question = models.ForeignKey(Question, related_name='answers', on_delete=models.CASCADE)
	answer = models.TextField() #json string