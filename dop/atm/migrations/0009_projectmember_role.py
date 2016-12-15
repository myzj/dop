# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('atm', '0008_auto_20161201_1739'),
    ]

    operations = [
        migrations.AddField(
            model_name='projectmember',
            name='role',
            field=models.SmallIntegerField(default=1, verbose_name='\u7528\u6237\u89d2\u8272', choices=[(1, b'\xe6\x99\xae\xe9\x80\x9a\xe7\x94\xa8\xe6\x88\xb7'), (2, b'\xe7\xae\xa1\xe7\x90\x86\xe5\x91\x98'), (3, b'\xe8\xb6\x85\xe7\xba\xa7\xe7\xae\xa1\xe7\x90\x86\xe5\x91\x98')]),
        ),
    ]
