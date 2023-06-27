# Generated by Django 4.1.5 on 2023-05-16 14:05

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('paw', '0007_alter_appointment_timeslot'),
    ]

    operations = [
        migrations.CreateModel(
            name='Client',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('client_name', models.CharField(max_length=80, unique=True, verbose_name='client name')),
                ('notes', models.CharField(blank=True, max_length=280, null=True)),
            ],
            options={
                'verbose_name_plural': 'Clients',
            },
        ),
        migrations.CreateModel(
            name='Pet',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('pet_name', models.CharField(max_length=80, unique=True, verbose_name='pet name')),
                ('notes', models.CharField(blank=True, max_length=280, null=True)),
                ('owner', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='owner', to='paw.client')),
            ],
            options={
                'verbose_name_plural': 'Pets',
            },
        ),
    ]
