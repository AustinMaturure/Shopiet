# Generated by Django 5.0 on 2024-06-11 14:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shopiet', '0021_delete_chats'),
    ]

    operations = [
        migrations.AddField(
            model_name='message',
            name='viewed',
            field=models.BooleanField(default=False),
        ),
    ]
