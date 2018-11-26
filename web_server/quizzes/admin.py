from django.contrib import admin
from .models import Question, Quiz

admin.site.register(Question)
admin.site.register(Quiz)
# Register your models here.

from .models import Quiz, Question, User_Action_Quiz

admin.site.register(Quiz)
admin.site.register(Question)
admin.site.register(User_Action_Quiz)
