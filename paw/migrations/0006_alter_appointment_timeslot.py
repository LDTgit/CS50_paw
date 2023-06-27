# Generated by Django 4.1.5 on 2023-04-26 15:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('paw', '0005_appointment_timeslot_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='appointment',
            name='timeslot',
            field=models.CharField(choices=[(0, '09:00 – 09:30'), ('01', '09:30 – 10:00'), ('02', '10:00 – 10:30'), ('03', '10:30 – 11:00'), ('04', '11:00 – 11:30'), ('05', '11:30 – 12:00'), ('06', '12:00 – 12:30'), ('07', '12:30 – 13:00'), ('08', '13:00 – 13:30'), ('09', '13:30 – 14:00'), (10, '14:00 – 14:30'), (11, '14:30 – 15:00'), (12, '15:00 – 15:30'), (13, '15:30 – 16:00'), (14, '16:00 – 16:30'), (15, '16:30 – 17:00'), (16, '17:00 – 17:30'), (17, '17:30 – 18:00')], max_length=2),
        ),
    ]