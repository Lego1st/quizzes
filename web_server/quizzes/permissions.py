from rest_framework import permissions
from quizzes.models import *

# Permission classes
class IsAuthor(permissions.BasePermission):
    """
    Custom permission to only allow authors of an object to edit it.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        # Write permissions are only allowed to the author of the quiz.
        return obj.author == request.user

class HasntDoneQuizOnly(permissions.BasePermission):
    """
    Custom permission to only allow user to do each quiz only once
    """
    message = "User has done this quiz!"

    def has_object_permission(self, request, view, obj):
        user = request.user
        quiz = obj
        return UserSubmission.objects.filter(quiz=quiz, user=user).count() == 0

class ApprovedQuizOnly(permissions.BasePermission):
    """
    Custom permission to only allow user except the quiz's author to take action on approved quiz only
    """
    message = "This quiz has not been approved yet!"

    def has_object_permission(self, request, view, obj):
        if obj.author == request.user:
            return True
        return obj.status == 'a'

class UpdatePendingQuizOnly(permissions.BasePermission):
    """
    Custom permission to only allow user update pending quizzes
    """
    message = "This quiz can not be update after being approved"

    def has_object_permission(self, request, view, obj):
        if request.method != 'PUT':
            return True
        return obj.status != 'a'