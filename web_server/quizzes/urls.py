from django.urls import path, re_path
from . import views

urlpatterns = [
    #quiz and question api
    path('api/quiz_question/<int:pk>/', views.QuizQuestionDetail.as_view()),
    path('api/full_quiz/<int:pk>/', views.FullQuizDetail.as_view()),
    path('api/quiz_category/<cate>/', views.QuizCategory.as_view()),
    path('api/create_quiz/', views.QuizCreate.as_view()),
    path('api/recent_quiz/', views.RecentQuiz.as_view()),
    re_path(r'^.*$', views.index),
]