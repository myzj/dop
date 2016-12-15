# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='EditHistory',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('content', models.TextField(null=True, verbose_name='\u4fee\u6539\u5185\u5bb9', blank=True)),
                ('is_deleted', models.BooleanField(default=False, verbose_name='\u662f\u5426\u5df2\u5220\u9664')),
                ('ctime', models.DateTimeField(auto_now_add=True, verbose_name='\u521b\u5efa\u65f6\u95f4')),
                ('utime', models.DateTimeField(auto_now=True, verbose_name='\u66f4\u65b0\u65f6\u95f4')),
            ],
            options={
                'db_table': 'edithistory',
                'verbose_name': '\u4fee\u6539\u8bb0\u5f55',
                'verbose_name_plural': '\u4fee\u6539\u8bb0\u5f55',
            },
        ),
        migrations.CreateModel(
            name='ErrorCode',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('error_name', models.CharField(max_length=50, null=True, verbose_name='\u9519\u8bef\u7801\u540d\u79f0', blank=True)),
                ('display_message', models.CharField(max_length=200, null=True, verbose_name='\u63d0\u793a\u4fe1\u606f', blank=True)),
                ('description', models.TextField(null=True, verbose_name='\u9519\u8bef\u7801\u63cf\u8ff0', blank=True)),
                ('remark', models.TextField(null=True, verbose_name='\u5907\u6ce8', blank=True)),
                ('is_active', models.BooleanField(default=True, verbose_name='\u662f\u5426\u542f\u7528')),
                ('is_deleted', models.BooleanField(default=False, verbose_name='\u662f\u5426\u5df2\u5220\u9664')),
                ('ctime', models.DateTimeField(auto_now_add=True, verbose_name='\u521b\u5efa\u65f6\u95f4')),
                ('utime', models.DateTimeField(auto_now=True, verbose_name='\u66f4\u65b0\u65f6\u95f4')),
                ('author', models.ForeignKey(related_name='errorcode_author', verbose_name='\u521b\u5efa\u4eba', to=settings.AUTH_USER_MODEL, null=True)),
            ],
            options={
                'db_table': 'errorcode',
                'verbose_name': '\u9519\u8bef\u7801',
                'verbose_name_plural': '\u9519\u8bef\u7801',
            },
        ),
        migrations.CreateModel(
            name='Interface',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('interface_name', models.CharField(max_length=200, null=True, verbose_name='API\u63a5\u53e3\u540d\u79f0', blank=True)),
                ('description', models.TextField(null=True, verbose_name='API\u63a5\u53e3\u63cf\u8ff0', blank=True)),
                ('url', models.CharField(max_length=200, unique=True, null=True, verbose_name='\u8bf7\u6c42\u5730\u5740', blank=True)),
                ('method', models.SmallIntegerField(default=1, verbose_name='\u8bf7\u6c42\u7c7b\u578b', choices=[(1, b'GET'), (2, b'POST'), (3, b'PUT'), (4, b'DELETE')])),
                ('content_type', models.SmallIntegerField(default=1, verbose_name='Content type', choices=[(1, b'application/json'), (2, b'text/html'), (3, b'x-www-form-urlencode')])),
                ('remark', models.TextField(null=True, verbose_name='\u5907\u6ce8', blank=True)),
                ('is_active', models.BooleanField(default=True, verbose_name='\u662f\u5426\u542f\u7528')),
                ('is_deleted', models.BooleanField(default=False, verbose_name='\u662f\u5426\u5df2\u5220\u9664')),
                ('ctime', models.DateTimeField(auto_now_add=True, verbose_name='\u521b\u5efa\u65f6\u95f4')),
                ('utime', models.DateTimeField(auto_now=True, verbose_name='\u66f4\u65b0\u65f6\u95f4')),
                ('author', models.ForeignKey(related_name='interface_author', verbose_name='\u521b\u5efa\u4eba', to=settings.AUTH_USER_MODEL, null=True)),
                ('modifier', models.ForeignKey(related_name='interface_modifier', verbose_name='\u4fee\u6539\u4eba', to=settings.AUTH_USER_MODEL, null=True)),
            ],
            options={
                'db_table': 'interface',
                'verbose_name': 'API\u5e94\u7528\u63a5\u53e3',
                'verbose_name_plural': 'API\u5e94\u7528\u63a5\u53e3',
            },
        ),
        migrations.CreateModel(
            name='LockInfo',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('is_locked', models.BooleanField(default=False, verbose_name='\u662f\u5426\u88ab\u9501')),
                ('is_deleted', models.BooleanField(default=False, verbose_name='\u662f\u5426\u5df2\u5220\u9664')),
                ('ctime', models.DateTimeField(auto_now_add=True, verbose_name='\u521b\u5efa\u65f6\u95f4')),
                ('utime', models.DateTimeField(auto_now=True, verbose_name='\u66f4\u65b0\u65f6\u95f4')),
                ('interface', models.ForeignKey(related_name='lockinfo', verbose_name='API\u5e94\u7528\u63a5\u53e3', to='atm.Interface', null=True)),
                ('lock_user', models.ForeignKey(related_name='lockinfo', verbose_name='\u9501\u8868\u4eba', to=settings.AUTH_USER_MODEL, null=True)),
            ],
            options={
                'db_table': 'lockinfo',
                'verbose_name': '\u9501\u63a5\u53e3\u4fe1\u606f',
                'verbose_name_plural': '\u9501\u63a5\u53e3\u4fe1\u606f',
            },
        ),
        migrations.CreateModel(
            name='MetaData',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('position', models.SmallIntegerField(default=1, verbose_name='Postion', choices=[(1, b'ReqHeader'), (2, b'ReqPath'), (3, b'ReqQueryString'), (4, b'ReqForm'), (5, b'ReqBody'), (6, b'ReqCookie'), (7, b'RespHeader'), (8, b'RespBody ')])),
                ('metadata_name', models.CharField(max_length=200, null=True, verbose_name='\u5143\u6570\u636e\u540d\u79f0', blank=True)),
                ('data', models.TextField(null=True, verbose_name='\u6570\u636e\u503c', blank=True)),
                ('remark', models.TextField(null=True, verbose_name='\u5907\u6ce8', blank=True)),
                ('is_active', models.BooleanField(default=True, verbose_name='\u662f\u5426\u542f\u7528')),
                ('is_deleted', models.BooleanField(default=False, verbose_name='\u662f\u5426\u5df2\u5220\u9664')),
                ('ctime', models.DateTimeField(auto_now_add=True, verbose_name='\u521b\u5efa\u65f6\u95f4')),
                ('utime', models.DateTimeField(auto_now=True, verbose_name='\u66f4\u65b0\u65f6\u95f4')),
                ('author', models.ForeignKey(related_name='metadata_author', verbose_name='\u521b\u5efa\u4eba', to=settings.AUTH_USER_MODEL, null=True)),
                ('interface', models.ForeignKey(related_name='metadata', verbose_name='API\u5e94\u7528\u63a5\u53e3', to='atm.Interface', null=True)),
                ('modifier', models.ForeignKey(related_name='metadata_modifier', verbose_name='\u4fee\u6539\u4eba', to=settings.AUTH_USER_MODEL, null=True)),
            ],
            options={
                'db_table': 'metadata',
                'verbose_name': '\u5143\u6570\u636e',
                'verbose_name_plural': '\u5143\u6570\u636e',
            },
        ),
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('project_name', models.CharField(max_length=200, null=True, verbose_name='\u9879\u76ee\u540d\u79f0', blank=True)),
                ('description', models.TextField(null=True, verbose_name='\u9879\u76ee\u63cf\u8ff0', blank=True)),
                ('host', models.CharField(max_length=200, null=True, verbose_name='Host', blank=True)),
                ('remark', models.TextField(null=True, verbose_name='\u5907\u6ce8', blank=True)),
                ('is_active', models.BooleanField(default=True, verbose_name='\u662f\u5426\u542f\u7528')),
                ('is_deleted', models.BooleanField(default=False, verbose_name='\u662f\u5426\u5df2\u5220\u9664')),
                ('ctime', models.DateTimeField(auto_now_add=True, verbose_name='\u521b\u5efa\u65f6\u95f4')),
                ('utime', models.DateTimeField(auto_now=True, verbose_name='\u66f4\u65b0\u65f6\u95f4')),
                ('author', models.ForeignKey(related_name='project_author', verbose_name='\u521b\u5efa\u4eba', to=settings.AUTH_USER_MODEL, null=True)),
                ('modifier', models.ForeignKey(related_name='project_modifier', verbose_name='\u4fee\u6539\u4eba', to=settings.AUTH_USER_MODEL, null=True)),
            ],
            options={
                'db_table': 'project',
                'verbose_name': '\u9879\u76ee',
                'verbose_name_plural': '\u9879\u76ee',
            },
        ),
        migrations.CreateModel(
            name='ProjectMember',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('is_active', models.BooleanField(default=True, verbose_name='\u662f\u5426\u542f\u7528')),
                ('is_deleted', models.BooleanField(default=False, verbose_name='\u662f\u5426\u5df2\u5220\u9664')),
                ('ctime', models.DateTimeField(auto_now_add=True, verbose_name='\u521b\u5efa\u65f6\u95f4')),
                ('utime', models.DateTimeField(auto_now=True, verbose_name='\u66f4\u65b0\u65f6\u95f4')),
                ('project', models.ForeignKey(related_name='projectmember', verbose_name='\u9879\u76ee', to='atm.Project', null=True)),
                ('user', models.ForeignKey(related_name='projectmember', verbose_name='\u6210\u5458', to=settings.AUTH_USER_MODEL, null=True)),
            ],
            options={
                'db_table': 'projectmember',
                'verbose_name': '\u9879\u76ee\u4eba\u5458',
                'verbose_name_plural': '\u9879\u76ee\u4eba\u5458',
            },
        ),
        migrations.CreateModel(
            name='Team',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('team_name', models.CharField(max_length=200, unique=True, null=True, verbose_name='\u56e2\u961f\u540d\u79f0', blank=True)),
                ('description', models.TextField(null=True, verbose_name='\u56e2\u961f\u63cf\u8ff0', blank=True)),
                ('remark', models.TextField(null=True, verbose_name='\u5907\u6ce8', blank=True)),
                ('is_active', models.BooleanField(default=True, verbose_name='\u662f\u5426\u542f\u7528')),
                ('is_deleted', models.BooleanField(default=False, verbose_name='\u662f\u5426\u5df2\u5220\u9664')),
                ('ctime', models.DateTimeField(auto_now_add=True, verbose_name='\u521b\u5efa\u65f6\u95f4')),
                ('utime', models.DateTimeField(auto_now=True, verbose_name='\u66f4\u65b0\u65f6\u95f4')),
                ('author', models.ForeignKey(related_name='team_author', verbose_name='\u521b\u5efa\u4eba', to=settings.AUTH_USER_MODEL, null=True)),
                ('modifier', models.ForeignKey(related_name='team_modifier', verbose_name='\u4fee\u6539\u4eba', to=settings.AUTH_USER_MODEL, null=True)),
            ],
            options={
                'db_table': 'team',
                'verbose_name': '\u56e2\u961f',
                'verbose_name_plural': '\u56e2\u961f',
            },
        ),
        migrations.AddField(
            model_name='project',
            name='team',
            field=models.ForeignKey(related_name='project', verbose_name='\u56e2\u961f', to='atm.Team', null=True),
        ),
        migrations.AddField(
            model_name='interface',
            name='project',
            field=models.ForeignKey(related_name='interface', verbose_name='\u9879\u76ee', to='atm.Project', null=True),
        ),
        migrations.AddField(
            model_name='errorcode',
            name='interface',
            field=models.ForeignKey(related_name='errorcode', verbose_name='API\u5e94\u7528\u63a5\u53e3', to='atm.Interface', null=True),
        ),
        migrations.AddField(
            model_name='errorcode',
            name='modifier',
            field=models.ForeignKey(related_name='errorcode_modifier', verbose_name='\u4fee\u6539\u4eba', to=settings.AUTH_USER_MODEL, null=True),
        ),
        migrations.AddField(
            model_name='edithistory',
            name='interface',
            field=models.ForeignKey(related_name='edithistory', verbose_name='API\u5e94\u7528\u63a5\u53e3', to='atm.Interface', null=True),
        ),
        migrations.AddField(
            model_name='edithistory',
            name='modifier',
            field=models.ForeignKey(related_name='edithistory', verbose_name='\u4fee\u6539\u4eba', to=settings.AUTH_USER_MODEL, null=True),
        ),
    ]
