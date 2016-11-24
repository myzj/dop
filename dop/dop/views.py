# -*- coding: utf-8 -*-
from django.shortcuts import render

def test(request):
    params = {}
    params['title'] = 'test'
    return render(request, 'test.html', params)

def login(request):
    params = {}
    params['title'] = '登录'
    return render(request, 'login.html', params)