# Generated by Django 5.0 on 2024-05-06 10:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shopiet', '0013_profile_saveditem'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='other',
            field=models.URLField(blank=True),
        ),
    ]