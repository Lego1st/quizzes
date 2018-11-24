from django.shortcuts import render
from quizzes.models import *
from quizzes.serializers import *
from rest_framework import generics, mixins
from rest_framework import permissions, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from django.views.decorators.csrf import csrf_exempt
class PSListCreate(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated, ]

    queryset = ProfileStatistic.objects.all()
    serializer_class = PSSerializer

class UserListCreate(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated, ]

    queryset = User.objects.all()
    serializer_class = UserSerializer

def index(request):
    return render(request, 'index.html')

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