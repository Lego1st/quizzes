from rest_framework import serializers
from quizzes.models import ProfileStatistic, User

class PSSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfileStatistic
        fields = "__all__"

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"