# Generated by Django 5.0 on 2024-04-16 20:50

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('shopiet', '0008_item_m_description'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='item',
            name='m_description',
        ),
    ]