# Generated by Django 4.0.3 on 2022-03-19 13:58

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('venues', '0003_alter_amenity_venue'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='venue',
            name='images',
        ),
    ]
