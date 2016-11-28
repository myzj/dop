# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('atm', '0005_auto_20161125_1350'),
    ]

    operations = [
        migrations.AddField(
            model_name='projectmember',
            name='is_author',
            field=models.BooleanField(default=False, verbose_name='\u662f\u5426\u4e3a\u9879\u76ee\u7ba1\u7406\u5458'),
        ),
        migrations.AlterField(
            model_name='metadata',
            name='position',
            field=models.SmallIntegerField(default=1, verbose_name='Postion', choices=[(1, b'ReqHeader'), (2, b'ReqPath'), (3, b'ReqQueryString'), (4, b'ReqBody'), (5, b'ReqCookie'), (6, b'RespHeader'), (7, b'RespBody')]),
        ),
    ]
