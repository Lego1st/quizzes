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

# Pagination classes
class StandardPaginationResult(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

# Permission classes
class IsAuthorOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow authors of an object to edit it.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the author of the quiz.
        return obj.author == request.user

class HasntDoneQuizOnly(permissions.BasePermission):
    """
    Custom permission to only allow user to do each quiz only once
    """
    message = 'User has done this quiz.'

    def has_object_permission(self, request, view, obj):
        user = request.user
        quiz = obj
        return UserSubmission.objects.filter(quiz=quiz, user=user).count() == 0

# Quiz and Question APIs
class QuizQuestionDetail(generics.RetrieveAPIView):

    permission_classes = (permissions.IsAuthenticated,
                        HasntDoneQuizOnly,)
    queryset = Quiz.objects.all()
    serializer_class = QuizQuestionReadOnlySerializer

class QuizResult(generics.RetrieveAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UserSubmissionSerializer

    def get_queryset(self):
        quiz_id = self.kwargs['pk']
        quiz = Quiz.objects.get(pk=quiz_id)
        user = self.request.user
        return UserSubmission.objects.filter(quiz=quiz, user=user)

class FullQuizDetail(generics.RetrieveUpdateDestroyAPIView):

    permission_classes = (permissions.IsAuthenticatedOrReadOnly,
                        IsAuthorOrReadOnly,)
    queryset = Quiz.objects.all()
    serializer_class = FullQuizSerializer

class QuizCategory(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, )
    serializer_class = BriefQuizSerializer
    pagination_class = StandardPaginationResult
    filter_backends = (OrderingFilter,)
    ordering_fields = '__all__'
    ordering = ('-created_at',)

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

class PendingQuiz(generics.ListAPIView):
    permission_classes = (permissions.IsAdminUser,)
    serializer_class = QuizQuestionReadOnlySerializer

    def get_queryset(self):
        return Quiz.objects.filter(status='p')
    
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
        
class UserSubmit(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = UserSubmission.objects.all()
    serializer_class = UserSubmissionSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class UpdateStatusQuiz(generics.UpdateAPIView):
    permission_classes = (permissions.IsAdminUser,)
    serializer_class = BriefQuizSerializer
    queryset = Quiz.objects.all()

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.status = request.data.get('status')
        instance.save()

        return Response({'status': 'success'})


@api_view(['POST'])
def upload_file_quiz(request):
    file = request.FILES['quiz_file']
    quizzes = pandas.read_excel(file)
    quizzes = quizzes.fillna('')
    print(quizzes)
    return Response({"quizz" : quizzes.to_dict()}, status=status.HTTP_201_CREATED)