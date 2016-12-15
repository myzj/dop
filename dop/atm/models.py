# -*- coding:utf-8 -*-
from django.db import models
from django.contrib.auth.models import User


# Method type 请求类型
mothod_types = (
    (1, "GET"),
    (2, "POST"),
    (3, "PUT"),
    (4, "DELETE"),
)

# content types 
content_types = (
    (1, "application/json"),
    (2, "text/html"),
    (3, "x-www-form-urlencode"),
)

# position types
position_types = (
    (1, "Request"),
    (2, "Response"),
)

# role types
role_types = (
    (1, "普通用户"),
    (2, "管理员"),
    (3, "超级管理员"),
)

# 团队
class Team(models.Model):
    team_name = models.CharField(verbose_name=u"团队名称", max_length=200, unique=True, null=True, blank=True)
    description = models.TextField(verbose_name=u"团队描述", null=True, blank=True)
    remark = models.TextField(verbose_name=u"备注", null=True, blank=True)
    pic_url = models.CharField(verbose_name=u"图片路径", max_length=500, null=True, blank=True)
    is_active = models.BooleanField(verbose_name=u"是否启用", default=True)
    is_deleted = models.BooleanField(verbose_name=u"是否已删除", default=False)
    author = models.ForeignKey(User, verbose_name=u"创建人", related_name=u"team_author", null=True)
    modifier = models.ForeignKey(User, verbose_name=u"修改人", related_name=u"team_modifier", null=True, blank=True)
    ctime = models.DateTimeField(verbose_name=u"创建时间", auto_now_add=True)
    utime = models.DateTimeField(verbose_name=u"更新时间", auto_now=True)

    def __unicode__(self):
        return u'id={0}  {1}'.format(self.id, self.team_name)

    class Meta:
        verbose_name = u"团队"
        verbose_name_plural = verbose_name
        db_table = "team"


# 项目
class Project(models.Model):
    team = models.ForeignKey(Team, verbose_name=u"团队", related_name=u"project", null=True)
    project_name = models.CharField(verbose_name=u"项目名称", unique=True, max_length=200, null=True, blank=True)
    description = models.TextField(verbose_name=u"项目描述", null=True, blank=True)
    pic_url = models.CharField(verbose_name=u"图片路径", max_length=500, null=True, blank=True)
    host = models.CharField(verbose_name=u"Host", max_length=200, null=True, blank=True)
    remark = models.TextField(verbose_name=u"备注", null=True, blank=True)
    is_active = models.BooleanField(verbose_name=u"是否启用", default=True)
    is_deleted = models.BooleanField(verbose_name=u"是否已删除", default=False)
    author = models.ForeignKey(User, verbose_name=u"创建人", related_name=u"project_author", null=True)
    modifier = models.ForeignKey(User, verbose_name=u"修改人", related_name=u"project_modifier", null=True, blank=True)
    ctime = models.DateTimeField(verbose_name=u"创建时间", auto_now_add=True)
    utime = models.DateTimeField(verbose_name=u"更新时间", auto_now=True)

    def __unicode__(self):
        return u'id={0}  {1}'.format(self.id, self.project_name)

    class Meta:
        verbose_name = u"项目"
        verbose_name_plural = verbose_name
        db_table = "project"


# 项目人员
class ProjectMember(models.Model):
    project = models.ForeignKey(Project, verbose_name=u"项目", related_name=u"projectmember", null=True, blank=True)
    user = models.ForeignKey(User, verbose_name=u"成员", related_name=u"projectmember", null=True, blank=True)
    is_author = models.BooleanField(verbose_name=u"是否为项目管理员", default=False)
    role = models.SmallIntegerField(verbose_name=u"用户角色", choices=role_types, default=1)
    is_active = models.BooleanField(verbose_name=u"是否启用", default=True)
    is_deleted = models.BooleanField(verbose_name=u"是否已删除", default=False)
    author = models.ForeignKey(User, verbose_name=u"创建人", related_name=u"projectmember_author", null=True, blank=True)
    modifier = models.ForeignKey(User, verbose_name=u"修改人", related_name=u"projectmember_modifier", null=True, blank=True)
    ctime = models.DateTimeField(verbose_name=u"创建时间", auto_now_add=True)
    utime = models.DateTimeField(verbose_name=u"更新时间", auto_now=True)

    class Meta:
        verbose_name = u"项目人员"
        verbose_name_plural = verbose_name
        db_table = "projectmember"


# API应用接口
class Interface(models.Model):
    project = models.ForeignKey(Project, verbose_name=u"项目", related_name=u"interface", null=True, blank=True)
    interface_name = models.CharField(verbose_name=u"API接口名称", max_length=200, null=True, blank=True)
    description = models.TextField(verbose_name=u"API接口描述", null=True, blank=True)
    url = models.CharField(verbose_name=u"请求地址", max_length=200, null=True, blank=True)
    tags = models.CharField(verbose_name=u"标签", max_length=500, null=True, blank=True)
    method = models.SmallIntegerField(verbose_name=u"请求类型", choices=mothod_types, default=1)
    mockdata = models.TextField(verbose_name=u"模拟数据", null=True, blank=True)
    content_type = models.SmallIntegerField(verbose_name=u"Content type", choices=content_types, default=1)
    remark = models.TextField(verbose_name=u"备注", null=True, blank=True)
    is_active = models.BooleanField(verbose_name=u"是否启用", default=True)
    is_deleted = models.BooleanField(verbose_name=u"是否已删除", default=False)
    author = models.ForeignKey(User, verbose_name=u"创建人", related_name=u"interface_author", null=True)
    modifier = models.ForeignKey(User, verbose_name=u"修改人", related_name=u"interface_modifier", null=True, blank=True)
    ctime = models.DateTimeField(verbose_name=u"创建时间", auto_now_add=True)
    utime = models.DateTimeField(verbose_name=u"更新时间", auto_now=True)

    def __unicode__(self):
        return u'id={0}  {1}'.format(self.id, self.interface_name)

    class Meta:
        verbose_name = u"API应用接口"
        verbose_name_plural = verbose_name
        db_table = "interface"


