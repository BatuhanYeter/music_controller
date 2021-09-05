from django.urls import path
from . import views

urlpatterns = [
    path('', views.RoomView.as_view(), name='index'),
    path('create_room', views.CreateRoomView.as_view(), name='create_room'),
    path('get_room', views.GetRoom.as_view(), name="get_room"),
    path('join_room', views.RoomJoinView.as_view(), name="join_room"),
    path('user_in_room', views.UserInRoom.as_view(), name="user_in_room"),
    path('leave_room', views.LeaveRoom.as_view(), name="leave_room"),
    path('update_room', views.UpdateRoom.as_view(), name="update_view")
]
