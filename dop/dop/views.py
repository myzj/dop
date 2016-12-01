# -*- coding: utf-8 -*-
from django.shortcuts import render
from atm.atm_api import login_check
from atm.models import Team
from atm.common import except_info


def test(request):
    params = {}
    params['title'] = 'test'
    return render(request, 'test.html', params)


def login(request):
    params = {}
    params['title'] = '登录'
    return render(request, 'login.html', params)


@login_check
def teamlist(request):
    params = {}
    if request.GET and request.GET['keyword'] != '':
        params['isHideAdd'] = 1
    params['title'] = 'Team列表'
    return render(request, 'atm/teamlist.html', params)


@login_check
def projectlist(request):
    params = {}
    params['title'] = '项目列表'
    return render(request, 'atm/projectlist.html', params)

@login_check
def apilist(request):
    params = {}
    params['title'] = 'API列表'
    return render(request, 'atm/apilist.html', params)


@login_check
def index(request):
    params = {}
    params['title'] = '首页'
    return render(request, 'index.html', params)


@login_check
def api_edit(request):
    params = {}
    params['title'] = 'api编辑'
    return render(request, 'atm/api_edit.html', params)


@login_check
def search_page(request):
    params = {}
    params['title'] = '查询页面'
    return render(request, 'atm/search.html', params)


@login_check
def search_api(request):
    params = {}
    params['title'] = '查询页面'
    return render(request, 'atm/search_api.html', params)

