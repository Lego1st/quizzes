from rest_framework import serializers
from quizzes.models import *
from userprofile.serializers import PSSerializer
from rest_framework_jwt.settings import api_settings
import json
from random import shuffle
from quizzes.constants import *


## Quiz and Question serializers
class BriefQuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        exclude = ('shuffle',)

    def to_representation(self, obj):
        ret = super().to_representation(obj)
        author_id = ret['author']
        author_username = User.objects.get(pk=author_id).username
        ret['author'] = author_username
        return ret


class QuestionReadOnlySerializer(serializers.BaseSerializer):
    
    def to_representation(self, obj):
        output = {
            'index': obj.index,
            'type': obj.question_type,
            'content': obj.content,
            'options': json.loads(obj.options)
        }
        if obj.question_type == 'ma':
            output['matchings'] = json.loads(obj.matchings)

        return output

class QuestionAndQuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ('quiz', 'index', 'question_type', 'options', 'content', 'matchings', 'answer')
    
    def to_representation(self, obj):
        ret = super().to_representation(obj)
        output = {
            'index': obj.index,
            'type': obj.question_type,
            'content': obj.content,
            'options': json.loads(obj.options),
            'quiz_id': Quiz.objects.get(id=ret['quiz']).id,
            'quiz_brief': Quiz.objects.get(id=ret['quiz']).brief,
            'quiz_title': Quiz.objects.get(id=ret['quiz']).title,
            'quiz_rating': Quiz.objects.get(id=ret['quiz']).rating,
            'quiz_status': Quiz.objects.get(id=ret['quiz']).status,
            'quiz_category': Quiz.objects.get(id=ret['quiz']).category
        }
        if obj.question_type == 'ma':
            output['matchings'] = json.loads(obj.matchings)

        return output

class QuizQuestionReadOnlySerializer(serializers.ModelSerializer):
    questions = QuestionReadOnlySerializer(many=True, read_only=True)

    class Meta:
        model = Quiz
        fields = ('id' ,'title', 'brief', 'category', 'shuffle', 'questions', 'author')
    def to_representation(self, obj):
        ret = super().to_representation(obj)
        author_id = ret['author']
        author_username = User.objects.get(pk=author_id).username
        ret['author'] = author_username
        return ret

class FullQuestionSerializer(serializers.BaseSerializer):

    def to_internal_value(self, data):
        QUESTION_TYPE = {
            'si': {'max_option': 7, 'min_option': 2, 'full_name': 'Single choice'},
            'mu': {'max_option': 20, 'min_option': 3, 'full_name': 'Multiple choice'},
            'ma': {'max_option': 20, 'min_option': 2, 'full_name': 'Matching'},
            'fi': {'max_option': 0, 'min_option': 0, 'full_name': 'Filling in the blank'}
        }
        def _validate(logic, message):
            if not logic:
                raise serializers.ValidationError(message)
        
        index = str(data.get('index', ''))
        question_type = data.get('type')
        content = data.get('content')
        options = data.get('options')
        matchings = data.get('matchings')
        answer = data.get('answer')
        # print(options)

        # validate fields
        _validate(index, {'index': 'This field is required.'})
        _validate(question_type, {'type|question index: {}'.format(index): 'This field is required.'})
        _validate(content, {'content|question index: {}'.format(index): 'This field is required.'})
        _validate(answer, {'answer|question index: {}'.format(index): 'This field is required.'})
        _validate(type(answer) == list, {'answer|question index: {}'.format(index): 'This field must be a list.'})
        if question_type == 'ma':
            _validate(matchings, {'matchings|question index: {}'.format(index): 'This field is required in matching question.'})
            _validate(type(matchings), {'matchings|question index: {}'.format(index): 'This field must be a list'})

        # validate fields length
        if question_type != 'fi':
            _validate(options, {'options|question index: {}'.format(index): 'This field is required.'})
            _validate(type(options) == list, {'options|question index: {}'.format(index): 'This field must be a list.'})
            min_option_len = QUESTION_TYPE[question_type]['min_option']
            max_option_len = QUESTION_TYPE[question_type]['max_option']
            question_name = QUESTION_TYPE[question_type]['full_name']
            _validate(
                len(options) >= min_option_len, 
                {'options|question index: {}'.format(index): '{} question needs at least {} options'.format(question_name, min_option_len)}
            )
            _validate(
                len(options) <= max_option_len,
                {'options|question index: {}'.format(index): '{} question limits to {} options'.format(question_name, max_option_len)}
            )

        if question_type == 'ma':
            _validate(
                len(options) == len(matchings) == len(answer), 
                {'options, matchings, answer|question index: {}'.format(index): 'These fields must have the same length in matching question'}
            )
            for a in answer:
                _validate(a in options, {'answer|question index: {}'.format(index): 'answer does not match options'})
        
        if question_type == 'si':
            _validate(len(answer) == 1, {'answer|question index: {}'.format(index): 'This field must have one item in single choice question'})
            _validate(answer[0] in options, {'answer|question index: {}'.format(index): 'answer does not match options'})
        
        if question_type == 'mu':
            _validate(len(answer) <= len(options), {'answer, options|question index: {}'.format(index): "answer's length must be equal or smaller than options' multiple choice question"}) 
            for a in answer:
                _validate(a in options, {'answer|question index: {}'.format(index): 'answer does not match options'})

        output = {
            'index': int(index),
            'question_type': question_type,
            'content': content,
            'options': json.dumps(options).replace("'", '"') ,
            'answer': json.dumps(answer).replace("'", '"')
        }
        if question_type == 'ma':
            output['matchings'] = json.dumps(matchings)
            shuffle(options)
            output['options'] = json.dumps(options)

        return output

    def to_representation(self, obj):
        output = {
            'index': obj.index,
            'type': obj.question_type,
            'content': obj.content,
            'options': json.loads(obj.options),
            'answer': json.loads(obj.answer)
        }
        if obj.question_type == 'ma':
            output['matchings'] = json.loads(obj.matchings)

        return output

