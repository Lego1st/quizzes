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

CATEGORIES = [
		
]

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
