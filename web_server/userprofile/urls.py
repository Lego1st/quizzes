from django.urls import path, re_path
from . import views

urlpatterns = [
    path('api/create/', views.PSListCreate.as_view()),
    path('api/get/',views.current_profile),
    path('current_user/', views.current_user),
    path('api/register/', views.UserList.as_view()),
    path('api/update/',views.PSListUpdate.as_view())
]