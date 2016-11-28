# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('atm', '0004_auto_20161125_1113'),
    ]

    operations = [
        migrations.AddField(
            model_name='interface',
            name='tags',
            field=models.CharField(max_length=500, null=True, verbose_name='\u6807\u7b7e', blank=True),
        ),
        migrations.AddField(
            model_name='project',
            name='pic_url',
            field=models.CharField(max_length=500, null=True, verbose_name='\u56fe\u7247\u8def\u5f84', blank=True),
        ),
        migrations.AddField(
            model_name='team',
            name='pic_url',
            field=models.CharField(max_length=500, null=True, verbose_name='\u56fe\u7247\u8def\u5f84', blank=True),
        ),
        migrations.AlterField(
            model_name='interface',
            name='url',
            field=models.CharField(max_length=200, null=True, verbose_name='\u8bf7\u6c42\u5730\u5740', blank=True),
        ),
        migrations.AlterUniqueTogether(
            name='interface',
            unique_together=set([('project', 'method', 'url')]),
        ),
    ]
