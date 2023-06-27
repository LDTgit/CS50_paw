from django.shortcuts import render, redirect
import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect, Http404, JsonResponse
from django.db import IntegrityError
from django.urls import reverse
from django.core.paginator import Paginator
import math
from .models import User, Veterinarian, Appointment, Pet, Client
import datetime
from django.views.decorators.csrf import csrf_exempt
from django.contrib import messages

def index(request):
    return render(request, "paw/index.html")

def login_view(request):
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "paw/index.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "paw/login.html")

def register(request):
    if request.user.is_superuser:
        if request.method == "POST":
            username = request.POST["username"]
            email = request.POST["email"]
            password = request.POST["password"]
            confirmation = request.POST["confirmation"]
            if password != confirmation:
                return render(request, "paw/register.html", {
                    "message": "Passwords must match."
                })
            try:
                user = User.objects.create_user(username, email, password)
                user.save()
            except IntegrityError:
                return render(request, "paw/register.html", {
                    "message": "Username already taken."
                })
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "paw/register.html")
    else:
        return render(request, "paw/register.html", {
                    "message": "Please contact the admin to create a new user."
                })

def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))

@login_required
def vet_register(request):
    if request.user.is_superuser:
        if request.method == "POST":
            vet_name = request.POST["vet_name"]
            vet_notes = request.POST["vet_notes"]
            try:
                new_vet = Veterinarian.objects.create(vet_name=vet_name, notes=vet_notes)
                new_vet.save()
            except IntegrityError:
                return render(request, "paw/index.html", {
                    "message": "Vet name already taken."
                })
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "paw/vet_register.html")
    else:
        return render(request, "paw/index.html", {
                    "message": "Please contact the admin to create a new veterinary."
                })
    
def appointments_api(request):
    if request.method == 'GET':
        vets = Veterinarian.objects.all()
        clients = Client.objects.all()
        pets = Pet.objects.all()
        response = {
            "vets": (list(vet.serialize() for vet in vets)),
            "pets": (list(pet.serialize() for pet in pets)),
            "clients": (list(client.serialize() for client in clients)),
        }
        return JsonResponse(response, safe=False)
    else:
        return JsonResponse({
            "error": "GET request required."
        }, status=400)
    

def app_api_vet(request, vet_id):
    if request.method == 'GET':
        vet = Veterinarian.objects.get(id=vet_id)
        appointments = Appointment.objects.filter(vet=vet).order_by("-appointment_date", "-timeslot").all()
        paginator = Paginator(appointments, 10)
        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)
        current_user = request.user.username
        response = {
            "info_set": "vet",
            "vet":vet.serialize(),
            "appointments": list(app.serialize() for app in page_obj.object_list),
            "page": page_number,
            "total": math.ceil(len(appointments) / 10),
            "current_user": current_user,
            "is_authenticated": request.user.is_authenticated,
            "is_superuser":request.user.is_superuser,
        }
        return JsonResponse(response, safe=False)
    else:
        return JsonResponse({
            "error": "GET request required."
        }, status=400)

def app_api_client(request, client_id):
    if request.method == 'GET':
        client = Client.objects.get(id=client_id)
        appointments = Appointment.objects.filter(client=client).order_by("-appointment_date", "-timeslot").all()
        paginator = Paginator(appointments, 10)
        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)
        current_user = request.user.username
        pets = Pet.objects.filter(owner=client).all()
        response = {
            "info_set": "client",
            "client":client.serialize(),
            "pets":list(pet.serialize() for pet in pets),
            "appointments": list(app.serialize() for app in page_obj.object_list),
            "page": page_number,
            "total": math.ceil(len(appointments) / 10),
            "current_user": current_user,
            "is_authenticated": request.user.is_authenticated,
            "is_superuser":request.user.is_superuser,
        }
        return JsonResponse(response, safe=False)
    else:
        return JsonResponse({
            "error": "GET request required."
        }, status=400)      

