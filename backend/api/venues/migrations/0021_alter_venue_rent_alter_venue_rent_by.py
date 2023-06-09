# Generated by Django 4.0.3 on 2022-04-22 06:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('venues', '0020_alter_review_rating_alter_review_user_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='venue',
            name='rent',
            field=models.FloatField(blank=True, max_length=25, null=True),
        ),
        migrations.AlterField(
            model_name='venue',
            name='rent_by',
            field=models.CharField(blank=True, choices=[('hour', 'hour'), ('day', 'day'), ('week', 'week'), ('month', 'month'), ('plate', 'plate')], max_length=25, null=True),
        ),
    ]
