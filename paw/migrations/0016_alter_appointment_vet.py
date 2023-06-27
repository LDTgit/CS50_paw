# Generated by Django 4.1.5 on 2023-06-14 14:00

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('paw', '0015_alter_appointment_vet'),
    ]

    operations = [
        migrations.AlterField(
            model_name='appointment',
            name='vet',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='vet', to='paw.veterinarian'),
        ),
    ]