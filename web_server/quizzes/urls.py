from django.urls import path, re_path
from . import views

urlpatterns = [
    path('api/profile/statistic', views.PSListCreate.as_view()),
    path('api/profile/general-info', views.UserListCreate.as_view()),
    re_path(r'^.*$', views.index),
]