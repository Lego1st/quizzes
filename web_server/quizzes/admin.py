from django.contrib import admin

# Register your models here.

from .models import Quiz, Question, User_Action_Quiz

admin.site.register(Quiz)
admin.site.register(Question)
admin.site.register(User_Action_Quiz)
