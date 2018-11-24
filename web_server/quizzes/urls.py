from django.urls import path, re_path
from . import views

urlpatterns = [
    path('api/profile/statistic/', views.PSListCreate.as_view()),
    path('api/profile/general-info/', views.UserListCreate.as_view()),
    path('current_user/', views.current_user),
    path('api/register/', views.UserList.as_view()),
    #quiz and question api
    path('api/quiz_question/<int:pk>/', views.QuizQuestionDetail.as_view()),
    path('api/full_quiz/<int:pk>/', views.FullQuizDetail.as_view()),
    path('api/create_quiz/', views.QuizCreate.as_view()),
    re_path(r'^.*$', views.index),
]