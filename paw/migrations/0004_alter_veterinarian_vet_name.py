# Generated by Django 4.1.5 on 2023-04-06 12:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('paw', '0003_alter_veterinarian_vet_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='veterinarian',
            name='vet_name',
            field=models.CharField(max_length=80, unique=True, verbose_name='vet name'),
        ),
    ]
