from django.urls import path, re_path
from . import views

urlpatterns = [
    #quiz and question api
    path('api/quiz_question/<int:pk>/', views.QuizQuestionDetail.as_view()),
    path('api/quiz_result/<int:quiz_id>/', views.QuizResult.as_view()),
    path('api/full_quiz/<int:pk>/', views.FullQuizDetail.as_view()),
    path('api/quiz_category/<cate>/', views.QuizCategory.as_view()),
    path('api/answered_quiz/', views.UserAnswered.as_view()),
    path('api/quiz_status_update/<int:pk>/', views.UpdateStatusQuiz.as_view()),
    path('api/create_quiz/', views.QuizCreate.as_view()),
    path('api/recent_quiz/', views.RecentQuiz.as_view()),
    path('api/top_quiz/', views.TopQuiz.as_view()),
    path('api/posted_quiz/', views.PostedQuiz.as_view()),
    path('api/liked_quiz/', views.LikedQuiz.as_view()),
    path('api/like_quiz/<int:pk>/', views.LikeQuiz.as_view()),
    path('api/submit_quiz/', views.user_submit),
    path('api/pending_quiz/', views.PendingQuiz.as_view()),
    path('api/upfile/',views.upload_file_quiz),
    path('api/search/', views.SearchQuiz.as_view()),
    re_path(r'^.*$', views.index),
]