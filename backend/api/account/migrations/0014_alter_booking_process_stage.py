# Generated by Django 4.0.3 on 2022-04-16 06:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0013_alter_booking_event_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='booking',
            name='process_stage',
            field=models.CharField(choices=[('Requested', 'Requested'), ('Confirmed', 'Confirmed'), ('Cancelled', 'Cancelled'), ('Completed', 'Completed')], default='Requested', max_length=15),
        ),
    ]
