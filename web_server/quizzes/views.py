from django.shortcuts import render, get_object_or_404
from quizzes.models import *
from quizzes.serializers import *
from rest_framework import generics, mixins
from rest_framework import permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.views.decorators.csrf import csrf_exempt
from rest_framework.pagination import PageNumberPagination
from rest_framework.filters import OrderingFilter, SearchFilter
import random
import pandas
from django.db.models import Count
from quizzes.permissions import *
from django.db.models import Q
from itertools import chain
from django.forms.models import model_to_dict


def index(request):
    return render(request, 'index.html')

# Pagination classes
class StandardPaginationResult(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

# Quiz and Question APIs
class QuizQuestionDetail(generics.RetrieveAPIView):

    permission_classes = (permissions.IsAuthenticated,
                        HasntDoneQuizOnly,
                        ApprovedQuizOnly,)

    queryset = Quiz.objects.all()
    serializer_class = QuizQuestionReadOnlySerializer

class QuizResult(generics.RetrieveAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UserSubmissionSerializer
    queryset = UserSubmission.objects.all()
    lookup_fields = ('quiz_id',)

    def get_object(self):
        queryset = self.get_queryset()
        queryset = self.filter_queryset(queryset)
        filter = {}
        filter['user'] = self.request.user
        for field in self.lookup_fields:
            filter[field] = self.kwargs[field]
        obj = get_object_or_404(queryset, **filter)
        self.check_object_permissions(self.request, obj)

        return obj

class FullQuizDetail(generics.RetrieveUpdateDestroyAPIView):

    permission_classes = (permissions.IsAuthenticatedOrReadOnly,
                        IsAuthor,
                        UpdatePendingQuizOnly,)
    queryset = Quiz.objects.all()
    serializer_class = FullQuizSerializer

# Set of api that return a list of quiz item use BriefQuizSerializer
class QuizItemList(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = BriefQuizSerializer
    pagination_class = StandardPaginationResult
    filter_backends = (OrderingFilter,)
    ordering_fields = '__all__'
    ordering = ('-created_at',)

class RecentQuiz(QuizItemList):

    def get_queryset(self):
        return Quiz.objects.filter(status='a')

class TopQuiz(QuizItemList):
    """
    Return most liked quizzes
    """
    ordering = ('-like_count', '-created_at')
    def get_queryset(self):
        return Quiz.objects.annotate(like_count=Count('likes')).filter(status='a')

class QuizCategory(QuizItemList):

    def get_queryset(self):
        return Quiz.objects.filter(category=self.kwargs['cate'], status='a')

class SearchQuiz(QuizItemList):
    ordering = ('-like_count', '-created_at')
    filter_backends = (OrderingFilter, SearchFilter,)
    search_fields = ('author__username', 'title', 'brief', 'questions__content')
    
    def get_queryset(self):
        return Quiz.objects.annotate(like_count=Count('likes')).filter(status='a')

class PostedQuiz(QuizItemList):
    """
    Return a list of posted quizzes by a user.
    If the user in the request is the author, return full list of the quiz,
    including pending quizzes, rejected quizzes, and approved quizzes.
    Otherwise, only return list of approved quizzes.
    """

    def get_queryset(self):
        username = self.request.query_params.get('username', None)
        if not username:
            output = Quiz.objects.filter(author=self.request.user)
        else:
            output = Quiz.objects.filter(author__username=username)
            #if not the author, only return approved quizzes
            if username != self.request.user.username:
                output = output.filter(status='a')

        return output

class UserAnswered(QuizItemList):

    ordering = ('-submissions__created_at', '-created_at')
    def get_queryset(self):
        username = self.request.query_params.get('username', None)
        if not username:
            output = Quiz.objects.filter(submissions__user=self.request.user)
        else:
            output = Quiz.objects.filter(submissions__user__username=username)
        return output

class LikedQuiz(QuizItemList):
    
    def get_queryset(self):
        username = self.request.query_params.get('username', None)
        if not username:
            output = Quiz.objects.filter(likes=self.request.user)
        else:
            output = Quiz.objects.filter(likes__username=username)
        return output

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

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated, HasntDoneQuizOnly, ApprovedQuizOnly])
def user_submit(request):
    def random_quiz(category, user):
        quiz_id_pool = Quiz.objects.filter(category=category)\
                                    .exclude(submissions__user=user)\
                                    .values_list('id', flat=True)
        if quiz_id_pool:
            quiz_id = random.choice(quiz_id_pool)
            next_quiz = Quiz.objects.filter(pk=quiz_id).first()
            if next_quiz:
                return quiz_id
        return None
    serializer = UserSubmissionSerializer(data=request.data,
                                        context={'request': request})
    if not serializer.is_valid():
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
    
    serializer.save(user=request.user)
    res = serializer.data
    current_quiz_id = res['quiz']
    current_quiz = Quiz.objects.get(pk=current_quiz_id)
    category = current_quiz.category
    next_quiz_id = random_quiz(category, request.user)
    res['next_quiz'] = next_quiz_id
    return Response(res, status=status.HTTP_201_CREATED)

class UpdateStatusQuiz(generics.UpdateAPIView):
    permission_classes = (permissions.IsAdminUser,)
    serializer_class = BriefQuizSerializer
    queryset = Quiz.objects.all()

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.status = request.data.get('status')
        instance.save()

        return Response({'status': 'success'})

class LikeQuiz(generics.UpdateAPIView):
    permission_classes = (permissions.IsAuthenticated, ApprovedQuizOnly,)
    serializer_class = BriefQuizSerializer
    queryset = Quiz.objects.all()

    def update(self, request, *args, **kwargs):
        obj = self.get_object()
        user = self.request.user
        if user not in obj.likes.all():
            obj.likes.add(user)
        else:
            obj.likes.remove(user)
        return Response(self.get_serializer(obj).data, status=status.HTTP_200_OK)

@api_view(['POST'])
def upload_file_quiz(request):
    file = request.FILES['quiz_file']
    quizzes = pandas.read_excel(file)
    quizzes = quizzes.fillna('')
    print(quizzes)
    return Response({"quizz" : quizzes.to_dict()}, status=status.HTTP_201_CREATED)