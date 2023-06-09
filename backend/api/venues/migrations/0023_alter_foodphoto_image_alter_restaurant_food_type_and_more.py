# Generated by Django 4.0.3 on 2022-04-23 12:55

import api.venues.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('venues', '0022_restaurant_foodphoto'),
    ]

    operations = [
        migrations.AlterField(
            model_name='foodphoto',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to=api.venues.models.food_photo_path),
        ),
        migrations.AlterField(
            model_name='restaurant',
            name='food_type',
            field=models.CharField(choices=[('Veg', 'Veg'), ('Non-veg', 'Non-veg'), ('Both', 'Both')], max_length=15),
        ),
        migrations.AlterField(
            model_name='venuephoto',
            name='image',
            field=models.ImageField(upload_to=api.venues.models.venue_photo_path),
        ),
    ]
