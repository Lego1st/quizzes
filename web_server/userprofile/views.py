from django.shortcuts import render
from rest_framework import permissions, status, parsers
from rest_framework.decorators import api_view,permission_classes
from .models import Profile,User
from .serializers import PSSerializer, UserSerializer, UserSerializerWithToken, PSAvatarSerializer
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from quizzes.models import UserSubmission, Quiz
from itertools import chain
from collections import defaultdict

# Create your views here.
class PSListCreate(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated, ]

    queryset = Profile.objects.all()
    serializer_class = PSSerializer

    def post(self,request,format=None):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            profile = serializer.save()
            return Response({"profile" : profile.id}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PSListUpdate(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated, ]

    serializer_class = PSSerializer
    def post(self,request,format=None):
        serializer = self.get_serializer(data=request.data,instance=request.user.profile)
        if serializer.is_valid():
            serializer.save()
            return Response({"profile" : 'susscess'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PSDetail(generics.RetrieveAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = User.objects.all()
    lookup_field = 'username'
    serializer_class = UserSerializer

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        profile = Profile.objects.get(pk=serializer['id'].value)
        return Response(PSSerializer(profile).data,status=status.HTTP_200_OK)
        

@api_view(['POST'])
def upload_avatar(request):
    # profile = PSAvatarUpdate()
    im = request.FILES['avatar']
    profile = Profile.objects.get(pk=request.user.id)
    profile.avatar = im
    profile.save()
    return Response({"profile" : 'susscess'}, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def current_profile_avatar(request):
    userid = User.objects.get(username=request.GET.get('username')).id
    profile = Profile.objects.get(pk=userid)
    return Response(PSAvatarSerializer(profile).data)

def my_jwt_response_handler(token, user=None, request=None):
    return {
        'token': token,
        'user': UserSerializer(user, context={'request': request}).data
    }
    
@api_view(['GET'])
def current_user(request):
    """
    Determine the current user by their token, and return their data
    """
    
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

@api_view(['GET'])
def ranking_counter(request):
    users = User.objects.all()
    scores = defaultdict()
    user_mark = defaultdict(list)
    for user in users: 
        user_quiz  = UserSubmission.objects.filter(user=user)
        mark  = defaultdict(float)
        for quizdo in user_quiz:
            
            quiz = Quiz.objects.filter(pk=quizdo.id)
            cate = quiz[0].category
            mark[cate] += quizdo.mark

        for cate in mark:
            user_mark[cate].append(mark[cate])

        scores[user.username] = mark
    total_done = {}
    for cate in user_mark:
        user_mark[cate] = sorted(user_mark[cate],reverse=True)
        total_done[cate] = len(user_mark[cate])

    cur_user = request.GET.get('username')
    ranking = defaultdict()
    print(user_mark)
    for cate in user_mark:
        ranking[cate] = (user_mark[cate].index(scores[cur_user][cate]), total_done[cate])
    return Response(ranking)

@api_view(['GET'])
def get_leaderboard(request):
    categories = defaultdict(list)
    users = User.objects.all()
    for user in users:
        user_quiz = UserSubmission.objects.filter(user=user)
        user_mark = defaultdict(float)
        for quizdo in user_quiz:
            quiz = Quiz.objects.filter(pk=quizdo.id)
            cate = quiz[0].category
            user_mark[cate] += quizdo.mark
        for cate in user_mark:
            categories[cate].append((user.username, user_mark[cate]))
    for cate in categories:
        categories[cate] = reversed(sorted(categories[cate], key=lambda x: x[1]))
    return Response(categories)
        

class UserList(generics.GenericAPIView):
    """
    Create a new user. It's called 'UserList' because normally we'd have a get
    method here too, for retrieving a list of all User objects.
    """

    permission_classes = (permissions.AllowAny,)
    serializer_class = UserSerializerWithToken
    def post(self, request, format=None):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"user" : serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
