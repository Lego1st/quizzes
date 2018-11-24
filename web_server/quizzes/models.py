from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

COURSES = [
		"logic", 
		"probability", 
		"calculus",
		"geometry fundamental", 
		"computer science"
	]

COUNTRIES = [
		'Vietnam',
		'England',
		'America',
		'Japan'
	]

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

class ProfileStatistic(models.Model):
	COURSES = tuple([(c.capitalize(), c.capitalize()) for c in COURSES])
	course = models.CharField(choices = COURSES, max_length = 100)
	counter = models.PositiveIntegerField()
	rank =  models.PositiveIntegerField()

	@property
	def name(self):
		return "profilestatistic"

class User(AbstractUser):
	COUNTRIES = tuple([(c.capitalize(), c.capitalize()) for c in COUNTRIES])

	
	age = models.PositiveIntegerField(null=True)
	country = models.CharField(choices = COUNTRIES, max_length = 100,null=True)
	education = models.CharField(max_length = 40,null=True)
	bio = models.CharField(max_length = 200,null=True)

	@property
	def name(self):
		return "user"

## Quiz and Question models
class Quiz(models.Model):
	title = models.CharField(max_length=100)
	brief = models.TextField(max_length=200, null=True)
	rating = models.FloatField(default=0.0)
	created_at = models.DateTimeField(auto_now_add=True)
	status = models.CharField(max_length=1, choices=QUIZ_STATUS, default='p')
	category = models.CharField(max_length=2, choices=CATEGORIES)
	shuffle = models.BooleanField(default=False)
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