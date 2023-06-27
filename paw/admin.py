from django.contrib import admin

from paw.models import User, Veterinarian, Appointment, Client, Pet

admin.site.register(User)
admin.site.register(Veterinarian)
admin.site.register(Appointment)
admin.site.register(Client)
admin.site.register(Pet)