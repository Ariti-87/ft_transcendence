# Generated by Django 4.2.3 on 2024-09-05 09:02

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('pong', '0002_game_user1_game_user2'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Game',
        ),
    ]
