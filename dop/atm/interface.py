# -*- coding:utf-8 -*-
import sys
reload(sys)
sys.setdefaultencoding('utf-8')
from django.http import HttpResponse, Http404
from django import template
from models import Interface, MetaData, ErrorCode, Project, LockInfo, ProjectMember, EditHistory, CodeModel
from django.contrib.auth.models import User
from common import except_info
import time
import json
import datetime
import re
from dop import Checkcode
import StringIO
from common import JSONResponse
from dop.errorcode import getMessage
from django.views.decorators.csrf import csrf_exempt
from atm_api import interface_check_login

method_dict = {"GET": 1, "POST": 2, "PUT": 3, "DELETE": 4}
content_dict = {"application/json": 1, "text/html": 2, "x-www-form-urlencode": 3}
position_dict = {"Request": 1, "Response": 2}


class InterFace(object):
    def __init__(self, interface_id=0, data=None):
        interface_filter = Interface.objects.filter(id=interface_id)
        self.data = data
        if interface_filter:
            self.interface = interface_filter[0]
        else:
            self.interface = None

    @property
    def get_metadata(self):
        meta_data = {"base": {}, "request": {}}
        if self.interface:
            try:
                meta_data["base"] = {
                    "description": "" if self.interface.description is None else self.interface.description, \
                    "name": self.interface.interface_name if self.interface.interface_name else "", \
                    "mock": self.interface.mockdata if self.interface.mockdata else "", \
                    "state": self.interface.is_active}
                try:
                    tags = eval(self.interface.tags)
                    meta_data["base"]["tags"] = tags
                except BaseException, ex:
                    except_info(ex)
                    if self.interface.tags:
                        meta_data["base"]["tags"] = self.interface.tags
                meta_data["request"]["url"] = self.interface.url if self.interface.url else ""
                meta_data["request"]["method"] = self.interface.get_method_display()
                meta_data["request"]["content_type"] = self.interface.get_content_type_display()
                metadata_filter = MetaData.objects.filter(interface=self.interface, is_deleted=False, is_active=True)
                if metadata_filter:  # Req:[header, querystring, body]  Resp:[body]
                    meta_req_filter = metadata_filter.filter(position=1)  # Request data
                    if meta_req_filter:
                        meta_req = meta_req_filter[0]
                        try:
                            req_data = eval(meta_req.data)
                            meta_data["request"] = req_data
                        except BaseException, ex:
                            except_info(ex)
                            meta_data["request"] = meta_req.data if meta_req.data else ""

                    meta_rsp_data = metadata_filter.filter(position=2)  # Response data
                    if meta_rsp_data:
                        meta_resp = meta_rsp_data[0]
                        try:
                            rsp_data = eval(meta_resp.data)
                            meta_data["response"] = rsp_data
                        except BaseException, ex:
                            except_info(ex)
                            meta_data["response"] = meta_resp.data if meta_resp.data else ""
                errorcode_filter = ErrorCode.objects.filter(interface=self.interface, is_deleted=False, is_active=True)
                if errorcode_filter:
                    errcode_array = []
                    for item in errorcode_filter:
                        tmp_dict = {"error_code": item.error_name if item.error_name else "",
                                    "display_message": item.display_message if item.display_message else "",
                                    "description": item.description if item.description else ""}
                        errcode_array.append(tmp_dict)
                    meta_data["error_code"] = errcode_array
            except BaseException, ex:
                except_info(ex)
                return meta_data
        return meta_data

    @property
    def create_interface(self):
        try:
            print '--------------Call create_interface -----------'
            if self.data and isinstance(self.data, dict):  # data is not None and is a dictionary
                new_interface = Interface()
                new_interface.author = self.data.get("user")
                new_interface.project = self.data.get("project")
                new_interface.interface_name = self.data.get("name")
                new_interface.url = format_url(self.data.get("url"))
                new_interface.method = method_dict.get(self.data.get("method"))
                new_interface.content_type = content_dict.get(self.data.get("content_type"))
                new_interface.is_active = self.data.get("state")
                if self.data.get("mock"):
                    new_interface.mockdata = self.data.get("mock")
                if self.data.get("tags"):
                    new_interface.tags = str(self.data.get("tags"))
                if self.data.get("description"):
                    new_interface.description = self.data.get("description")
                new_interface.save()
                if self.data.get("req_data"):
                    new_req_meta_data = MetaData()
                    new_req_meta_data.interface = new_interface
                    new_req_meta_data.author = self.data.get("user")
                    new_req_meta_data.position = position_dict.get("Request")
                    new_req_meta_data.data = str(self.data.get("req_data"))
                    new_req_meta_data.save()
                if self.data.get("resp_data"):
                    new_resp_meta_data = MetaData()
                    new_resp_meta_data.interface = new_interface
                    new_resp_meta_data.author = self.data.get("user")
                    new_resp_meta_data.position = position_dict.get("Response")
                    new_resp_meta_data.data = str(self.data.get("resp_data"))
                    new_resp_meta_data.save()
                if self.data.get("error_code"):
                    for item in self.data.get("error_code"):
                        new_error_code = ErrorCode()
                        new_error_code.author = self.data.get("user")
                        new_error_code.interface = new_interface
                        new_error_code.error_name = item.get("error_code")
                        if item.get("display_message"):
                            new_error_code.display_message = item.get("display_message")
                        if item.get("description"):
                            new_error_code.description = item.get("description")
                        new_error_code.save()
                print '--------------Call create_interface finished! -----------'
                return True, "", new_interface
            return False, getMessage("300026")
        except BaseException, ex:
            except_info(ex)
            return False, getMessage("300027") + ": " + str(ex)

    @property
    def modify_interface(self):
        try:
            print '--------------Call modify_interface -----------'
            now = datetime.datetime.now()
            if self.data and isinstance(self.data, dict):  # data is not None and is a dictionary
                # update base
                mdf_interface = Interface.objects.get(id=self.data.get("api_id"))
                mdf_interface.modifier = self.data.get("user")
                mdf_interface.interface_name = self.data.get("name")
                mdf_interface.url = format_url(self.data.get("url"))
                mdf_interface.method = method_dict.get(self.data.get("method"))
                mdf_interface.content_type = content_dict.get(self.data.get("content_type"))
                mdf_interface.is_active = self.data.get("state")
                if self.data.get("mock"):
                    mdf_interface.mockdata = self.data.get("mock")
                if self.data.get("tags"):
                    mdf_interface.tags = str(self.data.get("tags"))
                if self.data.get("description"):
                    mdf_interface.description = self.data.get("description")
                mdf_interface.utime = now
                mdf_interface.save()

                # update request
                if self.data.get("req_data"):
                    req_filter = MetaData.objects.filter(interface=mdf_interface, is_deleted=False, is_active=True, \
                                                         position=1)
                    if req_filter:
                        req_meta_data = req_filter[0]
                        req_meta_data.interface = mdf_interface
                        req_meta_data.modifier = self.data.get("user")
                        req_meta_data.position = position_dict.get("Request")
                        req_meta_data.data = str(self.data.get("req_data"))
                        req_meta_data.utime = now
                        req_meta_data.save()
                    else:
                        new_meta_data = MetaData()
                        new_meta_data.interface = mdf_interface
                        new_meta_data.author = self.data.get("user")
                        new_meta_data.position = position_dict.get("Request")
                        new_meta_data.data = str(self.data.get("req_data"))
                        new_meta_data.save()

                # update response
                resp_filter = MetaData.objects.filter(interface=mdf_interface, is_deleted=False, is_active=True, \
                                                      position=2)
                if self.data.get("resp_data"):
                    if resp_filter:
                        resp_meta_data = resp_filter[0]
                        resp_meta_data.interface = mdf_interface
                        resp_meta_data.modifier = self.data.get("user")
                        resp_meta_data.position = position_dict.get("Response")
                        resp_meta_data.data = str(self.data.get("resp_data"))
                        resp_meta_data.utime = now
                        resp_meta_data.save()
                    else:
                        new_meta_data = MetaData()
                        new_meta_data.interface = mdf_interface
                        new_meta_data.author = self.data.get("user")
                        new_meta_data.position = position_dict.get("Response")
                        new_meta_data.data = str(self.data.get("resp_data"))
                        new_meta_data.save()
                else:
                    if resp_filter:
                        resp_filter.update(is_deleted=True, modifier=self.data.get("user"), utime=now)

                # update error code
                org_err_code_filter = ErrorCode.objects.filter(interface=mdf_interface, is_deleted=False,
                                                               is_active=True)
                org_dict = {}
                if org_err_code_filter:
                    for org_rec in org_err_code_filter:
                        org_dict[org_rec.error_name] = org_rec
                if self.data.get("error_code"):
                    for item in self.data.get("error_code"):
                        if item.get("error_code") in org_dict:
                            up_error_code = org_dict[item.get("error_code")]
                            up_error_code.modifier = self.data.get("user")
                            up_error_code.interface = mdf_interface
                            if item.get("display_message"):
                                up_error_code.display_message = item.get("display_message")
                            else:
                                up_error_code.display_message = ""
                            if item.get("description"):
                                up_error_code.description = item.get("description")
                            else:
                                up_error_code.description = ""
                            up_error_code.utime = now
                            up_error_code.save()
                            org_dict.pop(item.get("error_code"))
                        else:
                            new_error_code = ErrorCode()
                            new_error_code.author = self.data.get("user")
                            new_error_code.interface = mdf_interface
                            new_error_code.error_name = item.get("error_code")
                            if item.get("display_message"):
                                new_error_code.display_message = item.get("display_message")
                            if item.get("description"):
                                new_error_code.description = item.get("description")
                            new_error_code.save()
                    if org_dict:
                        for value in org_dict.itervalues():
                            value.modifier = self.data.get("user")
                            value.is_deleted = True
                            value.utime = now
                            value.save()
                else:
                    if org_err_code_filter:
                        org_err_code_filter.update(is_deleted=True, modifier=self.data.get("user"), utime=now)

                print '--------------Call modify_interface finished! -----------'
                return True, ""
            return False, getMessage("300032")
        except BaseException, ex:
            except_info(ex)
            return False, getMessage("300033") + ": " + str(ex)

