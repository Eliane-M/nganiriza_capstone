from django.urls import path
from api.views.admin.service_providers import (
    list_service_providers,
    list_public_service_providers,
    create_service_provider,
    get_service_provider,
    update_service_provider,
    delete_service_provider
)
from api.views.admin.users import list_users, get_user_detail
from api.views.admin.specialists import (
    list_pending_specialists,
    get_specialist_for_approval,
    approve_specialist
)

urlpatterns = [
    # Service Providers (Clinics)
    path('service-providers/', list_service_providers, name='admin_list_service_providers'),
    path('service-providers/public/', list_public_service_providers, name='public_list_service_providers'),
    path('service-providers/create/', create_service_provider, name='admin_create_service_provider'),
    path('service-providers/<int:pk>/', get_service_provider, name='admin_get_service_provider'),
    path('service-providers/<int:pk>/update/', update_service_provider, name='admin_update_service_provider'),
    path('service-providers/<int:pk>/delete/', delete_service_provider, name='admin_delete_service_provider'),
    
    # Users
    path('users/', list_users, name='admin_list_users'),
    path('users/<int:pk>/', get_user_detail, name='admin_get_user_detail'),
    
    # Specialists Approval
    path('specialists/pending/', list_pending_specialists, name='admin_list_pending_specialists'),
    path('specialists/<int:pk>/', get_specialist_for_approval, name='admin_get_specialist_for_approval'),
    path('specialists/<int:pk>/approve/', approve_specialist, name='admin_approve_specialist'),
]

