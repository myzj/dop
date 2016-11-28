# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('atm', '0006_auto_20161128_1417'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='project_name',
            field=models.CharField(max_length=200, unique=True, null=True, verbose_name='\u9879\u76ee\u540d\u79f0', blank=True),
        ),
    ]
