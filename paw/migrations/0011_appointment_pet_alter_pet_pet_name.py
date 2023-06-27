# Generated by Django 4.1.5 on 2023-05-23 09:12

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('paw', '0010_alter_client_client_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='appointment',
            name='pet',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='pet', to='paw.pet'),
        ),
        migrations.AlterField(
            model_name='pet',
            name='pet_name',
            field=models.CharField(max_length=80, unique=True, verbose_name='pet_name'),
        ),
    ]