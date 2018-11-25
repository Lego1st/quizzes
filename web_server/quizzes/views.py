from django.shortcuts import render
from quizzes.models import *
from quizzes.serializers import *
from rest_framework import generics, mixins
from rest_framework import permissions, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from django.views.decorators.csrf import csrf_exempt


def index(request):
    return render(request, 'index.html')

## Quiz and Question api
class QuizQuestionDetail(generics.RetrieveAPIView):

    # permission_classes = (permissions.AllowAny,)
    queryset = Quiz.objects.all()
    serializer_class = QuizQuestionReadOnlySerializer

class FullQuizDetail(generics.RetrieveUpdateDestroyAPIView):

    # permission_classes = (permissions.AllowAny,)
    queryset = Quiz.objects.all()
    serializer_class = FullQuizSerializer
    
class QuizCreate(generics.CreateAPIView):
    
    # permission_classes = (permissions.AllowAny,)
    queryset = Quiz.objects.all()
    serializer_class = FullQuizSerializer

# class QuizBrief(generics.)