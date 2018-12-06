from django.db import models
from django.contrib.auth.models import User
from userprofile.models import Profile
from quizzes.constants import *
# Create your models here.

## Quiz and Question models
class Quiz(models.Model):
	title = models.CharField(max_length=100)
	brief = models.TextField(max_length=200, null=True)
	rating = models.PositiveIntegerField(choices=DIFFICULTY, default=1)
	created_at = models.DateTimeField(auto_now_add=True, null = True)
	status = models.CharField(max_length=1, choices=QUIZ_STATUS, default='p')
	category = models.CharField(max_length=2, choices=CATEGORIES)
	shuffle = models.BooleanField(default=False)
	author = models.ForeignKey(User, related_name='created_quizzes', on_delete=models.CASCADE)
	likes = models.ManyToManyField(User, related_name="likes")

	@property
	def name(self):
		return "quiz"

class Question(models.Model):
	quiz = models.ForeignKey(Quiz, related_name='questions', on_delete=models.CASCADE)
	index = models.PositiveIntegerField()
	question_type = models.CharField(max_length=2, choices=QUESTION_TYPE, default='si')
	content = models.TextField()
	options = models.TextField() #json string
	matchings = models.TextField(null = True) #json string
	answer = models.TextField() #json string

	class Meta:
		unique_together = ('quiz', 'index')
		ordering = ['index']

	@property
	def name(self):
		return "question"

class UserSubmission(models.Model):
	quiz = models.ForeignKey(Quiz, related_name='submissions', on_delete=models.CASCADE)
	user = models.ForeignKey(User, related_name='submissions', on_delete=models.CASCADE)
	mark = models.FloatField(default=0.0)

	class Meta:
		unique_together = ('quiz', 'user')

class Answer(models.Model):
	submission = models.ForeignKey(UserSubmission, related_name='answers', on_delete=models.CASCADE)
	question = models.ForeignKey(Question, related_name='answers', on_delete=models.CASCADE)
	answer = models.TextField() #json string
	correct = models.BooleanField(default=False)