from rest_framework import serializers
from quizzes.models import ProfileStatistic, User, Quiz, Question
from rest_framework_jwt.settings import api_settings
import json

class PSSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = ProfileStatistic
        fields = "__all__"


class UserSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = ('username', 'age', 'education', 'bio')


class UserSerializerWithToken(serializers.ModelSerializer):

    token = serializers.SerializerMethodField()
    password = serializers.CharField(write_only=True, default = 'quizzes')

    def get_token(self, obj):
        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

        payload = jwt_payload_handler(obj)
        token = jwt_encode_handler(payload)
        return token

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

    class Meta:
        model = User
        fields = ('token', 'username', 'password')

## Quiz and Question serializers
class QuizBriefSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        fields = '__all__'

class QuestionReadOnlySerializer(serializers.BaseSerializer):
    
    def to_representation(self, obj):
        return {
            'index': obj.index,
            'quiz_id': obj.quiz.id,
            'content': json.loads(obj.content)
        }

class AnswerReadOnlySerializer(serializers.BaseSerializer):
    
    def to_representation(self, obj):
        return {
            'index': obj.index,
            'quiz_id': obj.quiz.id,
            'answer': json.loads(obj.content)
        }

class FullQuestionSerializer(serializers.BaseSerializer):
    QUESTION_TYPE = {
        'single': {'max_option': 7, 'min_option': 2, 'full_name': 'single choice'}
        'multiple': {'max_option': 20, 'min_option': 3, 'full_name': 'multiple choice'}
        'matching': {'max_option': 20, 'min_option': 2, 'full_name': 'matching'}
        'filling': {'max_option': 0, 'min_option': 0, 'full_name': 'filling in the blank'}
    }

    def to_internal_value(self, data):
        def _validate(logic, message):
            if not logic:
                raise serializers.ValidationError(message)
        
        index = data.get('index')
        quiz_id = data.get('quiz_id')
        content = data.get('content')
        answer = data.get('answer')

        # validate fields
        _validate(index, {'index': 'This field is required.'})
        _validate(quiz_id, {'quiz_id': 'This field is required.'})
        _validate(content, {'content': 'This field is required.'})
        _validate(answer, {'answer': 'This field is required.'})

        type_content = content.get('type')
        type_answer = answer.get('type')

        question = content.get('question')
        options = content.get('options')
        solution = answer.get('solution')
        
        # validate type of content and answer
        _validate(type_content, {'content.type': 'This field is required.'})
        _validate(type_answer, {'answer.type': 'This field is required.'})
        _validate(type_content == type_answer, {'content.type': 'This field is required.'})
        _validate(type_content in QUESTION_TYPE, {'type': 'This field need to be either {}'.format('/'.join(QUESTION_TYPE))})
        
        # validate nested fields
        _validate(question, {'content.question': 'This field is required.'})
        _validate(solution, {'answer.solution': 'This field is required.'})

        # validate options of the question
        if question_type != 'filling':
            _validate(options, {'content.options': 'This field is required.'}) # filling question don't need options field

            min_option_len = QUESTION_TYPE[question_type]['min_option']
            max_option_len = QUESTION_TYPE[question_type]['max_option']
            question_name = QUESTION_TYPE[question_type]['full_name']

            if question_type == 'matching':
                #validate question and option in matching question
                _validate(options.get('questions'), {'content.options.questions': 'This field is required in matching question.'})
                _validate(options.get('options'), {'content.options.options': 'This field is required in matching question.'})
                _validate(
                    len(options['questions']) == len(options['options']),
                    {'content.options.questions': 'content.options.questions and content.options.options should have the same length'}
                )
                option_len = len(options['questions'])
            else:
                option_len = len(options)
            
            _validate(
                options_len >= min_option_len, 
                {'content.options': '{} question needs at least {} options'.format(question_name, min_option_len)}
            )
            _validate(
                options_len <= max_option_len,
                {'content.options': '{} question needs at least {} options'.format(question_name, max_option_len)}
            )
            
        if question_type == 'single':
            _validate(len(solution) == 1, {'answer.solution': 'Single choice question only need one solution'})
            _validate(solution[0] in options, {'answer.solution': 'answer.solution does not match content.options'})
        
        if question_type == 'mulitple':
            _validate(len(solution) <= len(options), {'answer.solution': 'answer.solution need to be less than content.options'})
            
            for s in solution:
                _validate(s in options, {'answer.solution': 'answer.solution does not match content.options'})

        if question_type == 'matching':
            if type(solution) != list:
                raise serializers.ValidationError({
                    'answer.solution': 'This field must be a list in matching question'
                })
            else:
                if len(solution) != len(options):
                    raise serializers.ValidationError({
                        'answer.solution': 'answer.solution must have the same length with content.options'
                    })

    def to_representation(self, obj):


# class FullQuizSerializer(serializers.ModelSerializer):
#     question = FullQuestionSerializer(many=True)
#     class Meta:
#         model=Quiz
#         fields= 