# 元数据
class MetaData(models.Model):
    interface = models.ForeignKey(Interface, verbose_name=u"API应用接口", related_name=u"metadata", null=True, blank=True)
    position = models.SmallIntegerField(verbose_name=u"Postion", choices=position_types, default=1)
    metadata_name = models.CharField(verbose_name=u"元数据名称", max_length=200, null=True, blank=True)
    data = models.TextField(verbose_name=u"数据值", null=True, blank=True)
    remark = models.TextField(verbose_name=u"备注", null=True, blank=True)
    is_active = models.BooleanField(verbose_name=u"是否启用", default=True)
    is_deleted = models.BooleanField(verbose_name=u"是否已删除", default=False)
    author = models.ForeignKey(User, verbose_name=u"创建人", related_name=u"metadata_author", null=True)
    modifier = models.ForeignKey(User, verbose_name=u"修改人", related_name=u"metadata_modifier", null=True, blank=True)
    ctime = models.DateTimeField(verbose_name=u"创建时间", auto_now_add=True)
    utime = models.DateTimeField(verbose_name=u"更新时间", auto_now=True)

    class Meta:
        verbose_name = u"元数据"
        verbose_name_plural = verbose_name
        db_table = "metadata"


# 错误码
class ErrorCode(models.Model):
    interface = models.ForeignKey(Interface, verbose_name=u"API应用接口", related_name=u"errorcode", null=True, blank=True)
    error_name = models.CharField(verbose_name=u"错误码名称", max_length=50, null=True, blank=True)
    display_message = models.CharField(verbose_name=u"提示信息", max_length=200, null=True, blank=True)
    description = models.TextField(verbose_name=u"错误码描述", null=True, blank=True)
    remark = models.TextField(verbose_name=u"备注", null=True, blank=True)
    is_active = models.BooleanField(verbose_name=u"是否启用", default=True)
    is_deleted = models.BooleanField(verbose_name=u"是否已删除", default=False)
    author = models.ForeignKey(User, verbose_name=u"创建人", related_name=u"errorcode_author", null=True)
    modifier = models.ForeignKey(User, verbose_name=u"修改人", related_name=u"errorcode_modifier", null=True, blank=True)
    ctime = models.DateTimeField(verbose_name=u"创建时间", auto_now_add=True)
    utime = models.DateTimeField(verbose_name=u"更新时间", auto_now=True)

    class Meta:
        verbose_name = u"错误码"
        verbose_name_plural = verbose_name
        db_table = "errorcode"


# 锁接口信息
class LockInfo(models.Model):
    interface = models.ForeignKey(Interface, verbose_name=u"API应用接口", related_name=u"lockinfo", null=True, blank=True)
    lock_user = models.ForeignKey(User, verbose_name=u"锁表人", related_name=u"lockinfo", null=True, blank=True)
    is_locked = models.BooleanField(verbose_name=u"是否被锁", default=False)
    is_deleted = models.BooleanField(verbose_name=u"是否已删除", default=False)
    ctime = models.DateTimeField(verbose_name=u"创建时间", auto_now_add=True)
    utime = models.DateTimeField(verbose_name=u"更新时间", auto_now=True)

    class Meta:
        verbose_name = u"锁接口信息"
        verbose_name_plural = verbose_name
        db_table = "lockinfo"


# 修改记录
class EditHistory(models.Model):
    interface = models.ForeignKey(Interface, verbose_name=u"API应用接口", related_name=u"edithistory", null=True, blank=True)
    modifier = models.ForeignKey(User, verbose_name=u"修改人", related_name=u"edithistory", null=True, blank=True)
    content = models.TextField(verbose_name=u"修改内容", null=True, blank=True)
    is_deleted = models.BooleanField(verbose_name=u"是否已删除", default=False)
    ctime = models.DateTimeField(verbose_name=u"创建时间", auto_now_add=True)
    utime = models.DateTimeField(verbose_name=u"更新时间", auto_now=True)

    class Meta:
        verbose_name = u"修改记录"
        verbose_name_plural = verbose_name
        db_table = "edithistory"


# 代码模板
class CodeModel(models.Model):
    code_name = models.CharField(verbose_name=u"模板名称", max_length=200, null=True, blank=True)
    description = models.TextField(verbose_name=u"模板描述", null=True, blank=True)
    content = models.TextField(verbose_name=u"模板内容", null=True, blank=True)
    parent = models.ForeignKey('self', verbose_name=u"父模板", related_name=u"codemodel_parent", null=True, blank=True)
    author = models.ForeignKey(User, verbose_name=u"创建人", related_name=u"codemodel_author", null=True, blank=True)
    modifier = models.ForeignKey(User, verbose_name=u"修改人", related_name=u"codemodel_modifier", null=True, blank=True)
    is_active = models.BooleanField(verbose_name=u"是否启用", default=True)
    is_deleted = models.BooleanField(verbose_name=u"是否已删除", default=False)
    ctime = models.DateTimeField(verbose_name=u"创建时间", auto_now_add=True)
    utime = models.DateTimeField(verbose_name=u"更新时间", auto_now=True)

    def __unicode__(self):
        return u'id={0}  {1}'.format(self.id, self.code_name)

    class Meta:
        verbose_name = u"代码模板"
        verbose_name_plural = verbose_name
        db_table = "codemodel"