# 判断是否是一个有效的日期字符串
def is_valid_date(timestr):
    """判断是否是一个有效的日期字符串"""
    try:
        time.strptime(timestr, "%Y-%m-%d")
        return True
    except BaseException, ex:
        except_info(ex)
        return False


# 格式化url
def format_url(url):
    try:
        if not re.match(r'/.+', url):  # url不是以"/"开始,在开始添加"/"
            url = '/' + url
        if url[-1] == '/':  # url 以"/"结尾，去掉结尾的"/"
            url = url[:-1]
        return url
    except BaseException, ex:
        except_info(ex)
        return url


# 添加API修改记录
def add_modify_record(user=None, interface=None, data=""):
    try:
        if user and interface:
            new_history = EditHistory()
            new_history.interface = interface
            new_history.content = str(data)
            new_history.modifier = user
            new_history.save()
            print 'Call add_modify_record success.'
        else:
            print 'Call add_modify_record fail.'
    except BaseException, ex:
        except_info(ex)
        print 'Call add_modify_record throw exception:', str(ex)


# check interface
def check_interface(project=None, url=""):
    check_msg = {"is_existed": False, "is_locked": False, "api": None}
    try:
        if project and url:
            interface_filter = Interface.objects.filter(project=project, url=url, is_deleted=False)
            if interface_filter:
                check_msg["is_existed"] = True
                check_msg["api"] = interface_filter[0]
                # check lock info
                lock_filter = LockInfo.objects.filter(interface=interface_filter[0], is_locked=True, is_deleted=False)
                if lock_filter:
                    check_msg["is_locked"] = True
        return check_msg
    except BaseException, ex:
        except_info(ex)
        return check_msg


# precheck interface data
def precheck_interface_data(data=None):
    if not data:
        data = []
    check_info = {}
    try:
        if data:
            rec_num = 1
            for itf_rec in data:
                rec_key = "record_number:{0}".format(rec_num)
                if "request" not in itf_rec:
                    err_msg = "request " + getMessage('100001')
                    check_info[rec_key] = err_msg
                    continue
                req = itf_rec.get("request")
                if not isinstance(req, dict):
                    err_msg = 'req ' + getMessage('100007')
                    check_info[rec_key] = err_msg
                    continue
                if "url" not in req or not req.get("url"):
                    err_msg = "url " + getMessage('100001')
                    check_info[rec_key] = err_msg
                    continue
                url = req.get("url")
                if "method" not in req or not req.get("method"):
                    err_msg = "method " + getMessage('100001')
                    check_info[url] = err_msg
                    continue
                if req.get("method") not in method_dict:
                    err_msg = "method " + getMessage('100008')
                    check_info[url] = err_msg
                    continue
                if "content_type" not in req or not req.get("content_type"):
                    err_msg = "content_type " + getMessage('100001')
                    check_info[url] = err_msg
                    continue
                if req.get("content_type") not in content_dict:
                    err_msg = "content_type " + getMessage('100008')
                    check_info[url] = err_msg
                    continue

                if "base" not in itf_rec:
                    err_msg = "base " + getMessage('100001')
                    check_info[url] = err_msg
                    continue
                base = itf_rec.get("base")
                if not isinstance(base, dict):
                    err_msg = 'base ' + getMessage('100007')
                    check_info[url] = err_msg
                    continue
                if "name" not in base or not base.get("name"):
                    err_msg = "name " + getMessage('100001')
                    check_info[url] = err_msg
                    continue
                if "state" not in base or not base.get("state"):
                    err_msg = "state " + getMessage('100001')
                    check_info[url] = err_msg
                    continue
                if not isinstance(base.get("state"), bool):
                    err_msg = 'state ' + getMessage('100007')
                    check_info[url] = err_msg
                    continue
                if base.get("tags") and not isinstance(base.get("tags"), list):
                    err_msg = 'tags ' + getMessage('100007')
                    check_info[url] = err_msg
                    continue

                if itf_rec.get("error_code"):
                    error_code = itf_rec.get("error_code")
                    if not isinstance(error_code, list):
                        err_msg = 'error_code ' + getMessage('100007')
                        check_info[url] = err_msg
                        continue
                    check_err = map(lambda x: isinstance(x, dict), error_code)
                    if False in check_err:
                        err_msg = 'error_code value type is not a dictionary ' + getMessage('100007')
                        check_info[url] = err_msg
                        continue
                    err_msg = ''
                    for err_rec in error_code:
                        if "error_code" not in err_rec or not err_rec.get("error_code"):
                            err_msg = 'error_code属性值的error_code为必填属性  ' + getMessage('100001')
                            break
                    if err_msg:
                        check_info[url] = err_msg
                        continue
                rec_num += 1
            return check_info
    except BaseException, ex:
        except_info(ex)
        check_info["errmsg"] = "Call precheck_interface_data throw exception: " + str(ex)
        return check_info