@login_required   
def api_add_client(request):
    if request.method == "POST":
        json_data=json.loads(request.body)
        client_name = json_data["client_name"]
        client_notes = json_data["notes"]
        created_by = request.user
        try:
            new_client = Client.objects.create(client_name=client_name, notes=client_notes, created_by=created_by)
            new_client.save()
            clients = Client.objects.all()
        except IntegrityError:
            return render(request, "index.html", {
                "message": "Client name already taken."
            })
        response = {
            "clients": list(client.serialize() for client in clients),
        }
        return JsonResponse(response, safe=False)
    elif request.method == "GET":
        clients = Client.objects.all()
        response = {
            "clients": (list(client.serialize() for client in clients)),
        }
        return JsonResponse(response, safe=False)
    else:
        return JsonResponse({
            "error": "POST or GET request required."
        }, status=400)      
    
@login_required
def api_add_pet(request):
    if request.method == "POST":
        json_data=json.loads(request.body)
        pet_name = json_data["pet_name"]
        pet_notes = json_data["pet_notes"]
        owner_id = json_data["owner_id"]
        pet_notes=json_data["pet_notes"]
        created_by = request.user
        try:
            owner = Client.objects.get(id=owner_id)
            new_pet_item =Pet.objects.create(pet_name=pet_name, owner=owner, notes=pet_notes, created_by=created_by)
            new_pet_item.save()
        except IntegrityError as ex:
            print(ex)
            return render(request, "paw/index.html", {
                "message": "Pet already exists."
            })
        response = {
            "owner":owner.id,
        }
        return JsonResponse(response, safe=False)
    else:
        return JsonResponse({
            "error": "GET request required."
        }, status=400)     


def app_api_pet(request, client_id):
    if request.method == 'GET':
        client = Client.objects.get(id=client_id)
        pets = Pet.objects.filter(owner=client).all()
        response = {
            "pets": list(pet.serialize() for pet in pets),
        }
        return JsonResponse(response, safe=False)
    else:
        return JsonResponse({
            "error": "GET request required."
        }, status=400)      

def app_api_pet_apps(request, pet_id):
    if request.method == 'GET':
        pet = Pet.objects.get(id=pet_id)
        appointments = Appointment.objects.filter(pet=pet).order_by("-appointment_date", "-timeslot").all()
        paginator = Paginator(appointments, 10)
        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)
        current_user = request.user.username
        response = {
            "info_set": "pet",
            "pet": pet.serialize(),
            "appointments": list(app.serialize() for app in page_obj.object_list),
            "page": page_number,
            "total": math.ceil(len(appointments) / 10),
            "current_user": current_user,
            "is_authenticated": request.user.is_authenticated,
            "is_superuser":request.user.is_superuser,
        }
        return JsonResponse(response, safe=False)
    if (request.method == "POST" and request.user.is_authenticated):
        json_data=json.loads(request.body)
        pet_name = json_data["pet_name"]
        owner_id = json_data["owner_id"]
        owner = Client.objects.get(id=owner_id)
        pet_notes=json_data["pet_notes"]
        created_by = request.user
        try:
            new_pet_item =Pet.objects.create(pet_name=pet_name, owner=owner, notes=pet_notes, created_by=created_by)
            new_pet_item.save()
        except IntegrityError as ex:
            print(ex)
            return render(request, "paw/index.html", {
                "message": "Pet already exists."
            })
        return HttpResponse(status=201)
    else:
        return JsonResponse({
            "error": "GET or POST request required."
        }, status=400)     

def appointments_date_api(request, date):
    if request.method == 'GET':
        appointments = Appointment.objects.filter(appointment_date=date).order_by("-timeslot").all() 
        paginator = Paginator(appointments, 10)
        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)
        current_date = date
        current_user = request.user.username
        all_appointments = Appointment.objects.filter(appointment_date=date).all()
        response = {
            "appointments": list(app.serialize() for app in page_obj.object_list),
            "current_date":current_date,
            "page": page_number,
            "total": math.ceil(len(appointments) / 10),
            "is_authenticated": request.user.is_authenticated,
            "is_superuser":request.user.is_superuser,
            "current_user": current_user,
        }
        return JsonResponse(response, safe=False)
    else:
        return JsonResponse({
            "error": "GET request required."
        }, status=400)


