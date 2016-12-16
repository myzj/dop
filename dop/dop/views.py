# -*- coding: utf-8 -*-
from django.shortcuts import render
from atm.atm_api import login_check
from atm.models import Project
from django.http import HttpResponseRedirect



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
    path = request.get_full_path()
    path_params = path.split("?")
    if len(path_params) > 1 and "keyword" in request.GET:
        params['isHideAdd'] = 1
    params['title'] = 'Team列表'
    return render(request, 'atm/teamlist.html', params)


@login_check
def projectlist(request):
    params = {}
    path = request.get_full_path()
    path_params = path.split("?")
    if len(path_params) > 1 and "keyword" in request.GET:
        params['isHideAdd'] = 1
    params['title'] = '项目列表'
    return render(request, 'atm/projectlist.html', params)

@login_check
def apilist(request):

    projectId = request.GET.get('project',0)
    params = {}
    params['title'] = 'API列表'
    params['projectId'] = projectId
    return render(request, 'atm/apilist.html', params)


@login_check
def index(request):
    return HttpResponseRedirect("/teamlist")


@login_check
def api_edit(request):
    params = {}
    if 'project' in request.GET:
        params['project'] = request.GET['project']
        try:
            project = Project.objects.filter(id=int(request.GET['project']), is_deleted=False, is_active=True)
            if project:
                params['team'] = project[0].team.id
        except BaseException:
            params['team'] = None
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

@login_check
def my_project(request):
    params = {}
    params['title'] = '我的项目'
    return render(request, 'atm/my_project.html', params)


def register(request):
    params = {'title': u'用户注册'}
    return render(request, 'register.html', params)

