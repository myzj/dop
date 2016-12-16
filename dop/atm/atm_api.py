# -*- coding:utf-8 -*-
import time
import json
import datetime
from django.contrib.auth import authenticate
from django.core import paginator
from django.http import HttpResponseRedirect
from common import JSONResponse
from common import except_info
from dop.errorcode import getMessage
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from atm.models import Team, Project, Interface, ProjectMember


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
        queryset['errorcode'] = 100002
        queryset['errormsg'] = getMessage('100002')
        return JSONResponse(queryset)


# 用户退出
def req_logout(request):
    queryset = {'timestamp': int(time.mktime(
        time.strptime(datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'), '%Y-%m-%d %H:%M:%S'))), 'success': False, \
        'errorcode': 0, 'errormsg': ''}
    if request.method == "GET":
        try:
            request.session['user'] = None
            queryset['success'] = True
            return JSONResponse(queryset)
        except BaseException, ex:
            except_info(ex)
            queryset['errorcode'] = 200005
            queryset['errormsg'] = str(ex) + ' ' + getMessage('200005')
            return JSONResponse(queryset)
    else:
        queryset['errorcode'] = 100002
        queryset['errormsg'] = getMessage('100002')
        return JSONResponse(queryset)

# 检查登录
@csrf_exempt
def login_check(func):
    def wrapper(request, *args, **kwargs):
        try:
            user = request.session.get("user")
            if user is None:
                return HttpResponseRedirect("/login")
        except BaseException, ex:
            except_info(ex)
            return HttpResponseRedirect("/login")
        return func(request, *args, **kwargs)

    return wrapper


# 接口调用时检查用户是否已登录
def interface_check_login(func):
    def wrapper(request, *args, **kwargs):
        queryset = {'timestamp': int(
            time.mktime(time.strptime(datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'), '%Y-%m-%d %H:%M:%S'))), \
            'success': True, 'errorcode': 0, 'errormsg': '', 'result': {}}
        try:
            user = request.session.get("user")
            if user is None:
                queryset['errorcode'] = 100005
                queryset['errormsg'] = getMessage('100005')
                return JSONResponse(queryset)
        except BaseException, ex:
            except_info(ex)
            queryset['errorcode'] = 100005
            queryset['errormsg'] = getMessage('100005')
            return JSONResponse(queryset)
        return func(request, *args, **kwargs)

    return wrapper


# 查询所有的team列表
@csrf_exempt
def req_team(request):
    queryset = {'timestamp': int(time.mktime(
        time.strptime(datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'), '%Y-%m-%d %H:%M:%S'))), \
        'success': True, 'errorcode': 0, 'errormsg': '', 'result': {}}
    if request.method == 'GET':
        try:
            if 'keyword' in request.GET and request.GET['keyword'] != '':
                keyword = request.GET['keyword']
                team_match = Team.objects.filter(is_deleted=False, is_active=True,
                                                 team_name__icontains=keyword).order_by('-utime')
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
                    result = {'team_name': team.team_name, 'team_id': team.id,
                              'ctime': team.ctime.strftime('%Y-%m-%d %H:%M:%S'), \
                              'team_pic_url': team.pic_url}
                    queryset['result']['teamList'].append(result)
                return JSONResponse(queryset)
            else:
                return JSONResponse(queryset)
        except BaseException, ex:
            except_info(ex)
            queryset['errorcode'] = 300021
            queryset['errormsg'] = getMessage('300021')
            return JSONResponse(queryset)
    else:
        queryset['errorcode'] = 100002
        queryset['errormsg'] = getMessage('100002')
        return JSONResponse(queryset)


# 新增team
@csrf_exempt
@interface_check_login
def add_team(request):
    queryset = {'timestamp': int(time.mktime(
        time.strptime(datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'), '%Y-%m-%d %H:%M:%S'))), \
        'success': True, 'errorcode': 0, 'errormsg': '', 'result': {}}
    if request.method == 'POST':
        try:
            params = json.loads(request.read())
            errmsg = ''
            for field in ['team_name']:
                if field not in params or not params[field]:
                    errmsg += field + ' '
            if errmsg:
                queryset['success'] = False
                queryset['errorcode'] = 100001
                queryset['errormsg'] = errmsg + getMessage('100001')
                return JSONResponse(queryset)
            try:
                team_name = params.get('team_name')
                description = params.get("description")
                remark = params.get('remark')
                pic_url = params.get('pic_url')
                user_info = request.session.get("user", default=None)
                user_id = int(user_info.get("id"))
                user_filter = User.objects.filter(id=user_id)
                user = None
                if user_filter:
                    user = user_filter[0]
                else:
                    queryset['success'] = False
                    queryset['errorcode'] = 300015
                    queryset['errormsg'] = errmsg + getMessage('300015')
                    return JSONResponse(queryset)
                team = Team.objects.filter(team_name=team_name)
                # 判断是否存在同名的团队名称
                if team.count() > 0:
                    queryset['success'] = False
                    queryset['errorcode'] = 300017
                    queryset['errormsg'] = errmsg + getMessage('300017')
                    return JSONResponse(queryset)
                else:
                    new_team = Team()
                    new_team.team_name = team_name
                    new_team.description = description
                    new_team.remark = remark
                    new_team.pic_url = pic_url
                    new_team.author = user
                    new_team.save()
                    team_id = new_team.id
                    queryset['result']['team_id'] = team_id
                    queryset['success'] = True
                    return JSONResponse(queryset)
            except Exception, ex:
                except_info(ex)
                queryset['success'] = False
                queryset['errorcode'] = 300016
                queryset['errormsg'] = getMessage('300016')
                return JSONResponse(queryset)
        except Exception, ex:
            except_info(ex)
            queryset['success'] = False
            queryset['errorcode'] = 300016
            queryset['errormsg'] = getMessage('300016')
            return JSONResponse(queryset)
    else:
        queryset['success'] = False
        queryset['errorcode'] = 100002
        queryset['errormsg'] = getMessage('100002')
        return JSONResponse(queryset)


# 判断是否存在相同的团队名称
def team_name_check(request):
    queryset = {'timestamp': int(time.mktime(
        time.strptime(datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'), '%Y-%m-%d %H:%M:%S'))), \
        'success': True, 'errorcode': 0, 'errormsg': '', 'result': {}}
    if request.method == 'GET':
        try:
            params = request.GET.dict()
            required_fields = ["team_name"]
            errmsg = ''
            for field in required_fields:
                if field not in params or not params[field]:
                    errmsg += field + ', '
            if errmsg:
                queryset['errorcode'] = 100001
                queryset['errormsg'] = errmsg + ' ' + getMessage('100001')
                return JSONResponse(queryset)

            team_name = params.get("team_name")
            team = Team.objects.filter(team_name=team_name)
            if team.count() > 0:
                queryset['errorcode'] = 300017
                queryset['errormsg'] = errmsg + ' ' + getMessage('300017')
                return JSONResponse(queryset)
            else:
                return JSONResponse(queryset)
        except Exception, ex:
            except_info(ex)
            queryset['success'] = False
            queryset['errorcode'] = 300016
            queryset['errormsg'] = getMessage('300016')
            return JSONResponse(queryset)
    else:
        queryset['success'] = False
        queryset['errorcode'] = 100002
        queryset['errormsg'] = getMessage('100002')
        return JSONResponse(queryset)


# 获取工程列表
@interface_check_login
def req_project(request):
    queryset = {'timestamp': int(time.mktime(
        time.strptime(datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'), '%Y-%m-%d %H:%M:%S'))), \
        'success': True, 'errorcode': 0, 'errormsg': '', 'result': {}}
    if request.method == 'GET':
        try:
            team_filter = None
            project_match = None
            role_dict = {}
            user_info = request.session.get("user", default=None)
            user_id = int(user_info.get("id"))
            user_filter = User.objects.filter(id=user_id)
            project_member = ProjectMember.objects.filter(is_deleted=False, is_active=True, user=user_filter[0])
            if not project_member:  # 返回的数据为空，说明没有加入任何项目，因此无法查询自己参与的项目列表
                queryset['success'] = False
                queryset['errorcode'] = 300041
                queryset['errormsg'] = getMessage('300041')
                return JSONResponse(queryset)
            for item in project_member:
                role_dict[item.project.id] = item.role
            project_match = map(lambda x: x.project, project_member)  # 获取参与的所有的项目对象列表
            if 'team_id' in request.GET and request.GET['team_id'] != '':
                team_filter = Team.objects.filter(is_deleted=False, is_active=True, id=int(request.GET['team_id']))
                if team_filter:
                    project_match = filter(lambda x: x.team.id == team_filter[0].id, project_match)
                else:
                    queryset['errorcode'] = 300019  # 找不到匹配team id的工程列表
                    queryset['errormsg'] = getMessage('300019')
                    return JSONResponse(queryset)
            # 输入关键词查询
            if 'keyword' in request.GET and request.GET['keyword'] != '':
                if project_match:
                    project_ids = map(lambda x: int(x.id), project_match)
                    project_match = Project.objects.filter(pk__in=project_ids, is_deleted=False, is_active=True, \
                                                           project_name__icontains=request.GET['keyword']).order_by('-utime')
            queryset['result']['pageIndex'] = 1
            queryset['result']['pageSize'] = 10
            queryset['result']['totalCount'] = len(project_match)
            queryset['result']['projectList'] = []
            if 'pageSize' in request.GET:
                queryset['result']['pageSize'] = request.GET['pageSize']
            if 'pageIndex' in request.GET:
                queryset['result']['pageIndex'] = request.GET['pageIndex']
            project_pages = paginator.Paginator(project_match, queryset['result']['pageSize'])
            queryset['result']['pageCount'] = project_pages.num_pages
            if len(project_match) > 0:
                project_page = project_pages.page(queryset['result']['pageIndex'])
                for project in project_page.object_list:
                    result = {'project_name': project.project_name, 'project_id': project.id,"team": project.team.id, \
                              'ctime': project.ctime.strftime('%Y-%m-%d %H:%M:%S'), 'host':project.host, 'description':project.description, \
                              'project_pic_url': project.pic_url, 'role': role_dict.get(int(project.id), 'NULL')}
                    queryset['result']['projectList'].append(result)
                return JSONResponse(queryset)
            else:
                return JSONResponse(queryset)

        except BaseException, ex:
            except_info(ex)
            queryset['errorcode'] = 300021
            queryset['errormsg'] = getMessage('300021')
            return JSONResponse(queryset)
    else:
        queryset['errorcode'] = 100002
        queryset['errormsg'] = getMessage('100002')
        return JSONResponse(queryset)


# 查询Project名称是否重复
@interface_check_login
def project_name_check(request):
    queryset = {'timestamp': int(time.mktime(
        time.strptime(datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'), '%Y-%m-%d %H:%M:%S'))), \
        'success': True, 'errorcode': 0, 'errormsg': '', 'result': {}}
    if request.method == 'GET':
        try:
            params = request.GET.dict()
            required_fields = ["project_name"]
            errmsg = ''
            for field in required_fields:
                if field not in params or not params[field]:
                    errmsg += field + ', '
            if errmsg:
                queryset['errorcode'] = 100001
                queryset['errormsg'] = errmsg + ' ' + getMessage('100001')
                return JSONResponse(queryset)
            project_name = params.get("project_name")
            project_filter = Project.objects.filter(project_name=project_name)
            if project_filter.count() > 0:
                queryset['errorcode'] = 300022
                queryset['errormsg'] = errmsg + ' ' + getMessage('300022')
                return JSONResponse(queryset)
            else:
                return JSONResponse(queryset)
        except Exception, ex:
            except_info(ex)
            queryset['success'] = False
            queryset['errorcode'] = 300016
            queryset['errormsg'] = getMessage('300016')
            return JSONResponse(queryset)
    else:
        queryset['success'] = False
        queryset['errorcode'] = 100002
        queryset['errormsg'] = getMessage('100002')
        return JSONResponse(queryset)


# 增加项目
@csrf_exempt
@interface_check_login
def add_project(request):
    queryset = {'timestamp': int(time.mktime(
        time.strptime(datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'), '%Y-%m-%d %H:%M:%S'))), \
        'success': True, 'errorcode': 0, 'errormsg': '', 'result': {}}
    if request.method == 'POST':
        try:
            params = json.loads(request.read())
            errmsg = ''
            for field in ['project_name', 'host', 'team_id']:
                if field not in params or not params[field]:
                    errmsg += field + ' '
            if errmsg:
                queryset['success'] = False
                queryset['errorcode'] = 100001
                queryset['errormsg'] = errmsg + getMessage('100001')
                return JSONResponse(queryset)

            # 检查当前用户是否已经登录
            user_info = request.session.get("user", default=None)
            user_id = int(user_info.get("id"))
            user_filter = User.objects.filter(id=user_id)
            user = None
            if user_filter:
                project_name = params.get('project_name')
                team_id = params.get('team_id')
                # 检查项目名称是否已存在
                project_filter = Project.objects.filter(project_name=project_name)
                if project_filter:
                    queryset['errorcode'] = 300022
                    queryset['errormsg'] = errmsg + getMessage('300022')
                    return JSONResponse(queryset)
                else:
                    # 检查相关联的Team是否存在
                    team_filter = Team.objects.filter(is_active=True, is_deleted=False, id=int(team_id))
                    if team_filter:
                        user = user_filter[0]
                        new_project = Project()
                        new_project.team = team_filter[0]
                        new_project.project_name = project_name
                        new_project.host = params.get('host')
                        new_project.description = params.get('description')
                        new_project.pic_url = params.get('pic_url')
                        new_project.author = user
                        new_project.save()
                        # 新增成功后需要把ProjectMember表添加一条超级管理员信息
                        project_member = ProjectMember()
                        project_member.project = new_project
                        project_member.role = 3
                        project_member.author = user
                        project_member.user = user
                        project_member.save()

                        queryset['success'] = True
                        queryset['errormsg'] = "新增项目成功"
                        return JSONResponse(queryset)
                    else:
                        queryset['errorcode'] = 300024
                        queryset['errormsg'] = errmsg + getMessage('300024')
                        return JSONResponse(queryset)
            else:
                queryset['success'] = False
                queryset['errorcode'] = 300015
                queryset['errormsg'] = errmsg + getMessage('300015')
                return JSONResponse(queryset)
        except Exception, ex:
            except_info(ex)
            queryset['success'] = False
            queryset['errorcode'] = 300023
            queryset['errormsg'] = getMessage('300023')
            return JSONResponse(queryset)
    else:
        queryset['success'] = False
        queryset['errorcode'] = 100002
        queryset['errormsg'] = getMessage('100002')
        return JSONResponse(queryset)


# 修改项目
@csrf_exempt
@interface_check_login
def edit_project(request):
    queryset = {'timestamp': int(time.mktime(
        time.strptime(datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'), '%Y-%m-%d %H:%M:%S'))), \
        'success': True, 'errorcode': 0, 'errormsg': '', 'result': {}}
    if request.method == 'POST':
        try:
            params = json.loads(request.read())
            errmsg = ''
            for field in ['project_name', 'host', 'team_id', 'project_id']:
                if field not in params or not params[field]:
                    errmsg += field + ' '
            if errmsg:
                queryset['success'] = False
                queryset['errorcode'] = 100001
                queryset['errormsg'] = errmsg + getMessage('100001')
                return JSONResponse(queryset)

            # 检查当前用户是否已经登录
            user_info = request.session.get("user", default=None)
            user_id = int(user_info.get("id"))
            user_filter = User.objects.filter(id=user_id)
            user = None
            if user_filter:
                project_name = params.get('project_name')
                team_id = params.get('team_id')
                # 检查项目名称是否已存在
                project_filter = Project.objects.filter(project_name=project_name)
                project_filter_by_id = Project.objects.filter(id=int(params.get('project_id')))
                if project_filter_by_id.count() == 0:
                    queryset['errorcode'] = 300051
                    queryset['errormsg'] = errmsg + getMessage('300051')
                    return JSONResponse(queryset)
                if project_filter:
                    if project_filter[0].id != int(params.get('project_id')):  # 当前的项目名称没有改变，和之前的保持一致
                        queryset['errorcode'] = 300022
                        queryset['errormsg'] = errmsg + getMessage('300022')
                        return JSONResponse(queryset)
                # 检查相关联的Team是否存在
                team_filter = Team.objects.filter(is_active=True, is_deleted=False, id=int(team_id))
                if team_filter:
                    user = user_filter[0]
                    update_project = project_filter_by_id[0]
                    update_project.team = team_filter[0]
                    update_project.project_name = project_name
                    update_project.host = params.get('host')
                    update_project.description = params.get('description')
                    update_project.pic_url = params.get('pic_url')
                    update_project.modifier = user
                    update_project.id = int(params.get('project_id'))
                    update_project.save()
                    queryset['success'] = True
                    queryset['errormsg'] = "项目修改成功"
                    return JSONResponse(queryset)
                else:
                    queryset['errorcode'] = 300024
                    queryset['errormsg'] = errmsg + getMessage('300024')
                    return JSONResponse(queryset)
            else:
                queryset['success'] = False
                queryset['errorcode'] = 300015
                queryset['errormsg'] = errmsg + getMessage('300015')
                return JSONResponse(queryset)
        except Exception, ex:
            except_info(ex)
            queryset['success'] = False
            queryset['errorcode'] = 300023
            queryset['errormsg'] = getMessage('300023')
            return JSONResponse(queryset)
    else:
        queryset['success'] = False
        queryset['errorcode'] = 100002
        queryset['errormsg'] = getMessage('100002')
        return JSONResponse(queryset)


# 查询接口列表
@csrf_exempt
def req_api_list(request):
    queryset = {'timestamp': int(time.mktime(
        time.strptime(datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'), '%Y-%m-%d %H:%M:%S'))), \
        'success': True, 'errorcode': 0, 'errormsg': '', 'result': {}}
    if request.method == 'GET':
        try:
            project_filter = None
            api_match = None
            # 传入项目id
            role_dict = {}
            user_info = request.session.get("user", default=None)
            user_id = int(user_info.get("id"))
            user_filter = User.objects.filter(id=user_id)
            project_member = ProjectMember.objects.filter(is_deleted=False, is_active=True, user=user_filter[0])
            if not project_member:  # 返回的数据为空，说明没有加入任何项目，因此无法查询自己参与的项目列表
                queryset['success'] = False
                queryset['errorcode'] = 300041
                queryset['errormsg'] = getMessage('300041')
                return JSONResponse(queryset)
            for item in project_member:
                role_dict[item.project.id] = item.role
            project_match = map(lambda x: x.project, project_member)  # 获取参与的所有的项目对象列表
            if not project_match:
                queryset['success'] = False
                queryset['errorcode'] = 300041
                queryset['errormsg'] = getMessage('300041')
                return JSONResponse(queryset)
            api_filter = Interface.objects.filter(is_deleted=False, is_active=True, project__in=project_match)
            if 'project_id' in request.GET and request.GET['project_id'] != '':
                project_filter = Project.objects.filter(is_deleted=False, is_active=True, id=int(request.GET['project_id']))
                if project_filter:
                    api_match = api_filter.filter(project=project_filter[0])
                else:
                    queryset['errorcode'] = 300025
                    queryset['errormsg'] = getMessage('300025')
                    return JSONResponse(queryset)
            else:
                if 'keyword' in request.GET and request.GET['keyword'] != '':
                    keyword = request.GET['keyword']
                    # match interface name
                    api_match_name = []
                    api_match_name = api_filter.filter(interface_name__icontains=keyword)
                    # match description
                    api_match_desc = []
                    api_match_desc = api_filter.filter(description__icontains=keyword)
                    # match url
                    api_match_url = []
                    api_match_url = api_filter.filter(url__icontains=keyword)
                    # match tags
                    api_match_tag = []
                    api_match_tag = api_filter.filter(tags__icontains=keyword)
                    api_all = api_match_name | api_match_desc | api_match_tag | api_match_url
                    api_match = api_all.distinct().order_by("-utime")
                else:
                    api_match = api_filter
            # 判断项目是否存在
            queryset['result']['pageIndex'] = 1
            queryset['result']['pageSize'] = 10
            queryset['result']['totalCount'] = api_match.count()
            queryset['result']['apiList'] = []
            if 'pageSize' in request.GET:
                queryset['result']['pageSize'] = request.GET['pageSize']
            if 'pageIndex' in request.GET:
                queryset['result']['pageIndex'] = request.GET['pageIndex']
            api_pages = paginator.Paginator(api_match, queryset['result']['pageSize'])
            queryset['result']['pageCount'] = api_pages.num_pages
            if api_match.count() > 0:
                api_page = api_pages.page(queryset['result']['pageIndex'])
                for api in api_page.object_list:
                    result = {'id': api.id, 'interface_name': api.interface_name, 'description': api.description, \
                              'url': api.url, 'method': api.get_method_display(), 'remark': api.remark, \
                              'content_type': api.get_content_type_display(),  'project_id': api.project.id, \
                              'update_time': api.utime.strftime('%Y-%m-%d %H:%M:%S')}
                    try:
                        result["tags"] = eval(api.tags)
                    except BaseException, ex:
                        except_info(ex)
                        result["tags"] = []
                    queryset['result']['apiList'].append(result)
                return JSONResponse(queryset)
            else:
                return JSONResponse(queryset)
        except BaseException, ex:
            except_info(ex)
            queryset['errorcode'] = 300021
            queryset['errormsg'] = getMessage('300021')
            return JSONResponse(queryset)
    else:
        queryset['errorcode'] = 100002
        queryset['errormsg'] = getMessage('100002')
        return JSONResponse(queryset)


# 根据字符模糊匹配用户名
@interface_check_login
def get_user_by_name(request):
    queryset = {'timestamp': int(time.mktime(
        time.strptime(datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'), '%Y-%m-%d %H:%M:%S'))), \
        'success': True, 'errorcode': 0, 'errormsg': '', 'result': {}}
    if request.method == 'GET':
        try:
            params = request.GET.dict()
            required_fields = ["username"]
            errmsg = ''
            for field in required_fields:
                if field not in params or not params[field]:
                    errmsg += field + ', '
            if errmsg:
                queryset['errorcode'] = 100001
                queryset['errormsg'] = errmsg + ' ' + getMessage('100001')
                return JSONResponse(queryset)
            user_match = User.objects.filter(is_active=True, username__icontains=request.GET['username']).order_by('username')
            queryset['result']['pageIndex'] = 1
            queryset['result']['pageSize'] = 10
            queryset['result']['totalCount'] = user_match.count()
            queryset['result']['userList'] = []
            if 'pageSize' in request.GET:
                queryset['result']['pageSize'] = request.GET['pageSize']
            if 'pageIndex' in request.GET:
                queryset['result']['pageIndex'] = request.GET['pageIndex']
            user_pages = paginator.Paginator(user_match, queryset['result']['pageSize'])
            if user_match.count() > 0:
                user_page = user_pages.page(queryset['result']['pageIndex'])
                for user in user_page.object_list:
                    result = {'id': user.id, "username": user.username}
                    queryset['result']['userList'].append(result)
                return JSONResponse(queryset)
            else:
                return JSONResponse(queryset)
        except BaseException, ex:
            except_info(ex)
            queryset['errorcode'] = 300021
            queryset['errormsg'] = getMessage('300021')
            return JSONResponse(queryset)
    else:
        queryset['errorcode'] = 100002
        queryset['errormsg'] = getMessage('100002')
        return JSONResponse(queryset)



