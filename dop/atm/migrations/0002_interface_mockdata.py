# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('atm', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='interface',
            name='mockdata',
            field=models.TextField(null=True, verbose_name='\u6a21\u62df\u6570\u636e', blank=True),
        ),
    ]
