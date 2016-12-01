# -*- coding:utf-8 -*-
from django.contrib import admin
from models import Team, Project, ProjectMember, Interface, MetaData, ErrorCode, LockInfo, EditHistory


class TeamAdmin(admin.ModelAdmin):
    search_fields = ('id', 'team_name')
    list_display = ('id', 'team_name', 'description', 'pic_url', 'remark', 'is_active', 'is_deleted', 'author', 'modifier', 'ctime', 'utime',)


class ProjectAdmin(admin.ModelAdmin):
    search_fields = ('id', 'project_name')
    list_display = ('id', 'team', 'project_name', 'description', 'pic_url', 'host', 'remark', 'is_active', 'is_deleted', 'author', 'modifier', 'ctime', 'utime',)


class ProjectMemberAdmin(admin.ModelAdmin):
    search_fields = ('id',)
    list_display = ('id', 'project', 'user', 'is_author', 'is_active', 'is_deleted', 'ctime', 'utime',)


class InterfaceAdmin(admin.ModelAdmin):
    search_fields = ('id', 'interface_name')
    list_display = ('id', 'project', 'interface_name', 'description', 'url', 'method', 'content_type', 'tags', 'mockdata', 'remark', 'is_active', 'is_deleted', 'author', 'modifier', 'ctime', 'utime',)


class MetaDataAdmin(admin.ModelAdmin):
    search_fields = ('id',)
    list_display = ('id', 'interface', 'position', 'metadata_name', 'data', 'remark', 'is_active', 'is_deleted', 'author', 'modifier', 'ctime', 'utime',)


class ErrorCodeAdmin(admin.ModelAdmin):
    search_fields = ('id', 'error_name')
    list_display = ('id', 'interface', 'error_name', 'display_message', 'description', 'remark', 'is_active', 'is_deleted', 'author', 'modifier', 'ctime', 'utime',)


class LockInfoAdmin(admin.ModelAdmin):
    search_fields = ('id', )
    list_display = ('id', 'interface', 'lock_user', 'is_locked', 'is_deleted', 'ctime', 'utime',)


class EditHistoryAdmin(admin.ModelAdmin):
    search_fields = ('id', )
    list_display = ('id', 'interface', 'modifier', 'content', 'is_deleted', 'ctime', 'utime',)


admin.site.register(Team, TeamAdmin)
admin.site.register(Project, ProjectAdmin)
admin.site.register(ProjectMember, ProjectMemberAdmin)
admin.site.register(Interface, InterfaceAdmin)
admin.site.register(MetaData, MetaDataAdmin)
admin.site.register(ErrorCode, ErrorCodeAdmin)
admin.site.register(LockInfo, LockInfoAdmin)
admin.site.register(EditHistory, EditHistoryAdmin)