# 查询API接口明细
@csrf_exempt
def qry_interface_detail(request):
    queryset = {'timestamp': int(time.mktime(
        time.strptime(datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'), '%Y-%m-%d %H:%M:%S'))), \
        'success': True, 'errorcode': 0, 'errormsg': '', 'result': {}}
    if request.method == 'GET':
        try:
            errmsg = ''
            if 'api_id' in request.GET and request.GET['api_id'] != '':
                api_id = request.GET['api_id']
            else:
                errmsg += 'api_id,'
                queryset['errorcode'] = 100001
                queryset['errormsg'] = errmsg + ' ' + getMessage('100001')
                return JSONResponse(queryset)
            api_id = int(api_id)
            interface_filter = Interface.objects.filter(id=api_id, is_deleted=False)
            if not interface_filter:
                queryset['success'] = False
                queryset['errorcode'] = 300029
                queryset['errormsg'] = getMessage('300029')
                return JSONResponse(queryset)
            interface = interface_filter[0]
            queryset["is_lock_user"] = False
            user_info = request.session.get("user", default=None)
            user = None
            if user_info:
                user_id = int(user_info.get("id"))
                user_filter = User.objects.filter(id=user_id)
                if user_filter:
                    user = user_filter[0]
            if user is None and 'is_modify' in request.GET and request.GET['is_modify'] == 'true':
                queryset['success'] = False
                queryset['errorcode'] = 200003
                queryset['errormsg'] = getMessage('200003')
                return JSONResponse(queryset)
            lock_qry = LockInfo.objects.filter(interface=interface, is_locked=True, is_deleted=False)
            if lock_qry and user:
                if lock_qry[0].lock_user.id == user.id:
                    queryset["is_lock_user"] = True
            if 'is_modify' in request.GET and request.GET['is_modify'] == 'true':
                members_filter = ProjectMember.objects.filter(project=interface.project, is_deleted=False,
                                                              is_active=True)
                members = []
                if members_filter:
                    members = map(lambda x: x.user, members_filter)
                if user not in members:
                    queryset['success'] = False
                    queryset['errorcode'] = 300031
                    queryset['errormsg'] = getMessage('300031')
                    return JSONResponse(queryset)
                # check the interface was locked
                lock_filter = LockInfo.objects.filter(interface=interface, is_locked=True, is_deleted=False)
                if lock_filter and lock_filter[0].lock_user.id != user.id:
                    queryset['errorcode'] = 300030
                    queryset['errormsg'] = getMessage('300030') + ',请联系 ' + lock_filter[0].lock_user.username + ' 解锁.'
                    return JSONResponse(queryset)
                if not lock_filter:  # Add lock info
                    print 'Lock the interface id={0}'.format(api_id)
                    new_lock = LockInfo()
                    new_lock.interface = interface
                    new_lock.lock_user = user
                    new_lock.is_locked = True
                    new_lock.save()
                queryset["is_lock_user"] = True
            interface = InterFace(api_id)
            queryset["result"] = interface.get_metadata
            return JSONResponse(queryset)
        except BaseException, ex:
            except_info(ex)
            queryset["success"] = False
            queryset['errorcode'] = 100028
            queryset['errormsg'] = getMessage('100028') + "\n" + str(ex)
            return JSONResponse(queryset)
    else:
        queryset['errorcode'] = 100002
        queryset['errormsg'] = getMessage('100002')
        return JSONResponse(queryset)


# 新增API接口信息
@csrf_exempt
@interface_check_login
def add_interface(request):
    queryset = {'timestamp': int(time.mktime(
        time.strptime(datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'), '%Y-%m-%d %H:%M:%S'))), \
        'success': True, 'errorcode': 0, 'errormsg': '', 'result': {}}
    count = {"new_num": 0, "update_num": 0, "success_num": 0, "fail_num": 0, "pre_update_num": 0}
    return_data = {"is_existed": [], "is_locked": [], "failed": []}
    if request.method == 'POST':
        try:
            data = {}
            params = json.loads(request.read())
            user_info = request.session.get("user", default=None)
            user = None
            if user_info:
                user_id = int(user_info.get("id"))
                user_filter = User.objects.filter(id=user_id)
                if user_filter:
                    user = user_filter[0]
            if user is None:
                queryset['success'] = False
                queryset['errorcode'] = 200003
                queryset['errormsg'] = getMessage('200003')
                return JSONResponse(queryset)
            required_fields = ['info', 'item', 'is_replace']
            errmsg = ''
            for field in required_fields:
                if field not in params:
                    errmsg += field + ', '
            if errmsg:
                queryset['errorcode'] = 100001
                queryset['errormsg'] = errmsg + ' ' + getMessage('100001')
                return JSONResponse(queryset)
            if not isinstance(params.get("is_replace"), bool):
                queryset['errorcode'] = 100007
                queryset['errormsg'] = 'is_replace ' + getMessage('100007')
                return JSONResponse(queryset)
            is_replace = params.get("is_replace")
            info = params.get("info")
            if not isinstance(info, dict):
                queryset['errorcode'] = 100007
                queryset['errormsg'] = 'info ' + getMessage('100007')
                return JSONResponse(queryset)
            if "project" not in info:
                queryset['errorcode'] = 100001
                queryset['errormsg'] = 'info属性值的project为必填属性 ' + getMessage('100001')
                return JSONResponse(queryset)
            project_id = int(info.get("project"))
            project_filter = Project.objects.filter(id=project_id, is_deleted=False, is_active=True)
            if not project_filter:
                queryset['errorcode'] = 300025
                queryset['errormsg'] = "项目ID为:{0},{1}".format(project_id, getMessage("300025"))
                return JSONResponse(queryset)
            # check user role
            members_filter = ProjectMember.objects.filter(project=project_filter[0], is_deleted=False, is_active=True)
            members = []
            if members_filter:
                members = map(lambda x: x.user, members_filter)
            if user not in members:
                queryset['success'] = False
                queryset['errorcode'] = 300031
                queryset['errormsg'] = getMessage('300031')
                return JSONResponse(queryset)
            item = params.get("item")
            if not isinstance(item, list):
                queryset['errorcode'] = 100007
                queryset['errormsg'] = 'item ' + getMessage('100007')
                return JSONResponse(queryset)
            # precheck data
            check_msg = precheck_interface_data(data=item)
            if check_msg:
                queryset['errorcode'] = 300038
                queryset['errormsg'] = getMessage('300038')
                queryset['result'] = check_msg
                return JSONResponse(queryset)
            for rec in item:
                data["user_id"] = user.id
                data["user"] = user
                data["project_id"] = project_id
                data["project"] = project_filter[0]
                for key1 in ["base", "request"]:
                    if key1 not in rec:
                        queryset['errorcode'] = 100001
                        queryset['errormsg'] = key1 + ' ' + getMessage('100001')
                        return JSONResponse(queryset)
                base = rec.get("base")
                if not isinstance(base, dict):
                    queryset['errorcode'] = 100007
                    queryset['errormsg'] = 'base ' + getMessage('100007')
                    return JSONResponse(queryset)
                for key2 in ["name", "state"]:
                    if key2 not in base:
                        queryset['errorcode'] = 100001
                        queryset['errormsg'] = key2 + ' ' + getMessage('100001')
                        return JSONResponse(queryset)
                if not base.get("name"):
                    queryset['errorcode'] = 100001
                    queryset['errormsg'] = 'base属性值的name为必填属性  ' + getMessage('100001')
                    return JSONResponse(queryset)
                data["name"] = base.get("name")
                if not base.get("state"):
                    queryset['errorcode'] = 100001
                    queryset['errormsg'] = 'base属性值的state为必填属性  ' + getMessage('100001')
                    return JSONResponse(queryset)
                if not isinstance(base.get("state"), bool):
                    queryset['errorcode'] = 100007
                    queryset['errormsg'] = 'state ' + getMessage('100007')
                    return JSONResponse(queryset)
                data["state"] = base.get("state")
                if base.get("mock"):
                    data["mock"] = base.get("mock")
                if base.get("description"):
                    data["description"] = base.get("description")
                if base.get("tags") and isinstance(base.get("tags"), list):
                    data["tags"] = base.get("tags")

                req = rec.get("request")
                if not isinstance(req, dict):
                    queryset['errorcode'] = 100007
                    queryset['errormsg'] = 'req ' + getMessage('100007')
                    return JSONResponse(queryset)
                for key3 in ["url", "method", "content_type"]:
                    if key3 not in req or not req.get(key3):
                        queryset['errorcode'] = 100001
                        queryset['errormsg'] = key3 + ' ' + getMessage('100001')
                        return JSONResponse(queryset)
                    data[key3] = req.get(key3)
                if req.get("method") not in method_dict:
                    queryset['errorcode'] = 100008
                    queryset['errormsg'] = "method " + getMessage('100008')
                    return JSONResponse(queryset)
                if req.get("content_type") not in content_dict:
                    queryset['errorcode'] = 100008
                    queryset['errormsg'] = "content_type " + getMessage('100008')
                    return JSONResponse(queryset)
                data['req_data'] = req

                if rec.get("response"):
                    data["resp_data"] = rec.get("response")

                if rec.get("error_code"):
                    error_code = rec.get("error_code")
                    if not isinstance(error_code, list):
                        queryset['errorcode'] = 100007
                        queryset['errormsg'] = 'error_code ' + getMessage('100007')
                        return JSONResponse(queryset)
                    check_err = map(lambda x: isinstance(x, dict), error_code)
                    if False in check_err:
                        queryset['errorcode'] = 100007
                        queryset['errormsg'] = 'error_code value type ' + getMessage('100007')
                        return JSONResponse(queryset)
                    for err_rec in error_code:
                        if "error_code" not in err_rec or not err_rec.get("error_code"):
                            queryset['errorcode'] = 100001
                            queryset['errormsg'] = 'error_code属性值的error_code为必填属性  ' + getMessage('100001')
                            return JSONResponse(queryset)
                    data["error_code"] = error_code
                # check interface has existed
                check_info = check_interface(project=project_filter[0], url=data["url"])
                if check_info["is_existed"]:  # interface has existed
                    if check_info["is_locked"]:  # was locked, don't relace interface
                        return_data["is_locked"].append(rec)
                        count["pre_update_num"] += 1
                    else:  # unlock
                        if is_replace:  # need replace
                            # call modify interface
                            api_id = check_info['api'].id
                            data["api_id"] = api_id
                            itf = InterFace(data=data)
                            flag, msg = itf.modify_interface
                            if flag:  # modify success
                                count["update_num"] += 1
                                count["success_num"] += 1
                                add_modify_record(user=user, interface=check_info["api"], data=rec)  # Add modify record
                            else:  # modify fail
                                count["fail_num"] += 1
                                queryset["result"][data.get("url")] = msg
                                return_data["failed"].append(rec)
                        else:  # don't replace interface
                            return_data["is_existed"].append(rec)
                            count["pre_update_num"] += 1
                else:  # write new interface
                    # call write data to db
                    itf = InterFace(data=data)
                    flag, msg, itf = itf.create_interface
                    if flag:  # write success
                        count["success_num"] += 1
                        count["new_num"] += 1
                        add_modify_record(user=user, interface=itf, data=rec)
                    else:  # write fail
                        count["fail_num"] += 1
                        queryset["result"][data.get("url")] = msg
                        return_data["failed"].append(rec)
            queryset["return_data"] = return_data
            queryset["count"] = count
            msg = u'新增:{0}, 更新:{1},待更新:{2},成功:{3},失败:{4}'.format(count.get("new_num"), count.get("update_num"),
                                                                 count.get("pre_update_num"), count.get("success_num"),
                                                                 count.get("fail_num"))
            queryset['errormsg'] = msg
            return JSONResponse(queryset)
        except BaseException, ex:
            except_info(ex)
            queryset['success'] = False
            queryset['errorcode'] = 300027
            queryset['errormsg'] = getMessage('300027') + str(ex)
            queryset["return_data"] = return_data
            queryset["count"] = count
            return JSONResponse(queryset)


# 更新API接口信息
@csrf_exempt
@interface_check_login
def update_interface(request):
    queryset = {'timestamp': int(time.mktime(
        time.strptime(datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'), '%Y-%m-%d %H:%M:%S'))), \
        'success': True, 'errorcode': 0, 'errormsg': '', 'result': {}}
    if request.method == 'PATCH':
        try:
            data = {}
            params = json.loads(request.read())
            user_info = request.session.get("user", default=None)
            user = None
            if user_info:
                user_id = int(user_info.get("id"))
                user_filter = User.objects.filter(id=user_id)
                if user_filter:
                    user = user_filter[0]
            if user is None:
                queryset['success'] = False
                queryset['errorcode'] = 200003
                queryset['errormsg'] = getMessage('200003')
                return JSONResponse(queryset)

            required_fields = ['info', 'item']
            errmsg = ''
            for field in required_fields:
                if field not in params:
                    errmsg += field + ', '
            if errmsg:
                queryset['errorcode'] = 100001
                queryset['errormsg'] = errmsg + ' ' + getMessage('100001')
                return JSONResponse(queryset)
            info = params.get("info")
            if not isinstance(info, dict):
                queryset['errorcode'] = 100007
                queryset['errormsg'] = 'info ' + getMessage('100007')
                return JSONResponse(queryset)
            if "api_id" not in info or not info.get("api_id"):
                queryset['errorcode'] = 100001
                queryset['errormsg'] = 'info属性值的api_id为必填属性 ' + getMessage('100001')
                return JSONResponse(queryset)
            api_id = int(info.get("api_id"))
            api_filter = Interface.objects.filter(id=api_id, is_deleted=False)
            if not api_filter:
                queryset['errorcode'] = 300029
                queryset['errormsg'] = "API接口ID为:{0},{1}".format(api_id, getMessage("300029"))
                return JSONResponse(queryset)
            up_interface = api_filter[0]
            # check the interface was locked
            lock_filter = LockInfo.objects.filter(interface=up_interface, is_locked=True, is_deleted=False)
            if lock_filter and lock_filter[0].lock_user.id != user.id:
                queryset['errorcode'] = 300030
                queryset['errormsg'] = getMessage('300030') + ',请联系 ' + lock_filter[0].lock_user.username + ' 解锁.'
                return JSONResponse(queryset)
            item = params.get("item")
            if not isinstance(item, list):
                queryset['errorcode'] = 100007
                queryset['errormsg'] = 'item ' + getMessage('100007')
                return JSONResponse(queryset)
            rec = item[0]
            data["user_id"] = user.id
            data["user"] = user
            data["project_id"] = up_interface.project.id
            for key1 in ["base", "request"]:
                if key1 not in rec:
                    queryset['errorcode'] = 100001
                    queryset['errormsg'] = key1 + ' ' + getMessage('100001')
                    return JSONResponse(queryset)
            base = rec.get("base")
            if not isinstance(base, dict):
                queryset['errorcode'] = 100007
                queryset['errormsg'] = 'base ' + getMessage('100007')
                return JSONResponse(queryset)
            for key2 in ["name", "state"]:
                if key2 not in base:
                    queryset['errorcode'] = 100001
                    queryset['errormsg'] = key2 + ' ' + getMessage('100001')
                    return JSONResponse(queryset)
            if not base.get("name"):
                queryset['errorcode'] = 100001
                queryset['errormsg'] = 'base属性值的name为必填属性  ' + getMessage('100001')
                return JSONResponse(queryset)
            data["name"] = base.get("name")
            if not base.get("state"):
                queryset['errorcode'] = 100001
                queryset['errormsg'] = 'base属性值的state为必填属性  ' + getMessage('100001')
                return JSONResponse(queryset)
            if not isinstance(base.get("state"), bool):
                queryset['errorcode'] = 100007
                queryset['errormsg'] = 'state ' + getMessage('100007')
                return JSONResponse(queryset)
            data["state"] = base.get("state")
            if base.get("mock"):
                data["mock"] = base.get("mock")
            if base.get("description"):
                print 'base.get("description"):', base.get("description")
                data["description"] = base.get("description")
            if base.get("tags") and isinstance(base.get("tags"), list):
                data["tags"] = base.get("tags")

            req = rec.get("request")
            if not isinstance(req, dict):
                queryset['errorcode'] = 100007
                queryset['errormsg'] = 'req ' + getMessage('100007')
                return JSONResponse(queryset)
            for key3 in ["url", "method", "content_type"]:
                if key3 not in req or not req.get(key3):
                    queryset['errorcode'] = 100001
                    queryset['errormsg'] = key3 + ' ' + getMessage('100001')
                    return JSONResponse(queryset)
                data[key3] = req.get(key3)
            if req.get("method") not in method_dict:
                queryset['errorcode'] = 100008
                queryset['errormsg'] = "method " + getMessage('100008')
                return JSONResponse(queryset)
            if req.get("content_type") not in content_dict:
                queryset['errorcode'] = 100008
                queryset['errormsg'] = "content_type " + getMessage('100008')
                return JSONResponse(queryset)
            data['req_data'] = req

            if rec.get("response"):
                data["resp_data"] = rec.get("response")

            if rec.get("error_code"):
                error_code = rec.get("error_code")
                if not isinstance(error_code, list):
                    queryset['errorcode'] = 100007
                    queryset['errormsg'] = 'error_code ' + getMessage('100007')
                    return JSONResponse(queryset)
                check_err = map(lambda x: isinstance(x, dict), error_code)
                if False in check_err:
                    queryset['errorcode'] = 100007
                    queryset['errormsg'] = 'error_code value type ' + getMessage('100007')
                    return JSONResponse(queryset)
                for err_rec in error_code:
                    if "error_code" not in err_rec or not err_rec.get("error_code"):
                        queryset['errorcode'] = 100001
                        queryset['errormsg'] = 'error_code属性值的error_code为必填属性  ' + getMessage('100001')
                        return JSONResponse(queryset)
                data["error_code"] = error_code
            data["api_id"] = api_id

            # call update interface information
            itf = InterFace(data=data)
            flag, msg = itf.modify_interface
            print 'flag:', flag, " msg:", msg, " interface:", up_interface
            if flag:
                error_msg = "Update interface id={0} success !".format(api_id)
                lock_filter.update(is_locked=False)  # 解锁
                add_modify_record(user=user, interface=up_interface, data=rec)  # 写修改记录
            else:
                queryset['errorcode'] = 300032
                error_msg = getMessage("300032") + msg
            queryset["errormsg"] = error_msg
            return JSONResponse(queryset)
        except BaseException, ex:
            except_info(ex)
            queryset['success'] = False
            queryset['errorcode'] = 300033
            queryset['errormsg'] = getMessage('300033') + "\n" + str(ex)
            return JSONResponse(queryset)
    else:
        queryset['errorcode'] = 100002
        queryset['errormsg'] = getMessage('100002')
        return JSONResponse(queryset)


# 删除API接口信息
@csrf_exempt
@interface_check_login
def delete_interface(request):
    queryset = {'timestamp': int(time.mktime(
        time.strptime(datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'), '%Y-%m-%d %H:%M:%S'))), \
        'success': True, 'errorcode': 0, 'errormsg': '', 'result': {}}
    if request.method == 'DELETE':
        try:
            now = datetime.datetime.now()
            params = json.loads(request.read())
            errmsg = ''
            if 'api_id' in params and params.get('api_id') != '':
                api_id = params.get('api_id')
            else:
                errmsg += 'api_id,'
                queryset['errorcode'] = 100001
                queryset['errormsg'] = errmsg + ' ' + getMessage('100001')
                return JSONResponse(queryset)
            api_id = int(api_id)
            interface_filter = Interface.objects.filter(id=api_id, is_deleted=False)
            if not interface_filter:
                queryset['success'] = False
                queryset['errorcode'] = 300029
                queryset['errormsg'] = getMessage('300029')
                return JSONResponse(queryset)
            interface = interface_filter[0]
            user_info = request.session.get("user", default=None)
            user = None
            if user_info:
                user_id = int(user_info.get("id"))
                user_filter = User.objects.filter(id=user_id)
                if user_filter:
                    user = user_filter[0]
            if user is None:
                queryset['success'] = False
                queryset['errorcode'] = 200003
                queryset['errormsg'] = getMessage('200003')
                return JSONResponse(queryset)
            # check user role
            members_filter = ProjectMember.objects.filter(project=interface.project, is_deleted=False, is_active=True)
            members = []
            if members_filter:
                members = map(lambda x: x.user, members_filter)
            if user not in members:
                queryset['success'] = False
                queryset['errorcode'] = 300031
                queryset['errormsg'] = getMessage('300031')
                return JSONResponse(queryset)

            # check the interface was locked
            lock_filter = LockInfo.objects.filter(interface=interface, is_deleted=False)
            if lock_filter:
                lock_filter.update(is_deleted=True, utime=now)  # 删除锁
            # check meta data
            meta_data_filter = MetaData.objects.filter(interface=interface, is_deleted=False)
            if meta_data_filter:
                meta_data_filter.update(is_deleted=True, utime=now, modifier=user)
            # check error code
            err_code_filter = ErrorCode.objects.filter(interface=interface, is_deleted=False)
            if err_code_filter:
                err_code_filter.update(is_deleted=True, utime=now, modifier=user)
            # delete the interface
            interface_filter.update(is_deleted=True, utime=now, modifier=user)
            queryset["errormsg"] = 'Delete the api_id={0} success.'.format(api_id)
            return JSONResponse(queryset)
        except BaseException, ex:
            except_info(ex)
            queryset["success"] = False
            queryset['errorcode'] = 300037
            queryset['errormsg'] = getMessage('300037') + "\n" + str(ex)
            return JSONResponse(queryset)
    else:
        queryset['errorcode'] = 100002
        queryset['errormsg'] = getMessage('100002')
        return JSONResponse(queryset)


# API解锁
@csrf_exempt
@interface_check_login
def cancel_lock(request):
    queryset = {'timestamp': int(time.mktime(
        time.strptime(datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'), '%Y-%m-%d %H:%M:%S'))), \
        'success': True, 'errorcode': 0, 'errormsg': '', 'result': {}}
    if request.method == 'GET':
        try:
            now = datetime.datetime.now()
            errmsg = ''
            if 'api_id' in request.GET and request.GET['api_id'] != '':
                api_id = request.GET['api_id']
            else:
                errmsg += 'api_id,'
                queryset['errorcode'] = 100001
                queryset['errormsg'] = errmsg + ' ' + getMessage('100001')
                return JSONResponse(queryset)
            api_id = int(api_id)
            interface_filter = Interface.objects.filter(id=api_id, is_deleted=False)
            if not interface_filter:
                queryset['success'] = False
                queryset['errorcode'] = 300029
                queryset['errormsg'] = getMessage('300029')
                return JSONResponse(queryset)
            interface = interface_filter[0]
            user_info = request.session.get("user", default=None)
            user = None
            if user_info:
                user_id = int(user_info.get("id"))
                user_filter = User.objects.filter(id=user_id)
                if user_filter:
                    user = user_filter[0]
            if user is None:
                queryset['success'] = False
                queryset['errorcode'] = 200003
                queryset['errormsg'] = getMessage('200003')
                return JSONResponse(queryset)
            # check the interface was locked
            lock_filter = LockInfo.objects.filter(interface=interface, is_locked=True, is_deleted=False)
            if not lock_filter:
                queryset['errorcode'] = 300034
                queryset['errormsg'] = getMessage('300034')
                return JSONResponse(queryset)
            if lock_filter[0].lock_user.id != user.id:
                queryset['errorcode'] = 300035
                queryset['errormsg'] = getMessage('300035') + ',请联系 ' + lock_filter[0].lock_user.username + ' 解锁.'
                return JSONResponse(queryset)
            lock_filter.update(is_locked=False, utime=now)  # 解锁
            queryset["errormsg"] = 'Unlock the api_id={0} success.'.format(api_id)
            return JSONResponse(queryset)
        except BaseException, ex:
            except_info(ex)
            queryset["success"] = False
            queryset['errorcode'] = 300036
            queryset['errormsg'] = getMessage('300036') + "\n" + str(ex)
            return JSONResponse(queryset)
    else:
        queryset['errorcode'] = 100002
        queryset['errormsg'] = getMessage('100002')
        return JSONResponse(queryset)


# 导入数据预检
@csrf_exempt
def check_data(request):
    queryset = {'timestamp': int(time.mktime(
        time.strptime(datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'), '%Y-%m-%d %H:%M:%S'))), \
        'success': True, 'errorcode': 0, 'errormsg': '', 'result': {}}
    if request.method == 'POST':
        try:
            params = json.loads(request.read())
            if "item" not in params or not params.get("item"):
                queryset['errorcode'] = 100001
                queryset['errormsg'] = 'item ' + getMessage('100001')
                return JSONResponse(queryset)
            check_info = precheck_interface_data(data=params.get("item"))
            if check_info:
                queryset["success"] = False
                queryset["result"] = check_info
                queryset["errormsg"] = "Precheck interface data fail."
            else:
                queryset["errormsg"] = "Precheck interface data success."
            return JSONResponse(queryset)
        except BaseException, ex:
            except_info(ex)
            queryset["success"] = False
            queryset['errorcode'] = 300037
            queryset['errormsg'] = "Precheck interface data fail." + str(ex)
            return JSONResponse(queryset)
    else:
        queryset['errorcode'] = 100002
        queryset['errormsg'] = getMessage('100002')
        return JSONResponse(queryset)


# 查询API接口修改记录
@csrf_exempt
def qry_edit_history(request):
    queryset = {'timestamp': int(time.mktime(
        time.strptime(datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'), '%Y-%m-%d %H:%M:%S'))), \
        'success': True, 'errorcode': 0, 'errormsg': '', 'result': []}
    if request.method == 'GET':
        try:
            err_msg = ''
            history_match = EditHistory.objects.filter(is_deleted=False)
            if "record_id" in request.GET and request.GET["record_id"] != '':
                rcd_id = request.GET["record_id"]
                if re.search(r',$', rcd_id):
                    rcd_id = rcd_id[:-1]
                record_id = []
                if re.match(r'\d+$', rcd_id):
                    record_id.append(int(rcd_id))
                else:
                    try:
                        rcd_list = eval(rcd_id)
                        record_id = map(lambda x: int(x), rcd_list)
                    except BaseException, ex:
                        except_info(ex)
                        err_msg += "record_id throw exception: " + str(ex) + ";"
                history_match = history_match.filter(pk__in=record_id)
            if "api_id" in request.GET and request.GET["api_id"] != '':
                api_id = request.GET["api_id"]
                if re.search(r',$', api_id):
                    api_id = api_id[:-1]
                interface_id = []
                if re.match(r'\d+$', api_id):
                    interface_id.append(int(api_id))
                else:
                    try:
                        api_list = eval(api_id)
                        interface_id = map(lambda x: int(x), api_list)
                    except BaseException, ex:
                        except_info(ex)
                        err_msg += "api_id throw exception: " + str(ex) + ";"
                itfs = Interface.objects.filter(pk__in=interface_id)
                history_match = history_match.filter(interface__in=itfs)

            if "user" in request.GET and request.GET["user"] != '':
                user = None
                req_user = request.GET["user"]
                user_filter = User.objects.filter(username=req_user)
                if user_filter:
                    user = user_filter[0]
                else:
                    err_msg += "user: " + req_user + "用户不存在;"
                history_match = history_match.filter(modifier=user)
            if "time" in request.GET and request.GET["time"] != '':
                timestr = '1900-01-01'
                req_time = request.GET["time"]
                try:
                    time.strptime(req_time, "%Y-%m-%d")
                    timestr = req_time
                except BaseException, ex:
                    except_info(ex)
                    err_msg += "time throw exception: " + str(ex) + ";"
                times = timestr.split('-')
                year = times[0]
                month = times[1]
                day = times[2]
                history_match = history_match.filter(ctime__year=year, ctime__month=month, ctime__day=day)
            if history_match:
                print 'history_match_count:', history_match.count()
                history_match = history_match.order_by('-ctime')
                for rec in history_match:
                    try:
                        content = eval(rec.content)
                    except BaseException, ex:
                        except_info(ex)
                        content = rec.content
                    temp = {"id": rec.id, "user": rec.modifier.username,
                            "ctime": rec.ctime.strftime('%Y-%m-%d %H:%M:%S'), "api_id": rec.interface.id,
                            "content": content}
                    queryset["result"].append(temp)
            queryset["errormsg"] = err_msg
            return JSONResponse(queryset)
        except BaseException, ex:
            except_info(ex)
            queryset["success"] = False
            queryset['errorcode'] = 300039
            queryset['errormsg'] = getMessage('300039') + str(ex)
            return JSONResponse(queryset)
    else:
        queryset['errorcode'] = 100002
        queryset['errormsg'] = getMessage('100002')
        return JSONResponse(queryset)


# 查询项目成员
@csrf_exempt
def qry_project_member(request):
    queryset = {'timestamp': int(time.mktime(
        time.strptime(datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'), '%Y-%m-%d %H:%M:%S'))), \
        'success': True, 'errorcode': 0, 'errormsg': '', 'result': []}
    if request.method == 'GET':
        try:
            errmsg = ''
            if 'project_id' in request.GET and request.GET['project_id'] != '':
                project_id = request.GET['project_id'].strip()
            else:
                errmsg += 'project_id,'
                queryset['errorcode'] = 100001
                queryset['errormsg'] = errmsg + ' ' + getMessage('100001')
                return JSONResponse(queryset)
            match1 = re.match(r"\d", project_id)
            if not match1:
                queryset['errorcode'] = 100007
                queryset['errormsg'] = 'project_id ' + getMessage('100007')
                return JSONResponse(queryset)
            project_id = int(project_id)
            project_filter = Project.objects.filter(id=project_id, is_deleted=False)
            if not project_filter:
                queryset['success'] = False
                queryset['errorcode'] = 300025
                queryset['errormsg'] = getMessage('300025')
                return JSONResponse(queryset)
            project = project_filter[0]
            members_filter = ProjectMember.objects.filter(project=project, is_deleted=False, is_active=True)
            if 'role' in request.GET and request.GET['role'] != '':
                role_str = request.GET['role'].strip()
                role = 0
                if re.match(r'\d', role_str):
                    role_int = int(role_str)
                    if role_int in [1, 2, 3]:
                        role = role_int
                members_filter = members_filter.filter(role=role)
            if 'username' in request.GET and request.GET['username'] != '':
                user_match = []
                username = request.GET['username'].strip()
                users_filter = User.objects.filter(username__icontains=username)
                if users_filter:
                    user_match = list(users_filter)
                members_filter = members_filter.filter(user__in=user_match)

            if members_filter:
                for item in members_filter:
                    temp = {"id": item.id, "role": item.role, "user": item.user.username}
                    queryset["result"].append(temp)
            return JSONResponse(queryset)
        except BaseException, ex:
            except_info(ex)
            queryset["success"] = False
            queryset['errorcode'] = 300040
            queryset['errormsg'] = getMessage('300040') + str(ex)
            return JSONResponse(queryset)
    else:
        queryset['errorcode'] = 100002
        queryset['errormsg'] = getMessage('100002')
        return JSONResponse(queryset)


# 新增项目成员
@csrf_exempt
@interface_check_login
def add_project_member(request):
    queryset = {'timestamp': int(time.mktime(
        time.strptime(datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'), '%Y-%m-%d %H:%M:%S'))), \
        'success': True, 'errorcode': 0, 'errormsg': '', 'result': {}}
    role_dict = {1: "普通用户", 2: "管理员", 3: "超级管理员"}
    if request.method == 'POST':
        try:
            params = json.loads(request.read())
            user_info = request.session.get("user", default=None)
            user = None
            if user_info:
                user_id = int(user_info.get("id"))
                user_filter = User.objects.filter(id=user_id)
                if user_filter:
                    user = user_filter[0]
            if user is None:
                queryset['success'] = False
                queryset['errorcode'] = 200003
                queryset['errormsg'] = getMessage('200003')
                return JSONResponse(queryset)
            required_fields = ['project_id', 'username', 'role']
            errmsg = ''
            for field in required_fields:
                if field not in params:
                    errmsg += field + ', '
            if errmsg:
                queryset['errorcode'] = 100001
                queryset['errormsg'] = errmsg + ' ' + getMessage('100001')
                return JSONResponse(queryset)
            if not isinstance(params.get("role"), int):
                queryset['errorcode'] = 100007
                queryset['errormsg'] = 'role ' + getMessage('100007')
                return JSONResponse(queryset)
            role = params.get("role")
            if role not in [1, 2]:
                queryset['errorcode'] = 100008
                queryset['errormsg'] = 'role ' + getMessage('100008')
                return JSONResponse(queryset)
            if not isinstance(params.get("project_id"), int):
                queryset['errorcode'] = 100007
                queryset['errormsg'] = 'project_id ' + getMessage('100007')
                return JSONResponse(queryset)
            project_id = params.get("project_id")
            project_filter = Project.objects.filter(id=project_id, is_deleted=False, is_active=True)
            if not project_filter:
                queryset['errorcode'] = 300025
                queryset['errormsg'] = "项目ID为:{0},{1}".format(project_id, getMessage("300025"))
                return JSONResponse(queryset)
            project = project_filter[0]
            username = params.get("username")
            if not isinstance(username, list):
                queryset['errorcode'] = 100007
                queryset['errormsg'] = 'username ' + getMessage('100007')
                return JSONResponse(queryset)
            # check user role
            members_filter = ProjectMember.objects.filter(project=project, is_deleted=False, is_active=True)
            members = []
            if members_filter:
                members = map(lambda x: x.user, members_filter)
            if user not in members:
                queryset['success'] = False
                queryset['errorcode'] = 300042
                queryset['errormsg'] = getMessage('300042')
                return JSONResponse(queryset)
            member_match = filter(lambda x: x.user.id == user.id, members_filter)
            member = member_match[0]
            if member.role == 1:  # 普通用户
                queryset['success'] = False
                queryset['errorcode'] = 300042
                queryset['errormsg'] = getMessage('300042')
                return JSONResponse(queryset)
            users_filter = User.objects.filter(username__in=username)
            if not users_filter:
                queryset['success'] = False
                queryset['errorcode'] = 300043
                queryset['errormsg'] = getMessage('300043')
                return JSONResponse(queryset)
            invalid_user = ''
            if users_filter.count() != len(username):  # check input user is valid
                valid_users = map(lambda x: x.username, users_filter)
                for input_user in username:
                    if input_user not in valid_users:
                        invalid_user += input_user + ','
            suc_msg = ''
            err_msg = ''
            for i_user in users_filter:
                if i_user in members:
                    msg = u"{0} {1} ".format(i_user.username, getMessage("300045"))
                    print msg
                    err_msg += i_user.username + ','
                else:
                    new_member = ProjectMember()
                    new_member.project = project
                    new_member.user = i_user
                    new_member.role = role
                    new_member.author = user
                    new_member.save()
                    suc_msg += i_user.username + ', '
            message = ''
            if suc_msg:
                message = u"已经成功添加:{0}作为项目:id={1} {2}的{3};".format(suc_msg[:-1], project_id, \
                                                                   project.project_name, role_dict.get(role))
            if err_msg:
                queryset["errormsg"] = message + err_msg[:-1] + getMessage("300045")
                if invalid_user:
                    queryset["errormsg"] = message + err_msg[:-1] + getMessage("300045") + ';' + invalid_user[:-1] + getMessage("300043")
            else:
                queryset["errormsg"] = message
                if invalid_user:
                    queryset["errormsg"] = message + ';' + invalid_user[:-1] + getMessage("300043")
            return JSONResponse(queryset)
        except BaseException, ex:
            except_info(ex)
            queryset['success'] = False
            queryset['errorcode'] = 300044
            queryset['errormsg'] = getMessage('300044') + str(ex)
            return JSONResponse(queryset)
    else:
        queryset['errorcode'] = 100002
        queryset['errormsg'] = getMessage('100002')
        return JSONResponse(queryset)


# 修改项目成员
@csrf_exempt
@interface_check_login
def update_project_member(request):
    queryset = {'timestamp': int(time.mktime(
        time.strptime(datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'), '%Y-%m-%d %H:%M:%S'))), \
        'success': True, 'errorcode': 0, 'errormsg': '', 'result': {}}
    role_dict = {1: "普通用户", 2: "管理员", 3: "超级管理员"}
    if request.method == 'PATCH':
        try:
            now = datetime.datetime.now()
            params = json.loads(request.read())
            user_info = request.session.get("user", default=None)
            user = None
            if user_info:
                user_id = int(user_info.get("id"))
                user_filter = User.objects.filter(id=user_id)
                if user_filter:
                    user = user_filter[0]
            if user is None:
                queryset['success'] = False
                queryset['errorcode'] = 200003
                queryset['errormsg'] = getMessage('200003')
                return JSONResponse(queryset)
            required_fields = ['member_id', 'role']
            errmsg = ''
            for field in required_fields:
                if field not in params:
                    errmsg += field + ', '
            if errmsg:
                queryset['errorcode'] = 100001
                queryset['errormsg'] = errmsg + ' ' + getMessage('100001')
                return JSONResponse(queryset)
            if not isinstance(params.get("role"), int):
                queryset['errorcode'] = 100007
                queryset['errormsg'] = 'role ' + getMessage('100007')
                return JSONResponse(queryset)
            role = params.get("role")
            if role not in [1, 2]:
                queryset['errorcode'] = 100008
                queryset['errormsg'] = 'role ' + getMessage('100008')
                return JSONResponse(queryset)
            if not isinstance(params.get("member_id"), int):
                queryset['errorcode'] = 100007
                queryset['errormsg'] = 'member_id ' + getMessage('100007')
                return JSONResponse(queryset)
            member_id = params.get("member_id")
            member_filter = ProjectMember.objects.filter(id=member_id, is_deleted=False, is_active=True)
            if not member_filter:
                queryset['errorcode'] = 300046
                queryset['errormsg'] = "成员ID为:{0},{1}".format(member_id, getMessage("300046"))
                return JSONResponse(queryset)
            member = member_filter[0]
            # check user role
            members_filter = ProjectMember.objects.filter(project=member.project, is_deleted=False, is_active=True)
            members = []
            if members_filter:
                members = map(lambda x: x.user, members_filter)
            if user not in members:
                queryset['success'] = False
                queryset['errorcode'] = 300047
                queryset['errormsg'] = getMessage('300047')
                return JSONResponse(queryset)
            member_match = filter(lambda x: x.user.id == user.id, members_filter)
            member_operate = member_match[0]
            if member_operate.role == 1:  # 普通用户
                queryset['success'] = False
                queryset['errorcode'] = 300047
                queryset['errormsg'] = getMessage('300047')
                return JSONResponse(queryset)
            if user.id == member.user.id:
                queryset['success'] = False
                queryset['errorcode'] = 300048
                queryset['errormsg'] = getMessage('300048')
                return JSONResponse(queryset)

            origin_role = member.role
            if origin_role == role:
                queryset['success'] = False
                queryset['errorcode'] = 300050
                msg = u'member_id={0} {1} 已经是{2},'.format(member_id, member.user.username, role_dict.get(role))
                queryset['errormsg'] = msg + getMessage('300050')
                return JSONResponse(queryset)
            # update member role
            member.role = role
            member.modifier = user
            member.utime = now
            member.save()
            queryset["errormsg"] = "Update member_id={0} {3} role {1}-->{2} success." \
                .format(member_id, role_dict.get(origin_role), role_dict.get(role), member.user.username)
            return JSONResponse(queryset)
        except BaseException, ex:
            except_info(ex)
            queryset['success'] = False
            queryset['errorcode'] = 300049
            queryset['errormsg'] = getMessage('300049') + str(ex)
            return JSONResponse(queryset)
    else:
        queryset['errorcode'] = 100002
        queryset['errormsg'] = getMessage('100002')
        return JSONResponse(queryset)


# 删除项目成员
@csrf_exempt
@interface_check_login
def delete_project_member(request):
    queryset = {'timestamp': int(time.mktime(
        time.strptime(datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'), '%Y-%m-%d %H:%M:%S'))), \
        'success': True, 'errorcode': 0, 'errormsg': '', 'result': {}}
    if request.method == 'DELETE':
        try:
            now = datetime.datetime.now()
            params = json.loads(request.read())
            user_info = request.session.get("user", default=None)
            user = None
            if user_info:
                user_id = int(user_info.get("id"))
                user_filter = User.objects.filter(id=user_id)
                if user_filter:
                    user = user_filter[0]
            if user is None:
                queryset['success'] = False
                queryset['errorcode'] = 200003
                queryset['errormsg'] = getMessage('200003')
                return JSONResponse(queryset)
            required_fields = ['member_id']
            errmsg = ''
            for field in required_fields:
                if field not in params:
                    errmsg += field + ', '
            if errmsg:
                queryset['errorcode'] = 100001
                queryset['errormsg'] = errmsg + ' ' + getMessage('100001')
                return JSONResponse(queryset)

            if not isinstance(params.get("member_id"), int):
                queryset['errorcode'] = 100007
                queryset['errormsg'] = 'member_id ' + getMessage('100007')
                return JSONResponse(queryset)
            member_id = params.get("member_id")
            member_filter = ProjectMember.objects.filter(id=member_id, is_deleted=False, is_active=True)
            if not member_filter:
                queryset['errorcode'] = 300046
                queryset['errormsg'] = "成员ID为:{0},{1}".format(member_id, getMessage("300046"))
                return JSONResponse(queryset)
            member = member_filter[0]
            # check user role
            members_filter = ProjectMember.objects.filter(project=member.project, is_deleted=False, is_active=True)
            members = []
            if members_filter:
                members = map(lambda x: x.user, members_filter)
            if user not in members:
                queryset['success'] = False
                queryset['errorcode'] = 300052
                queryset['errormsg'] = getMessage('300052')
                return JSONResponse(queryset)
            member_match = filter(lambda x: x.user.id == user.id, members_filter)
            member_operate = member_match[0]
            if member_operate.role == 1:  # 普通用户
                queryset['success'] = False
                queryset['errorcode'] = 300052
                queryset['errormsg'] = getMessage('300052')
                return JSONResponse(queryset)
            if member.role == 3:  # 超级管理员不能被删除
                queryset['success'] = False
                queryset['errorcode'] = 300053
                queryset['errormsg'] = getMessage('300053')
                return JSONResponse(queryset)
            # delete the member
            member.is_deleted = True
            member.modifier = user
            member.utime = now
            member.save()
            queryset["errormsg"] = "Delete member_id={0} {1} from project_id={2} {3} success." \
                .format(member_id, member.user.username, member.project.id, member.project.project_name)
            return JSONResponse(queryset)
        except BaseException, ex:
            except_info(ex)
            queryset['success'] = False
            queryset['errorcode'] = 300054
            queryset['errormsg'] = getMessage('300054') + str(ex)
            return JSONResponse(queryset)
    else:
        queryset['errorcode'] = 100002
        queryset['errormsg'] = getMessage('100002')
        return JSONResponse(queryset)


# mock请求处理
@csrf_exempt
def mock_data(request):
    queryset = {'timestamp': int(time.mktime(
        time.strptime(datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'), '%Y-%m-%d %H:%M:%S'))), \
        'success': True, 'errorcode': 0, 'errormsg': '', 'result': {}}
    if request.method == 'GET':
        try:
            callback = ''
            if 'callback' in request.GET and request.GET['callback'] != '':
                callback = request.GET['callback'].strip()
            # print 'request.path:', request.path
            full_path = request.path
            if not re.match(r'/mockdata/\d+/\w', full_path):
                errmsg = u"mock 请求格式错误，请修改后重新提交请求！"
                return HttpResponse(errmsg)
            params = full_path.split('/mockdata/')
            real_param = params[1]
            first = real_param.find('/')
            project_id = real_param[:first]
            url = real_param[first:]
            if re.search(r'/$', url):
                url = url[:-1]
            project_filter = Project.objects.filter(id=project_id, is_deleted=False)
            if not project_filter:
                errmsg = u"project_id={0} {1}".format(project_id, getMessage("300051"))
                return HttpResponse(errmsg)
            interface_filter = Interface.objects.filter(project=project_filter[0], url=url, is_deleted=False)
            if not interface_filter:
                errmsg = u"project_id={0} url={1} {2}".format(project_id, url, getMessage("300029"))
                return HttpResponse(errmsg)
            interface = interface_filter[0]
            if not interface.project.is_active:
                errmsg = u"project_id={0}  项目未被启用.".format(project_id)
                return HttpResponse(errmsg)
            if not interface.is_active:
                errmsg = u"project_id={0}  api_id={1} api未被启用.".format(project_id, interface.id)
                return HttpResponse(errmsg)
            if not interface.mockdata:
                errmsg = u"api_id={0} mockdata未设置,请设置mockdata后重新提交请求.".format(interface.id, url)
                return HttpResponse(errmsg)
            else:
                content_type = interface.get_content_type_display()
                mock = interface.mockdata
                if callback:
                    mock = callback + '(' + str(mock) + ');'
                    # print 'mock:', mock
                return HttpResponse(mock, content_type=content_type)
        except BaseException, ex:
            except_info(ex)
            errmsg = u"{0}:{1}".format(getMessage("300055"), str(ex))
            return HttpResponse(errmsg)
    else:
        queryset['errorcode'] = 100002
        queryset['errormsg'] = getMessage('100002')
        return JSONResponse(queryset)


# 获取对应的API代码模板
@csrf_exempt
def qry_api_code(request):
    queryset = {'timestamp': int(time.mktime(
        time.strptime(datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'), '%Y-%m-%d %H:%M:%S'))), \
        'success': True, 'errorcode': 0, 'errormsg': '', 'result': {}}
    if request.method == 'GET':
        try:
            errmsg = ''
            if 'api_id' in request.GET and request.GET['api_id'] != '':
                api_id = request.GET['api_id']
            else:
                errmsg += 'api_id,'
                queryset['errorcode'] = 100001
                queryset['errormsg'] = errmsg + ' ' + getMessage('100001')
                return JSONResponse(queryset)

            if 'template_id' in request.GET and request.GET['template_id'] != '':
                template_id = request.GET['template_id']
            else:
                errmsg += 'template_id,'
                queryset['errorcode'] = 100001
                queryset['errormsg'] = errmsg + ' ' + getMessage('100001')
                return JSONResponse(queryset)

            api_id = int(api_id)
            template_id = int(template_id)

            interface_filter = Interface.objects.filter(id=api_id, is_deleted=False)

            if not interface_filter:
                queryset['success'] = False
                queryset['errorcode'] = 300029
                queryset['errormsg'] = getMessage('300029')
                return JSONResponse(queryset)

            template_filter = CodeModel.objects.filter(id=template_id, is_deleted=False)
            if not template_filter:
                queryset['success'] = False
                queryset['errorcode'] = 300058
                queryset['errormsg'] = getMessage('300058')
                return JSONResponse(queryset)
            interface = InterFace(api_id)
            return_data = interface.get_metadata
            # print return_data
            template_obj = template_filter[0]
            tpl = template_obj.content
            t = template.Template(tpl)
            c = template.Context(return_data)
            queryset['result'] = t.render(c)
            return JSONResponse(queryset)
            # return JSONResponse(return_data)
        except BaseException, ex:
            except_info(ex)
            queryset['errorcode'] = 300056
            queryset['errormsg'] = getMessage('300056') + ':' + str(ex)
            return JSONResponse(queryset)
    else:
        queryset['errorcode'] = 100002
        queryset['errormsg'] = getMessage('100002')
        return JSONResponse(queryset)


# 查询代码模板
@csrf_exempt
def qry_code_model(request):
    queryset = {'timestamp': int(time.mktime(
        time.strptime(datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'), '%Y-%m-%d %H:%M:%S'))), \
        'success': True, 'errorcode': 0, 'errormsg': '', 'result': []}
    if request.method == 'GET':
        try:
            code_md_filter = CodeModel.objects.filter(is_deleted=False, is_active=True, parent=None)
            result = []
            if code_md_filter:
                for p_model in code_md_filter:
                    p_dict = {'id': p_model.id, 'name': p_model.code_name, 'child': []}
                    child_model_filter = CodeModel.objects.filter(is_deleted=False, is_active=True, parent=p_model)
                    for child in child_model_filter:
                        child_dict = {'id': child.id, 'name': child.code_name, 'child': []}
                        p_dict['child'].append(child_dict)
                    result.append(p_dict)
                queryset['result'] = result
            return JSONResponse(queryset)
        except BaseException, ex:
            except_info(ex)
            queryset['errorcode'] = 300057
            queryset['errormsg'] = getMessage('300057') + ':' + str(ex)
            return JSONResponse(queryset)
    else:
        queryset['errorcode'] = 100002
        queryset['errormsg'] = getMessage('100002')
        return JSONResponse(queryset)


# 生成验证码
def create_check_code(request):
    try:
        mstream = StringIO.StringIO()
        validate_code = Checkcode.create_validate_code()
        img = validate_code[0]
        img.save(mstream, "GIF")

        #将验证码保存到session
        request.session["CheckCode"] = validate_code[1]
        session_code = request.session["CheckCode"]
        print 'set session_code:', session_code

        return HttpResponse(mstream.getvalue())
    except BaseException, ex:
        except_info(ex)
        msg = "create_check_code throw exception:" + str(ex)
        Http404(msg)


# 用户注册
@csrf_exempt
def user_register(request):
    queryset = {'timestamp': int(time.mktime(
        time.strptime(datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'), '%Y-%m-%d %H:%M:%S'))), \
        'success': True, 'errorcode': 0, 'errormsg': '', 'result': []}
    if request.method == 'POST':
        try:
            params = request.POST.dict()
            required_fields = ['username', 'password', 'checkcode']
            errmsg = ''
            for field in required_fields:
                if field not in params or not params[field]:
                    errmsg += field + ', '
            if errmsg:
                queryset['success'] = False
                queryset['errorcode'] = 100001
                queryset['errormsg'] = errmsg + ' ' + getMessage('100001')
                return JSONResponse(queryset)
            username = params.get('username')
            password = params.get('password')
            checkcode = params.get('checkcode')
            user_filter = User.objects.filter(username=username)
            if user_filter:
                queryset['errorcode'] = 200005
                queryset['errormsg'] = username + ' ' + getMessage('200005')
                return JSONResponse(queryset)

            # 从session中获取验证码
            session_code = request.session["CheckCode"]
            print 'get session_code:', session_code
            if checkcode.strip().lower() != session_code.lower():
                queryset['success'] = False
                queryset['errorcode'] = 200007
                queryset['errormsg'] = getMessage('200007')
                return JSONResponse(queryset)

            new_user = User()
            new_user.username = username
            new_user.set_password(password)
            new_user.save()
            queryset['errormsg'] = u"恭喜您注册成功，用户名为:{0} 用户ID为:{1}".format(username, new_user.id)
            return JSONResponse(queryset)
        except BaseException, ex:
            except_info(ex)
            queryset['success'] = False
            queryset['errorcode'] = 200006
            queryset['errormsg'] = getMessage('200006') + ':' + str(ex)
            return JSONResponse(queryset)
    else:
        queryset['success'] = False
        queryset['errorcode'] = 100002
        queryset['errormsg'] = getMessage('100002')
        return JSONResponse(queryset)
