# -*- coding:utf-8 -*-
from django.contrib import admin
from models import Team, Project, ProjectMember, Interface, MetaData, ErrorCode, LockInfo, EditHistory, CodeModel
from common import except_info


class TeamAdmin(admin.ModelAdmin):
    search_fields = ('id', 'team_name')
    list_display = ('id', 'team_name', 'description', 'pic_url', 'remark', 'is_active', 'is_deleted', 'author', 'modifier', 'ctime', 'utime',)


class ProjectAdmin(admin.ModelAdmin):
    search_fields = ('id', 'project_name')
    list_filter = ('team', 'author', 'modifier', 'is_active',)
    list_display = ('id', 'team', 'project_name', 'description', 'pic_url', 'host', 'remark', 'is_active', 'is_deleted', 'author', 'modifier', 'ctime', 'utime',)

    def get_search_results(self, request, queryset, search_term):
        queryset, use_distinct = super(ProjectAdmin, self).get_search_results(request, queryset, search_term)
        try:
            if 'id=' in search_term:
                id_split = search_term.split('=')
                if len(id_split) > 1:
                    team_id = id_split[1]
                    team_id = int(team_id)
                    team_filter = Team.objects.filter(id=team_id)
                    if team_filter:
                        queryset |= self.model.objects.filter(team=team_filter[0])
        except BaseException, ex:
            except_info(ex)
        return queryset, use_distinct


class ProjectMemberAdmin(admin.ModelAdmin):
    search_fields = ('id',)
    list_filter = ('project', 'user', 'role', 'author', 'modifier',)
    list_display = ('id', 'project', 'user', 'role', 'author', 'modifier', 'is_active', 'is_deleted', 'ctime', 'utime',)

    def get_search_results(self, request, queryset, search_term):
        queryset, use_distinct = super(ProjectMemberAdmin, self).get_search_results(request, queryset, search_term)
        try:
            if 'id=' in search_term:
                id_split = search_term.split('=')
                if len(id_split) > 1:
                    project_id = id_split[1]
                    project_id = int(project_id)
                    project_filter = Project.objects.filter(id=project_id)
                    if project_filter:
                        queryset |= self.model.objects.filter(project=project_filter[0])
        except BaseException, ex:
            except_info(ex)
        return queryset, use_distinct


class InterfaceAdmin(admin.ModelAdmin):
    search_fields = ('id', 'interface_name')
    list_filter = ('project', 'author', 'modifier',)
    list_display = ('id', 'project', 'interface_name', 'description', 'url', 'method', 'content_type', 'tags', 'mockdata', 'remark', 'is_active', 'is_deleted', 'author', 'modifier', 'ctime', 'utime',)

    def get_search_results(self, request, queryset, search_term):
        queryset, use_distinct = super(InterfaceAdmin, self).get_search_results(request, queryset, search_term)
        try:
            if 'id=' in search_term:
                id_split = search_term.split('=')
                if len(id_split) > 1:
                    project_id = id_split[1]
                    project_id = int(project_id)
                    project_filter = Project.objects.filter(id=project_id)
                    if project_filter:
                        queryset |= self.model.objects.filter(project=project_filter[0])
        except BaseException, ex:
            except_info(ex)
        return queryset, use_distinct


class MetaDataAdmin(admin.ModelAdmin):
    search_fields = ('id',)
    list_filter = ('interface', 'position', 'author', 'modifier', 'is_active',)
    list_display = ('id', 'interface', 'position', 'metadata_name', 'data', 'remark', 'is_active', 'is_deleted', 'author', 'modifier', 'ctime', 'utime',)

    def get_search_results(self, request, queryset, search_term):
        queryset, use_distinct = super(MetaDataAdmin, self).get_search_results(request, queryset, search_term)
        try:
            if 'id=' in search_term:
                id_split = search_term.split('=')
                if len(id_split) > 1:
                    api_id = id_split[1]
                    api_id = int(api_id)
                    interface_filter = Interface.objects.filter(id=api_id)
                    if interface_filter:
                        queryset |= self.model.objects.filter(interface=interface_filter[0])
        except BaseException, ex:
            except_info(ex)
        return queryset, use_distinct

class ErrorCodeAdmin(admin.ModelAdmin):
    search_fields = ('id', 'error_name')
    list_filter = ('interface', 'author', 'modifier', 'is_active',)
    list_display = ('id', 'interface', 'error_name', 'display_message', 'description', 'remark', 'is_active', 'is_deleted', 'author', 'modifier', 'ctime', 'utime',)

    def get_search_results(self, request, queryset, search_term):
        queryset, use_distinct = super(ErrorCodeAdmin, self).get_search_results(request, queryset, search_term)
        try:
            if 'id=' in search_term:
                id_split = search_term.split('=')
                if len(id_split) > 1:
                    api_id = id_split[1]
                    api_id = int(api_id)
                    interface_filter = Interface.objects.filter(id=api_id)
                    if interface_filter:
                        queryset |= self.model.objects.filter(interface=interface_filter[0])
        except BaseException, ex:
            except_info(ex)
        return queryset, use_distinct

class LockInfoAdmin(admin.ModelAdmin):
    search_fields = ('id', )
    list_filter = ('interface', 'lock_user', 'is_locked',)
    list_display = ('id', 'interface', 'lock_user', 'is_locked', 'is_deleted', 'ctime', 'utime',)

    def get_search_results(self, request, queryset, search_term):
        queryset, use_distinct = super(LockInfoAdmin, self).get_search_results(request, queryset, search_term)
        try:
            if 'id=' in search_term:
                id_split = search_term.split('=')
                if len(id_split) > 1:
                    api_id = id_split[1]
                    api_id = int(api_id)
                    interface_filter = Interface.objects.filter(id=api_id)
                    if interface_filter:
                        queryset |= self.model.objects.filter(interface=interface_filter[0])
        except BaseException, ex:
            except_info(ex)
        return queryset, use_distinct


class EditHistoryAdmin(admin.ModelAdmin):
    search_fields = ('id', )
    list_filter = ('interface', 'modifier',)
    list_display = ('id', 'interface', 'modifier', 'content', 'is_deleted', 'ctime', 'utime',)

    def get_search_results(self, request, queryset, search_term):
        queryset, use_distinct = super(EditHistoryAdmin, self).get_search_results(request, queryset, search_term)
        try:
            if 'id=' in search_term:
                id_split = search_term.split('=')
                if len(id_split) > 1:
                    api_id = id_split[1]
                    api_id = int(api_id)
                    interface_filter = Interface.objects.filter(id=api_id)
                    if interface_filter:
                        queryset |= self.model.objects.filter(interface=interface_filter[0])
        except BaseException, ex:
            except_info(ex)
        return queryset, use_distinct


class CodeModelAdmin(admin.ModelAdmin):
    search_fields = ('id', 'code_name')
    list_display = ('id', 'code_name', 'description', 'content', 'parent', 'author', 'modifier', 'is_active', 'is_deleted', 'ctime', 'utime',)


admin.site.register(Team, TeamAdmin)
admin.site.register(Project, ProjectAdmin)
admin.site.register(ProjectMember, ProjectMemberAdmin)
admin.site.register(Interface, InterfaceAdmin)
admin.site.register(MetaData, MetaDataAdmin)
admin.site.register(ErrorCode, ErrorCodeAdmin)
admin.site.register(LockInfo, LockInfoAdmin)
admin.site.register(EditHistory, EditHistoryAdmin)
admin.site.register(CodeModel, CodeModelAdmin)
