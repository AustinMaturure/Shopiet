# Generated by Django 5.0 on 2024-04-15 07:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shopiet', '0006_item_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='item',
            name='item_category_name',
            field=models.CharField(blank=True, max_length=150),
        ),
        migrations.AddField(
            model_name='item',
            name='item_username',
            field=models.CharField(blank=True, max_length=150),
        ),
    ]
