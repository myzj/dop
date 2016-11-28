# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('atm', '0003_auto_20161125_1108'),
    ]

    operations = [
        migrations.AlterField(
            model_name='edithistory',
            name='interface',
            field=models.ForeignKey(related_name='edithistory', verbose_name='API\u5e94\u7528\u63a5\u53e3', blank=True, to='atm.Interface', null=True),
        ),
        migrations.AlterField(
            model_name='edithistory',
            name='modifier',
            field=models.ForeignKey(related_name='edithistory', verbose_name='\u4fee\u6539\u4eba', blank=True, to=settings.AUTH_USER_MODEL, null=True),
        ),
        migrations.AlterField(
            model_name='errorcode',
            name='interface',
            field=models.ForeignKey(related_name='errorcode', verbose_name='API\u5e94\u7528\u63a5\u53e3', blank=True, to='atm.Interface', null=True),
        ),
        migrations.AlterField(
            model_name='errorcode',
            name='modifier',
            field=models.ForeignKey(related_name='errorcode_modifier', verbose_name='\u4fee\u6539\u4eba', blank=True, to=settings.AUTH_USER_MODEL, null=True),
        ),
        migrations.AlterField(
            model_name='interface',
            name='modifier',
            field=models.ForeignKey(related_name='interface_modifier', verbose_name='\u4fee\u6539\u4eba', blank=True, to=settings.AUTH_USER_MODEL, null=True),
        ),
        migrations.AlterField(
            model_name='interface',
            name='project',
            field=models.ForeignKey(related_name='interface', verbose_name='\u9879\u76ee', blank=True, to='atm.Project', null=True),
        ),
        migrations.AlterField(
            model_name='lockinfo',
            name='interface',
            field=models.ForeignKey(related_name='lockinfo', verbose_name='API\u5e94\u7528\u63a5\u53e3', blank=True, to='atm.Interface', null=True),
        ),
        migrations.AlterField(
            model_name='lockinfo',
            name='lock_user',
            field=models.ForeignKey(related_name='lockinfo', verbose_name='\u9501\u8868\u4eba', blank=True, to=settings.AUTH_USER_MODEL, null=True),
        ),
        migrations.AlterField(
            model_name='metadata',
            name='interface',
            field=models.ForeignKey(related_name='metadata', verbose_name='API\u5e94\u7528\u63a5\u53e3', blank=True, to='atm.Interface', null=True),
        ),
        migrations.AlterField(
            model_name='metadata',
            name='modifier',
            field=models.ForeignKey(related_name='metadata_modifier', verbose_name='\u4fee\u6539\u4eba', blank=True, to=settings.AUTH_USER_MODEL, null=True),
        ),
        migrations.AlterField(
            model_name='project',
            name='modifier',
            field=models.ForeignKey(related_name='project_modifier', verbose_name='\u4fee\u6539\u4eba', blank=True, to=settings.AUTH_USER_MODEL, null=True),
        ),
        migrations.AlterField(
            model_name='projectmember',
            name='project',
            field=models.ForeignKey(related_name='projectmember', verbose_name='\u9879\u76ee', blank=True, to='atm.Project', null=True),
        ),
        migrations.AlterField(
            model_name='projectmember',
            name='user',
            field=models.ForeignKey(related_name='projectmember', verbose_name='\u6210\u5458', blank=True, to=settings.AUTH_USER_MODEL, null=True),
        ),
    ]
