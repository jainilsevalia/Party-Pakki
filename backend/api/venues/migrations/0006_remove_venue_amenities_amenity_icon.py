# Generated by Django 4.0.3 on 2022-03-19 15:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('venues', '0005_remove_amenity_icon_remove_amenity_venue_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='venue',
            name='amenities',
        ),
        migrations.AddField(
            model_name='amenity',
            name='icon',
            field=models.ImageField(blank=True, upload_to='media/amenities/'),
        ),
    ]
