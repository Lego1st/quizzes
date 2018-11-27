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
import pandas

def index(request):
    return render(request, 'index.html')

#Pagination class
class StandardPaginationResult(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

## Quiz and Question api
class QuizQuestionDetail(generics.RetrieveAPIView):

    permission_classes = (permissions.IsAuthenticated,)
    queryset = Quiz.objects.all()
    serializer_class = QuizQuestionReadOnlySerializer

class FullQuizDetail(generics.RetrieveUpdateDestroyAPIView):

    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    queryset = Quiz.objects.all()
    serializer_class = FullQuizSerializer

class QuizCategory(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, )
    serializer_class = BriefQuizSerializer

    def get_queryset(self):
        return Quiz.objects.filter(category=self.kwargs['cate'])

class PostedQuiz(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = BriefQuizSerializer
    pagination_class = StandardPaginationResult
    filter_backends = (OrderingFilter,)
    ordering_fields = '__all__'
    ordering = ('-created_at',)

    def get_queryset(self):
        return Quiz.objects.filter(author=self.request.user)
    
class QuizCreate(generics.CreateAPIView):
    
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Quiz.objects.all()
    serializer_class = FullQuizSerializer

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class RecentQuiz(generics.ListAPIView):

    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    queryset = Quiz.objects.all()
    serializer_class = BriefQuizSerializer
    pagination_class = StandardPaginationResult
    filter_backends = (OrderingFilter,)
    ordering_fields = '__all__'
    ordering = ('-created_at',)

class SearchQuiz(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated, )
    serializer_class = QuestionAndQuizSerializer

    def get_queryset(self):
        return Question.objects.filter(content__contains=self.kwargs['search_text'])


@api_view(['POST'])
def upload_file_quiz(request):
    file = request.FILES['quiz_file']
    quizzes = pandas.read_excel(file)
    return Response({"quizz" : quizzes.to_dict()}, status=status.HTTP_201_CREATED)