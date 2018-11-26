from django.shortcuts import render
from quizzes.models import *
from quizzes.serializers import *
from rest_framework import generics, mixins
from rest_framework import permissions, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from django.views.decorators.csrf import csrf_exempt
from rest_framework.pagination import PageNumberPagination
from rest_framework.filters import OrderingFilter


def index(request):
    return render(request, 'index.html')

## Quiz and Question api
class QuizQuestionDetail(generics.RetrieveAPIView):

    permission_classes = (permissions.AllowAny,)
    queryset = Quiz.objects.all()
    serializer_class = QuizQuestionReadOnlySerializer

class FullQuizDetail(generics.RetrieveUpdateDestroyAPIView):

    permission_classes = (permissions.AllowAny,)
    queryset = Quiz.objects.all()
    serializer_class = FullQuizSerializer
    
class QuizCreate(generics.CreateAPIView):
    
    permission_classes = (permissions.AllowAny,)
    queryset = Quiz.objects.all()
    serializer_class = FullQuizSerializer

class AnsweredQuiz(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated, ]
    serializer_class = UserActionQuizSerializer
    
    def get_queryset(self):
        user = self.request.user
        return User_Action_Quiz.objects.filter(user=user.profile, action='an')

class FavoriteQuiz(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated, ]
    serializer_class = UserActionQuizSerializer

    def get_queryset(self):
        user = self.request.user
        return User_Action_Quiz.objects.filter(user=user.profile, action='li')

#Pagination class
class StandardPaginationResult(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class RecentQuiz(generics.ListAPIView):

    permission_classes = (permissions.AllowAny,)
    queryset = Quiz.objects.all()
    serializer_class = BriefQuizSerializer
    pagination_class = StandardPaginationResult
    filter_backends = (OrderingFilter,)
    ordering_fields = '__all__'
    ordering = ('-created_at',)
