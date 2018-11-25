from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
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


class Profile(models.Model):
	user = models.OneToOneField(User,on_delete=models.CASCADE,primary_key=True)

	fullname = models.CharField(max_length = 40,blank=True,null=True)
	COUNTRIES = tuple([(c.capitalize(), c.capitalize()) for c in COUNTRIES])
	age = models.PositiveIntegerField(blank=True,null=True)
	country = models.CharField(choices = COUNTRIES, max_length = 100,blank=True,null=True)
	education = models.CharField(max_length = 40,blank=True,null=True)
	bio = models.CharField(max_length = 200,blank=True,null=True)
	
	@property
	def name(self):
		return "profile"

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
	if created:
		Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
	instance.profile.save()