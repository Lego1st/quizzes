import json
import os
import django
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'quizzes_django_react.settings')
django.setup()

from quizzes.models import User, Quiz, Question
from quizzes.serializers import FullQuizSerializer

data = json.load(open('quizzes/fixtures/quizzes_cs.json', 'rb'))

for d in data:
	serializer = FullQuizSerializer(data=d)
	if serializer.is_valid():
		user_pool = User.objects.all()[:10]
		user = random.choice(user_pool)
		new_quiz = serializer.save(author=user)
		print("Created quiz: {}, id: {}".format(d['title'], new_quiz.id))
	else:
		print()
		print("Error data: ", json.dumps(d, indent=2))
		print("Error : ", serializer.errors)
		print()