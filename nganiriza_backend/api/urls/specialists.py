from django.urls import path
from api.views.specialists.speicialists import *

urlpatterns = [
    # Specialist Profile Management
    path('profile/', get_specialist_profile, name='specialist_profile'),
    path('profile/update/',  update_specialist_profile, name='update_specialist_profile'),
    path('dashboard/stats/',  get_dashboard_stats, name='specialist_dashboard_stats'),
    
    # Public Specialist Listings
    path('',  list_specialists, name='list_specialists'),
    path('<int:pk>/',  get_specialist_detail, name='specialist_detail'),
    
    # Appointments
    path('appointments/create/',  create_appointment, name='create_appointment'),
    path('appointments/my/',  list_user_appointments, name='list_user_appointments'),
    path('appointments/specialist/',  list_specialist_appointments, name='list_specialist_appointments'),
    path('appointments/<int:pk>/status/',  update_appointment_status, name='update_appointment_status'),
    
    # Reviews
    path('reviews/create/',  create_review, name='create_review'),
    path('<int:specialist_id>/reviews/',  list_specialist_reviews, name='list_specialist_reviews'),
    
    # Messages
    path('messages/create/', create_specialist_message, name='create_specialist_message'),
    path('messages/user/', list_user_messages, name='list_user_messages'),
    path('messages/inbox/', list_specialist_messages, name='list_specialist_messages'),
    
    # Contacted specialists and details
    path('contacts/', list_contacted_specialists, name='list_contacted_specialists'),
    path('<int:pk>/messages/', get_specialist_messages, name='get_specialist_messages'),
    path('<int:pk>/appointments/', get_specialist_appointments, name='get_specialist_appointments'),
]