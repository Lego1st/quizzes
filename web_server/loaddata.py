import json
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'quizzes_django_react.settings')
django.setup()

from quizzes.models import User, Quiz, Question

data = json.load(open('quizzes/fixtures/quizzes.json', 'rb'))

for d in data * 10:
	new_quiz = Quiz.objects.create(
									title = d['title'],
									brief = d['brief'],
									category = d['category'],
									author = User.objects.get(id = 1))
	new_quiz.save()

	filt = lambda x: str([str(i).replace("'", " ") for i in x]).replace("'", '"')
	questions = d['questions']
	for q in questions:

		new_quest = Question.objects.create(
											content = q['content'],
											index = q['index'],
											question_type = q['type'],
											quiz = new_quiz,
											options = filt(q['options']),
											answer = filt(q['answer']),
											matchings = filt(q['matchings']))
		new_quest.save()

	print("Created quiz: {}, id: {}".format(d['title'], new_quiz.id))