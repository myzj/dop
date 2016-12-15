# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('atm', '0011_codemodel'),
    ]

    operations = [
        migrations.AddField(
            model_name='codemodel',
            name='content',
            field=models.TextField(null=True, verbose_name='\u6a21\u677f\u5185\u5bb9', blank=True),
        ),
    ]
