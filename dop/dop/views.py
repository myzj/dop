# -*- coding: utf-8 -*-
from django.shortcuts import render
from atm.atm_api import login_check


def test(request):
    params = {}
    params['title'] = 'test'
    return render(request, 'test.html', params)


def login(request):
    params = {}
    params['title'] = '登录'
    return render(request, 'login.html', params)

@login_check
def apilist(request):
    params = {}
    params['title'] = 'API列表'
    return render(request, 'apilist.html', params)

@login_check
def index(request):
    params = {}
    params['title'] = '首页'
    return render(request, 'index.html', params)