from django.urls import path
from . import views

urlpatterns = [
    path('api/profile/statistic', views.PSListCreate.as_view()),
    path('api/profile/general-info', views.UserListCreate.as_view()),
    path('profile/', views.index),
    path('category/', views.index),
    path('myquizzes/', views.index),
    path('favorite/', views.index),
    path('answered/', views.index),
    path('leaderboard/', views.index),
    path('quizapproval/', views.index),
    path('', views.index),
]