from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("vet_register", views.vet_register, name ="vet_register"),
    path("api/new_app_save/<str:date>", views.new_app_save_api, name="new_app_save_api"),
    path("api/apps", views.appointments_api, name="appointments_api"),
    path("api/vet/<str:vet_id>", views.app_api_vet, name="app_api_vet"),
    path("api/vet/delete/<str:vet_id>", views.app_api_vet_delete, name="app_api_vet_delete"),
    path("api/vet/edit/<str:vet_id>", views.app_api_vet_edit, name="app_api_vet_edit"),
    path("api/client/<str:client_id>", views.app_api_client, name="app_api_client"),
    path("api/add/client", views.api_add_client, name ="api_add_client"),
    path("api/add/pet", views.api_add_pet, name ="api_add_pet"),
    path("api/client/delete/<str:client_id>", views.app_api_client_delete, name="app_api_client_delete"),
    path("api/client/edit/<str:client_id>", views.app_api_client_edit, name="app_api_client_edit"),
    path("api/pet/<str:client_id>", views.app_api_pet, name="app_api_pet"),
    path("api/pet/delete/<str:pet_id>", views.app_api_pet_delete, name="app_api_pet_delete"),
    path("api/pet/edit/<str:pet_id>", views.app_api_pet_edit, name="app_api_pet_edit"),
    path("api/pet_apps/<str:pet_id>", views.app_api_pet_apps, name="app_api_pet_apps"),
    path("api/appointment/edit/<str:id>", views.edit_appointment_api_id, name="edit_appointment_api_id"),
    path("api/appointments/<str:date>", views.appointments_date_api, name="appointments_date_api"),
    path("api/appointment/delete/<str:app_id>", views.delete_appointment_api_id, name="delete_appointment_api_id"),
]