class FullQuizSerializer(serializers.ModelSerializer):
    questions = FullQuestionSerializer(many=True)

    class Meta:
        model = Quiz
        fields = ('id' ,'title', 'brief', 'category', 'shuffle', 'questions')

    def create(self, validated_data):
        questions_data = validated_data.pop('questions')
        quiz = Quiz.objects.create(**validated_data)
        for question_data in questions_data:
            Question.objects.create(quiz=quiz, **question_data)
        return quiz

    def update(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        instance.brief = validated_data.get('brief', instance.brief)
        instance.category = validated_data.get('category', instance.category)
        instance.shuffle = validated_data.get('shuffle', instance.shuffle)
        instance.save()
        
        quiz_id = instance.id
        quiz = Quiz.objects.get(pk=quiz_id)
        Question.objects.filter(quiz=quiz).delete()
        questions_data = validated_data.pop('questions')
        for question_data in questions_data:
            Question.objects.create(quiz=quiz, **question_data)
        return instance

class AnswerSerializer(serializers.BaseSerializer):
    def to_internal_value(self, data):
        answer = data.get('answer', [])
        index = str(data.get('index', ''))
        quiz_id = str(data.get('quiz_id', ''))

        if type(answer) != list:
            raise serializers.ValidationError({'answer': 'This fields must be a list'})

        if not index:
            raise serializers.ValidationError({'index': 'This fields is required'})

        if not quiz_id:
            raise serializers.ValidationError({'quiz_id': 'This fields is required'})


        quiz = Quiz.objects.get(pk=int(quiz_id))
        question = Question.objects.get(quiz=quiz, index=int(index))

        question_type = question.question_type
        options = json.loads(question.options)

        if question_type != 'fi':
            if len(answer) > len(options):
                raise serializers.ValidationError(
                    {'answer|index {}'.format(index): "answer's length exceeds question's options' length"}
            )
        if question_type != 'si' and question_type != 'fi':
            for a in answer:
                if a not in options:
                    raise serializers.ValidationError(
                        {'answer|index {}'.format(index): "answer does not match options"}
                    )
        
        return {
            'index': int(index),
            'answer': json.dumps(answer)
        }
        
    def to_representation(self, obj):
        return {
            'index': obj.question.index,
            'answer': json.loads(obj.answer),
            'solution': json.loads(obj.question.answer),
            'correct': obj.correct
        }

class UserSubmissionSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True)

    class Meta:
        model = UserSubmission
        fields = ('id', 'quiz', 'mark', 'answers')

    def to_internal_value(self, data):
        quiz_id = data.get('quiz_id')
        quiz = Quiz.objects.get(pk=quiz_id)
        answers_data = data.pop('answers')
        new_answers_data = []
        for answer_data in answers_data:
            answer_data['quiz_id'] = quiz_id
            new_answers_data.append(answer_data)
        data['answers'] = new_answers_data
        data['mark'] = 0.0
        data['quiz'] = quiz_id
        data = super().to_internal_value(data)
        return data

    def create(self, validated_data):
        def is_correct(question, answer):
            if len(answer) == 0:
                return False
            solution = json.loads(question.answer)
            if question.question_type in ['si', 'fi']:
                return answer[0] == solution[0]
            if question.question_type == 'mu':
                if len(answer) != len(solution):
                    return False
                for a in answer:
                    if a not in solution:
                        return False
                return True
            if question.question_type == 'ma':
                if len(answer) != len(solution):
                    return False
                for i, a in enumerate(answer):
                    if a != solution[i]:
                        return False
                return True

        answers_data = validated_data.pop('answers')
        user_submission = UserSubmission.objects.create(**validated_data)
        quiz = validated_data['quiz']
        total_question = Question.objects.filter(quiz=quiz).count()
        correct_question = 0

        #add user's answer
        for answer_data in answers_data:
            index = answer_data.pop('index')
            question = Question.objects.get(quiz=quiz, index=index)
            correct = is_correct(question, json.loads(answer_data['answer']))
            correct_question += correct
            Answer.objects.create(question=question, submission=user_submission, correct=correct, **answer_data)

        #caculate mark
        mark = round(correct_question/total_question, 2)
        UserSubmission.objects.filter(pk=user_submission.id).update(mark=mark)
        user_submission = UserSubmission.objects.get(pk=user_submission.id)
        return user_submission  