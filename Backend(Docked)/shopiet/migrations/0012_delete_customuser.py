# Generated by Django 5.0 on 2024-05-05 16:09

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('shopiet', '0011_remove_customuser_user'),
    ]

    operations = [
        migrations.DeleteModel(
            name='CustomUser',
        ),
    ]
