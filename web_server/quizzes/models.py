from django.db import models
from django.contrib.auth.models import User
# Create your models here.


CATEGORIES = (
	('ma', "Math"),
	('cs', "Computer Science")
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

## Quiz and Question models
class Quiz(models.Model):
	title = models.CharField(max_length=100)
	brief = models.TextField(max_length=200, null=True)
	rating = models.FloatField(default=0.0)
	created_at = models.DateTimeField(auto_now_add=True)
	status = models.CharField(max_length=1, choices=QUIZ_STATUS, default='p')
	category = models.CharField(max_length=2, choices=CATEGORIES)
	shuffle = models.BooleanField(default=False)
	author = models.ForeignKey(User, on_delete=models.CASCADE)
	#author = ....

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

class User_Action_Quiz(models.Model):
	quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	action = models.CharField(max_length=2, choices=QUIZ_ACTIONS)
	class Meta:
		unique_together = ("quiz", "user", "action")
		