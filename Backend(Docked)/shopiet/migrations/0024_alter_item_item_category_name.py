# Generated by Django 5.0 on 2024-06-17 09:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shopiet', '0023_alter_message_timestamp'),
    ]

    operations = [
        migrations.AlterField(
            model_name='item',
            name='item_category_name',
            field=models.CharField(blank=True, db_index=True, max_length=150),
        ),
    ]
