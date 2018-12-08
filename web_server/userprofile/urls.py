from django.urls import path, re_path
from . import views
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('api/create/', views.PSListCreate.as_view()),
    path('current_user/', views.current_user),
    path('api/register/', views.UserList.as_view()),
    path('api/update/',views.PSListUpdate.as_view()),
    path('api/avatar/',views.upload_avatar),
    path('api/current_avatar/',views.current_profile_avatar),
    path('api/detail/<str:username>/',views.PSDetail.as_view()),
    path('api/ranking/',views.ranking_counter),
    path('api/leader_board/',views.get_leaderboard),
    path('api/statistic/',views.get_statistic)
] 