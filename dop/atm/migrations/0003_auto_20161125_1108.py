# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('atm', '0002_interface_mockdata'),
    ]

    operations = [
        migrations.AlterField(
            model_name='team',
            name='modifier',
            field=models.ForeignKey(related_name='team_modifier', verbose_name='\u4fee\u6539\u4eba', blank=True, to=settings.AUTH_USER_MODEL, null=True),
        ),
    ]
