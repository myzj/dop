# -*- coding: utf-8 -*-
from django.shortcuts import render

def test(request):
    params = {}
    params['title'] = 'test'
    return render(request, 'test.html', params)
