# -*- coding:utf-8 -*-
import time
import datetime
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect
from common import JSONResponse
from common import except_info
from dop.errorcode import getMessage
from django.views.decorators.csrf import csrf_exempt
# 用户登录
def req_login(request):
    queryset = {'timestamp': int(time.mktime(
        time.strptime(datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'), '%Y-%m-%d %H:%M:%S'))), \
        'success': False, 'errorcode': 0, 'errormsg': ''}
    if request.method == "GET":
        try:
            params = request.GET.dict()
            print "params=",params
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
            print "username=", username
            print "password=", password
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
        pass
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
        user = request.session['user']
        if user == None:
            return HttpResponseRedirect("/login")
        return func(request, *args, **kwargs)
    return wrapper
