# Generated by Django 4.1.5 on 2023-05-19 12:58

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('paw', '0008_client_pet'),
    ]

    operations = [
        migrations.AddField(
            model_name='appointment',
            name='client',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='client', to='paw.client'),
        ),
    ]
