from django.shortcuts import render
from quizzes.models import ProfileStatistic, User
from quizzes.serializers import PSSerializer, UserSerializer
from rest_framework import generics

class PSListCreate(generics.ListCreateAPIView):
    queryset = ProfileStatistic.objects.all()
    serializer_class = PSSerializer

class UserListCreate(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

def index(request):
    return render(request, 'quizzes/profile.html')