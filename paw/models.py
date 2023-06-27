from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    pass


class Veterinarian(models.Model):
    id = models.AutoField(primary_key=True)
    vet_name = models.CharField(max_length=80, unique=True, blank=False, verbose_name='vet name')
    notes = models.CharField(max_length=280, blank=True, null=True) 
    class Meta:
        verbose_name_plural = "Veterinarians"
    def __str__(self):
        return 'Name: {}, id: {}'.format(self.vet_name, self.id)
    def serialize(self):
        return {
            "id": self.id,
            "vet_name": self.vet_name,
            "notes": self.notes,
        }

class Client(models.Model):
    id = models.AutoField(primary_key=True)
    client_name = models.CharField(max_length=80, unique=True, blank=False, verbose_name='client_name')
    notes = models.CharField(max_length=280, blank=True, null=True) 
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, blank=False, null=True, related_name="client_author")
    class Meta:
        verbose_name_plural = "Clients"
    def __str__(self):
        return 'Name: {}, id: {}'.format(self.client_name, self.id)
    def serialize(self):
        return {
            "id": self.id,
            "client_name": self.client_name,
            "notes": self.notes,
            "created_by": self.created_by.username,
        }


class Pet(models.Model):
    id = models.AutoField(primary_key=True)
    pet_name = models.CharField(max_length=80, blank=False, unique=True, verbose_name='pet_name')
    owner = models.ForeignKey(Client, on_delete=models.CASCADE, blank=False, related_name="owner")
    notes = models.CharField(max_length=280, blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, blank=False, null=True, related_name="pet_author")
    class Meta:
        verbose_name_plural = "Pets"
    def __str__(self):
        return 'Name: {}, id: {}'.format(self.pet_name, self.id)
    def serialize(self):
        return {
            "id": self.id,
            "pet_name": self.pet_name,
            "owner_name": self.owner.client_name,
            "owner_id":self.owner.id,
            "notes": self.notes,
            "created_by": self.created_by.username,
        }


class Appointment(models.Model):
    TIMESLOT_LIST = (
        (0, '09:00 – 09:30'),
        (1, '09:30 – 10:00'),
        (2, '10:00 – 10:30'),
        (3, '10:30 – 11:00'),
        (4, '11:00 – 11:30'),
        (5, '11:30 – 12:00'),
        (6, '12:00 – 12:30'),
        (7, '12:30 – 13:00'),
        (8, '13:00 – 13:30'),
        (9, '13:30 – 14:00'),
        (10, '14:00 – 14:30'),
        (11, '14:30 – 15:00'),
        (12, '15:00 – 15:30'),
        (13, '15:30 – 16:00'),
        (14, '16:00 – 16:30'),
        (15, '16:30 – 17:00'),
        (16, '17:00 – 17:30'),
        (17, '17:30 – 18:00')
    )
    id = models.AutoField(primary_key=True)
    vet = models.ForeignKey(Veterinarian, on_delete=models.PROTECT, blank=False, null=True, related_name="vet")
    client = models.ForeignKey(Client, on_delete=models.CASCADE, blank=False, related_name="client")
    pet = models.ForeignKey(Pet, on_delete=models.CASCADE, blank=False, related_name="pet")
    appointment_date = models.DateField(auto_now=False, auto_now_add=False)
    timeslot = models.IntegerField(choices=TIMESLOT_LIST)
    notes = models.CharField(max_length=280, blank=True, null=True) 
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, blank=False, null=True, related_name="author")
    class Meta:
        verbose_name_plural = "Appointments"
        unique_together = ('vet', 'appointment_date', 'timeslot')
    def __str__(self):
        return 'Appointment set for {} at {}'.format(self.vet.vet_name, self.appointment_date)
    def serialize(self):
        return {
            "id": self.id,
            "vet": self.vet.vet_name,
            "vet_id":self.vet.id,
            "client":self.client.client_name,
            "client_id":self.client.id,
            "pet":self.pet.pet_name,
            "pet_id":self.pet.id,
            "appointment_date": self.appointment_date.strftime("%m %d %Y"),
            "timeslot": self.time,
            "notes": self.notes,
            "created_at": self.created_at.strftime("%b %d %Y, %I:%M %p"),
            "created_by": self.created_by.username,
        }
    @property
    def time(self):
        return self.TIMESLOT_LIST[self.timeslot][1]