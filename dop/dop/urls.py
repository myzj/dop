# -*- coding:utf-8 -*-
"""dop URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import include, url
from django.contrib import admin
from dop import views
from atm import atm_api
from settings import STATICFILES_DIRS
from django.views.generic import RedirectView
import atm.interface as itf
urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),

    url(r'(?i)^api/req_login/?$', atm_api.req_login),  # 登录接口
    url(r'(?i)^api/req_logout/?$', atm_api.req_logout),  # 退出登录
    url(r'(?i)^api/req_team_list/?$', atm_api.req_team),  # 获取团队列表
    url(r'(?i)^api/add_team/?$', atm_api.add_team),  # 增加团队列表
    url(r'(?i)^api/team_name_check/?$', atm_api.team_name_check),  # 检查团队名称是否可用
    url(r'(?i)^api/req_project_list/?$', atm_api.req_project),  # 获取项目列表
    url(r'(?i)^api/project_name_check/?$', atm_api.project_name_check),  # 检查团队名称是否可用
    url(r'(?i)^api/get_user_by_name/?$', atm_api.get_user_by_name),  # 查询用户
    url(r'(?i)^api/add_project/?$', atm_api.add_project),  # 增加项目列表
    url(r'(?i)^api/edit_project/?$', atm_api.edit_project),  # 修改项目列表
    url(r'(?i)^api/req_api_list/?$', atm_api.req_api_list),  # 查询接口列表
    url(r'(?i)^api/qry/api_detail/?$', itf.qry_interface_detail),  # 查询API接口明细
    url(r'(?i)^api/add/new_api/?$', itf.add_interface),  # 新增API接口
    url(r'(?i)^api/mdf/api_info/?$', itf.update_interface),  # 修改API接口
    url(r'(?i)^api/del/api_info/?$', itf.delete_interface),  # 删除API接口
    url(r'(?i)^api/cancel/lock/?$', itf.cancel_lock),  # 解锁
    url(r'(?i)^api/check/data/?$', itf.check_data),  # 导入数据预检
    url(r'(?i)^api/qry/history/?$', itf.qry_edit_history),  # 查询API接口修改记录
    url(r'(?i)^api/qry/member/?$', itf.qry_project_member),  # 查询项目成员
    url(r'(?i)^api/add/member/?$', itf.add_project_member),  # 新增项目成员
    url(r'(?i)^api/mdf/member/?$', itf.update_project_member),  # 修改项目成员
    url(r'(?i)^api/del/member/?$', itf.delete_project_member),  # 删除项目成员
    url(r'(?i)^api/qry/api_code/?$', itf.qry_api_code),  # 查询API接口数据
    url(r'(?i)^api/qry/code_model/?$', itf.qry_code_model),  # 查询代码模板


    url(r'^mockdata/.', itf.mock_data),  # mock 请求处理
    url(r'^test/?$', views.test),
    url(r'^new/check_code/?$', itf.create_check_code),  # 产一个新的验证码
    url(r'^register/?$', views.register),  # 打开用户注册页面
    url(r'^new/user/?$', itf.user_register),  # 提交用户注册数据
    url(r'^login/?$', views.login),
    url(r'^index/?$', views.index),
    url(r'^teamlist/?$', views.teamlist),
    url(r'^projectlist/?$', views.projectlist),
    url(r'^apilist/?$', views.apilist),
    url(r'^api_edit/?$', views.api_edit),
    url(r'^my_project/?$', views.my_project),  # 我的项目

    url(r'^$', RedirectView.as_view(url='/index/', permanent=True)),
    url(r'^static/(?P<path>.*)$', 'django.views.static.serve', {'document_root': STATICFILES_DIRS[0], 'show_indexes': True}),

]
