# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('atm', '0009_projectmember_role'),
    ]

    operations = [
        migrations.AddField(
            model_name='projectmember',
            name='author',
            field=models.ForeignKey(related_name='projectmember_author', verbose_name='\u521b\u5efa\u4eba', blank=True, to=settings.AUTH_USER_MODEL, null=True),
        ),
        migrations.AddField(
            model_name='projectmember',
            name='modifier',
            field=models.ForeignKey(related_name='projectmember_modifier', verbose_name='\u4fee\u6539\u4eba', blank=True, to=settings.AUTH_USER_MODEL, null=True),
        ),
    ]
