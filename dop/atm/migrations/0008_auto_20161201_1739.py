# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('atm', '0007_auto_20161128_1445'),
    ]

    operations = [
        migrations.AlterField(
            model_name='metadata',
            name='position',
            field=models.SmallIntegerField(default=1, verbose_name='Postion', choices=[(1, b'Request'), (2, b'Response')]),
        ),
        migrations.AlterUniqueTogether(
            name='interface',
            unique_together=set([]),
        ),
    ]
