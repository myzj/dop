# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('atm', '0010_auto_20161206_1038'),
    ]

    operations = [
        migrations.CreateModel(
            name='CodeModel',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('code_name', models.CharField(max_length=200, null=True, verbose_name='\u6a21\u677f\u540d\u79f0', blank=True)),
                ('description', models.TextField(null=True, verbose_name='\u6a21\u677f\u63cf\u8ff0', blank=True)),
                ('is_active', models.BooleanField(default=True, verbose_name='\u662f\u5426\u542f\u7528')),
                ('is_deleted', models.BooleanField(default=False, verbose_name='\u662f\u5426\u5df2\u5220\u9664')),
                ('ctime', models.DateTimeField(auto_now_add=True, verbose_name='\u521b\u5efa\u65f6\u95f4')),
                ('utime', models.DateTimeField(auto_now=True, verbose_name='\u66f4\u65b0\u65f6\u95f4')),
                ('author', models.ForeignKey(related_name='codemodel_author', verbose_name='\u521b\u5efa\u4eba', blank=True, to=settings.AUTH_USER_MODEL, null=True)),
                ('modifier', models.ForeignKey(related_name='codemodel_modifier', verbose_name='\u4fee\u6539\u4eba', blank=True, to=settings.AUTH_USER_MODEL, null=True)),
                ('parent', models.ForeignKey(related_name='codemodel_parent', verbose_name='\u7236\u6a21\u677f', blank=True, to='atm.CodeModel', null=True)),
            ],
            options={
                'db_table': 'codemodel',
                'verbose_name': '\u4ee3\u7801\u6a21\u677f',
                'verbose_name_plural': '\u4ee3\u7801\u6a21\u677f',
            },
        ),
    ]
