# Generated by Django 4.2.3 on 2024-09-02 11:35

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('pong', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='game',
            name='user1',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='user1', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='game',
            name='user2',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='user2', to=settings.AUTH_USER_MODEL),
        ),
    ]
