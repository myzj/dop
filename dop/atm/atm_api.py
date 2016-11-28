# -*- coding:utf-8 -*-
import time
import datetime
from django.contrib.auth import authenticate
from django.core import paginator
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect
from common import JSONResponse
from common import except_info
from dop.errorcode import getMessage
from django.views.decorators.csrf import csrf_exempt
from atm.models import Team

# 用户登录
def req_login(request):
    queryset = {'timestamp': int(time.mktime(
        time.strptime(datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'), '%Y-%m-%d %H:%M:%S'))), \
        'success': False, 'errorcode': 0, 'errormsg': ''}
    if request.method == "GET":
        try:
            params = request.GET.dict()
            required_fields = ["username", "password"]
            errmsg = ''
            for field in required_fields:
                if field not in params or not params[field]:
                    errmsg += field + ', '
            if errmsg:
                queryset['errorcode'] = 100001
                queryset['errormsg'] = errmsg + ' ' + getMessage('100001')
                return JSONResponse(queryset)
            username = params['username']
            password = params['password']
            user = authenticate(username=username, password=password)
            if user is not None:
                if user.is_active:
                    # 写入session登录到主页
                    user_info = {'username': user.username, 'id': user.id}
                    request.session["user"] = user_info
                    queryset['success'] = True
                else:
                    queryset['errorcode'] = 200001
                    queryset['errormsg'] = getMessage("200001")
                return JSONResponse(queryset)
            else:
                user_filter = User.objects.filter(username=username)
                if not user_filter:
                    queryset['errorcode'] = 200003
                    queryset['errormsg'] = getMessage("200003")
                else:
                    queryset['errorcode'] = 200002
                    queryset['errormsg'] = getMessage("200002")
                return JSONResponse(queryset)
        except BaseException, ex:
            except_info(ex)
            queryset['errorcode'] = 100006
            queryset['errormsg'] = str(ex) + ' ' + getMessage('100006')
            return JSONResponse(queryset)
    else:
        queryset['errorcode'] = 300014
        queryset['errormsg'] = getMessage('300014')
        return JSONResponse(queryset)

# 用户退出
def req_logout(request):
    queryset = {'timestamp': int(time.mktime(
        time.strptime(datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'), '%Y-%m-%d %H:%M:%S'))), \
        'success': False, 'errorcode': 0, 'errormsg': ''}
    try:
        request.session['user'] = None
        return HttpResponseRedirect("/login")
    except BaseException, ex:
        except_info(ex)
        queryset['errorcode'] = 200005
        queryset['errormsg'] = str(ex) + ' ' + getMessage('200005')
        return JSONResponse(queryset)


# 检查登录
@csrf_exempt
def login_check(func):
    def wrapper(request, *args, **kwargs):
        try:
            user = request.session['user']
            if user is None:
                return HttpResponseRedirect("/login")
        except BaseException, ex:
            except_info(ex)
            return HttpResponseRedirect("/login")
        return func(request, *args, **kwargs)
    return wrapper


@csrf_exempt
def req_team(request):
    queryset = {'timestamp': int(time.mktime(
        time.strptime(datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'), '%Y-%m-%d %H:%M:%S'))), \
        'success': True, 'errorcode': 0, 'errormsg': '', 'result': {}}
    if request.method == 'GET':
        try:
            if 'keyword' in request.GET and request.GET['keyword'] != '':
                keyword = request.GET['keyword']
                team_match = Team.objects.filter(is_deleted=False, is_active=True, team_name__icontains=keyword).order_by('-utime')
            else:
                team_match = Team.objects.filter(is_deleted=False, is_active=True).order_by('-utime')
            queryset['result']['pageIndex'] = 1
            queryset['result']['pageSize'] = 10
            queryset['result']['totalCount'] = team_match.count()
            queryset['result']['teamList'] = []
            if 'pageSize' in request.GET:
                queryset['result']['pageSize'] = request.GET['pageSize']
            if 'pageIndex' in request.GET:
                queryset['result']['pageIndex'] = request.GET['pageIndex']

            team_pages = paginator.Paginator(team_match, queryset['result']['pageSize'])
            queryset['result']['pageCount'] = team_pages.num_pages
            if team_match.count() > 0:
                team_page = team_pages.page(queryset['result']['pageIndex'])
                for team in team_page.object_list:
                    result = {'team_name': team.team_name, 'team_id': team.id, 'ctime': team.ctime.strftime('%Y-%m-%d %H:%M:%S'),\
                              'team_pic_url': team.pic_url,\
                              }
                    queryset['result']['teamList'].append(result)
                return JSONResponse(queryset)
            else:
                return JSONResponse(queryset)

        except BaseException, ex:
            except_info(ex)
            queryset['errorcode'] = 300015
            queryset['errormsg'] = getMessage('300015')
            return JSONResponse(queryset)
    else:
        queryset['errorcode'] = 300014
        queryset['errormsg'] = getMessage('300014')
        return JSONResponse(queryset)