@login_required
def new_app_save_api(request, date):
    if request.method == "GET":
        vets = Veterinarian.objects.all()
        clients = Client.objects.all()
        pets = Pet.objects.all()
        timeslot_choices = Appointment.TIMESLOT_LIST
        all_used_timeslots=[]
        for vet in vets:
            all_vet_appointments = Appointment.objects.filter(vet=vet,appointment_date=date).all()
            all_timeslots = list(slot.time for slot in all_vet_appointments)
            added = [vet.id, all_timeslots]
            all_used_timeslots.append(added)
        response = {
            "vets": list(vet.serialize() for vet in vets),
            "clients": list(client.serialize() for client in clients),
            "pets": list(pet.serialize() for pet in pets),
            "timeslot_choices": timeslot_choices,
            "all_used_timeslots":all_used_timeslots,
            "is_superuser": request.user.is_superuser
        }
        return JsonResponse(response, safe=False)
    elif (request.method == "POST" and request.user.is_authenticated):
        json_data=json.loads(request.body)
        vet_id = json_data["add_vet"]
        client_id = json_data["add_client"]
        pet_id = json_data["add_pet"]
        add_vet = Veterinarian.objects.get(id=vet_id)
        add_client = Client.objects.get(id=client_id)
        add_pet = Pet.objects.get(id=pet_id)
        add_app_date = json_data["add_app_date"]
        add_timeslot = json_data["add_timeslot"]
        add_notes=json_data["add_notes"]
        created_by = request.user
        try:
            new_appointment_item =Appointment.objects.create(vet=add_vet, client=add_client, pet=add_pet, appointment_date=add_app_date, timeslot=add_timeslot, notes=add_notes, created_by=created_by)
            new_appointment_item.save()
        except IntegrityError as ex:
            print(ex)
            return render(request, "paw/index.html", {
                "message": "Listing already exists."
            })
        return HttpResponse(status=201)
    else:
        return JsonResponse({
            "error": "GET or PUT request required."
        }, status=400)

@login_required
def app_api_pet_delete(request, pet_id):
    try:
        pet = Pet.objects.get(id=pet_id)
    except Pet.DoesNotExist:
        return JsonResponse({"error": "Pet not found."}, status=404)
    if (request.method == "PUT" and request.user.is_authenticated):
        try:
            pet.delete()
        except IntegrityError as ex:
            print(ex)
            return HttpResponse(status=400)
        return HttpResponse(status=201)
    else:
        return JsonResponse({
            "error": "PUT request required."
        }, status=400)

@login_required
def app_api_client_delete(request, client_id):
    try:
        client = Client.objects.get(id=client_id)
    except Client.DoesNotExist:
        return JsonResponse({"error": "Client not found."}, status=404)
    if (request.method == "PUT" and request.user.is_authenticated):
        try:
            client.delete()
        except IntegrityError as ex:
            print(ex)
            return HttpResponse(status=400)
        return HttpResponse(status=201)
    else:
        return JsonResponse({
            "error": "PUT request required."
        }, status=400)

@login_required
def app_api_vet_delete(request, vet_id):
    try:
        vet = Veterinarian.objects.get(id=vet_id)
    except Veterinarian.DoesNotExist:
        return JsonResponse({"error": "Vet not found."}, status=404)
    if (request.method == "PUT" and request.user.is_authenticated):
        try:
            vet.delete()
        except IntegrityError as ex:
            print(ex)
            return HttpResponse(status=400)
        return HttpResponse(status=201)
    else:
        return JsonResponse({
            "error": "PUT request required."
        }, status=400)

@login_required
def delete_appointment_api_id(request, app_id):
    try:
        app = Appointment.objects.get(id=app_id)
    except Appointment.DoesNotExist:
        return JsonResponse({"error": "Appointment not found."}, status=404)
    if (request.method == "PUT" and request.user.is_authenticated):
        try:
            app.delete()
        except IntegrityError as ex:
            print(ex)
            return HttpResponse(status=400)
        return HttpResponse(status=201)
    else:
        return JsonResponse({
            "error": "PUT request required."
        }, status=400)

