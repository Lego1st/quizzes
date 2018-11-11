from django.db import models

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

class User(models.Model):
	COUNTRIES = tuple([(c.capitalize(), c.capitalize()) for c in COUNTRIES])

	userName = models.CharField(max_length = 40)
	fullName = models.CharField(max_length = 40)
	age = models.PositiveIntegerField()
	country = models.CharField(choices = COUNTRIES, max_length = 100)
	education = models.CharField(max_length = 40)
	bio = models.CharField(max_length = 200)

	@property
	def name(self):
		return "user"
