from django.urls import path
from . import views as auth_views

urlpatterns = [
    path('signup/', auth_views.signup, name='signup'),
    path('signin/', auth_views.signin, name='signin'),
    path('signout/', auth_views.signout, name='signout'),
    # path('contactList/', auth_views.contact, name='contactList'),
    path('send_friend_request/', auth_views.send_friend_request, name='send_friend_request'),
    path('accept_friend_request/<int:friend_request_id>/', auth_views.accept_friend_request, name='accept_friend_request'),
    path('refuse_friend_request/<int:friend_request_id>/', auth_views.refuse_friend_request, name='refuse_friend_request'),
    # path('cancel_friend_request/<int:friend_request_id>/', auth_views.cancel_friend_request, name='cancel_friend_request'),
	path('remove_friend/<int:friend_id>/', auth_views.remove_friend, name='remove_friend'),
]