@login_required
def edit_appointment_api_id(request, id):
    try:
        app = Appointment.objects.get(id=id)
    except Appointment.DoesNotExist:
        return JsonResponse({"error": "Appointment not found."}, status=404)
    if request.method == "GET":
        vets = Veterinarian.objects.all()
        clients = Client.objects.all()
        pets = Pet.objects.all()
        timeslot_choices = Appointment.TIMESLOT_LIST
        all_used_timeslots=[]
        for vet in vets:
            all_vet_appointments = Appointment.objects.filter(vet=vet,appointment_date=app.appointment_date).all()
            all_timeslots = list(slot.time for slot in all_vet_appointments)
            added = [vet.id, all_timeslots]
            all_used_timeslots.append(added)
        response = {
            "vets": list(vet.serialize() for vet in vets),
            "clients": list(client.serialize() for client in clients),
            "pets": list(pet.serialize() for pet in pets),
            "appointment":app.serialize(),
            "timeslot_choices": timeslot_choices,
            "all_used_timeslots": all_used_timeslots, 
        }
        return JsonResponse(response, safe=False)
    elif (request.method == "PUT" and request.user.is_authenticated):
        json_data=json.loads(request.body)
        vet_id = json_data["add_vet"]
        client_id = json_data["add_client"]
        pet_id = json_data["add_pet"]
        add_vet = Veterinarian.objects.get(id=vet_id)
        add_client = Client.objects.get(id=client_id)
        add_pet = Pet.objects.get(id=pet_id)
        add_app_date = json_data["add_app_date"]
        add_timeslot = json_data["add_timeslot"]
        add_notes = json_data["add_notes"]
        created_by = request.user
        app = Appointment.objects.get(id=id)
        try:
            app.vet = add_vet
            app.client = add_client
            app.pet = add_pet
            app.appointment_date=add_app_date
            app.timeslot=add_timeslot
            app.notes=add_notes
            app.created_by=created_by
            app.save()
        except IntegrityError as ex:
            print(ex)
            return HttpResponse(status=400)
        return HttpResponse(status=201)
    else:
        return JsonResponse({
            "error": "PUT request required."
        }, status=400)
    

@login_required
def app_api_pet_edit(request, pet_id):
    try:
        pet = Pet.objects.get(id=pet_id)
    except Pet.DoesNotExist:
        return JsonResponse({"error": "Pet not found."}, status=404)
    if request.method == "GET":
        response = {
            "pet": pet.serialize(),
        }
        return JsonResponse(response, safe=False)
    elif (request.method == "PUT" and request.user.is_authenticated):
        json_data=json.loads(request.body)
        pet_name = json_data["edit_pet_name"]
        notes=json_data["edit_pet_notes"]
        pet = Pet.objects.get(id=pet_id)
        try:
            pet.pet_name = pet_name
            pet.notes=notes
            pet.save()
        except IntegrityError as ex:
            print(ex)
            return HttpResponse(status=400)
        return HttpResponse(status=201)
    else:
        return JsonResponse({
            "error": "PUT request required."
        }, status=400)
    

@login_required
def app_api_client_edit(request, client_id):
    try:
        client = Client.objects.get(id=client_id)
    except Client.DoesNotExist:
        return JsonResponse({"error": "Client not found."}, status=404)
    if request.method == "GET":
        response = {
            "client": client.serialize(),
        }
        return JsonResponse(response, safe=False)
    elif (request.method == "PUT" and request.user.is_authenticated):
        json_data=json.loads(request.body)
        client_name = json_data["edit_client_name"]
        notes=json_data["edit_client_notes"]
        client = Client.objects.get(id=client_id)
        try:
            client.client_name = client_name
            client.notes=notes
            client.save()
        except IntegrityError as ex:
            print(ex)
            return HttpResponse(status=400)
        return HttpResponse(status=201)
    else:
        return JsonResponse({
            "error": "PUT request required."
        }, status=400)
    
@login_required
def app_api_vet_edit(request, vet_id):
    if request.method == "GET":
        try:
            vet = Veterinarian.objects.get(id=vet_id)
        except Veterinarian.DoesNotExist:
            return JsonResponse({"error": "Vet not found."}, status=404)
        response = {
            "vet": vet.serialize(),
        }
        return JsonResponse(response, safe=False)
    elif (request.method == "PUT" and request.user.is_authenticated and request.user.is_superuser):
        json_data=json.loads(request.body)
        vet_name = json_data["edit_vet_name"]
        vet_notes = json_data["edit_vet_notes"]
        vet = Veterinarian.objects.get(id=vet_id)
        try:
            vet.vet_name = vet_name
            vet.notes = vet_notes
            vet.save()
        except IntegrityError as ex:
            print(ex)
            return HttpResponse(status=400)
        return HttpResponse(status=201)
    else:
        return JsonResponse({
            "error": "PUT request required."
        }, status=400)
