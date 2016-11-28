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

urlpatterns = [
    url(r'(?i)^admin/', include(admin.site.urls)),

    url(r'(?i)^api/req_login/?$', atm_api.req_login), # 登录接口
    url(r'(?i)^api/req_logout/?$', atm_api.req_logout), # 退出登录
    url(r'(?i)^api/req_team_list/?$', atm_api.req_team), # 获取团队列表

    url(r'^test/?$', views.test),
    url(r'^login/?$', views.login),
    url(r'^index/?$', views.index),
    url(r'^apilist/?$', views.apilist),

    url(r'^static/(?P<path>.*)$', 'django.views.static.serve', {'document_root': STATICFILES_DIRS[0], 'show_indexes': True}),

]
