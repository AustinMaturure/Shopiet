# Generated by Django 5.0 on 2024-04-12 14:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shopiet', '0003_images_image_images_item_category_item_category'),
    ]

    operations = [
        migrations.AddField(
            model_name='item',
            name='item_condition',
            field=models.CharField(choices=[('love', 'Needs Love'), ('used', 'Used'), ('like_new', 'Like New'), ('new', 'New')], default='used', max_length=10),
        ),
    ]