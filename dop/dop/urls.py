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


urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),

    url(r'(?i)^api/req_login/?$', atm_api.req_login),  # 登录接口
    url(r'(?i)^api/req_logout/?$', atm_api.req_logout),  # 退出登录
    url(r'(?i)^api/req_team_list/?$', atm_api.req_team),  # 获取团队列表
    url(r'(?i)^api/add_team/?$', atm_api.add_team),  # 增加团队列表
    url(r'(?i)^api/team_name_check/?$', atm_api.team_name_check),  # 检查团队名称是否可用
    url(r'(?i)^api/req_project_list/?$', atm_api.req_project),  # 获取项目列表
    url(r'(?i)^api/project_name_check/?$', atm_api.project_name_check),  # 检查团队名称是否可用
    url(r'(?i)^api/add_project/?$', atm_api.add_project),  # 增加项目列表
    url(r'(?i)^api/req_api_list/?$', atm_api.req_api_list),  # 查询接口列表

    url(r'^test/?$', views.test),
    url(r'^login/?$', views.login),
    url(r'^index/?$', views.index),
    url(r'^teamlist/?$', views.teamlist),
    url(r'^apilist/?$', views.apilist),
    url(r'^api_edit/?$', views.api_edit),

    url(r'^$', RedirectView.as_view(url='/index/', permanent=True)),
    url(r'^static/(?P<path>.*)$', 'django.views.static.serve', {'document_root': STATICFILES_DIRS[0], 'show_indexes': True}),

]
