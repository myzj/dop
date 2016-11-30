# -*- coding:utf-8 -*-
import sys
reload(sys)
sys.setdefaultencoding('utf-8')
from models import Interface, MetaData, ErrorCode, Project, LockInfo, ProjectMember
from django.contrib.auth.models import User
from common import except_info
import time
import json
import datetime
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
                    "decription": "" if self.interface.description is None else self.interface.description, \
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
                new_interface.url = self.data.get("url")
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
                    new_meta_data = MetaData()
                    new_meta_data.interface = new_interface
                    new_meta_data.author = self.data.get("user")
                    new_meta_data.position = position_dict.get("Request")
                    new_meta_data.data = str(self.data.get("req_data"))
                    new_meta_data.save()
                if self.data.get("resp_data"):
                    new_meta_data = MetaData()
                    new_meta_data.interface = new_interface
                    new_meta_data.author = self.data.get("user")
                    new_meta_data.position = position_dict.get("Response")
                    new_meta_data.data = str(self.data.get("resp_data"))
                    new_meta_data.save()
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
                return True, ""
            return False, getMessage("300026")
        except BaseException, ex:
            except_info(ex)
            return False, getMessage("300027") + ": " + str(ex)

    @property
    def modify_interface(self):
        try:
            print '--------------Call modify_interface -----------'
            if self.data and isinstance(self.data, dict):  # data is not None and is a dictionary
                # update base
                mdf_interface = Interface.objects.get(id=1)
                # mdf_interface = self.data.get("interface")
                mdf_interface.modifier = self.data.get("user")
                mdf_interface.project = self.data.get("project")
                mdf_interface.interface_name = self.data.get("name")
                mdf_interface.url = self.data.get("url")
                mdf_interface.method = method_dict.get(self.data.get("method"))
                mdf_interface.content_type = content_dict.get(self.data.get("content_type"))
                mdf_interface.is_active = self.data.get("state")
                if self.data.get("mock"):
                    mdf_interface.mockdata = self.data.get("mock")
                if self.data.get("tags"):
                    mdf_interface.tags = str(self.data.get("tags"))
                if self.data.get("description"):
                    mdf_interface.description = self.data.get("description")
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
                        resp_filter.update(is_deleted=True, modifier=self.data.get("user"))

                # update error code
                org_err_code_filter = ErrorCode.objects.filter(interface=mdf_interface, is_deleted=False, is_active=True)
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
                            value.save()
                else:
                    if org_err_code_filter:
                        org_err_code_filter.update(is_deleted=True, modifier=self.data.get("user"))

                print '--------------Call modify_interface finished! -----------'
                return True, ""
            return False, getMessage("300032")
        except BaseException, ex:
            except_info(ex)
            return False, getMessage("300033") + ": " + str(ex)


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
                    queryset['errormsg'] = getMessage('300030')
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
            item = params.get("item")
            if not isinstance(item, list):
                queryset['errorcode'] = 100007
                queryset['errormsg'] = 'item ' + getMessage('100007')
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
                        if "error_code" not in err_rec and not err_rec.get("error_code"):
                            queryset['errorcode'] = 100001
                            queryset['errormsg'] = 'error_code属性值的error_code为必填属性  ' + getMessage('100001')
                            return JSONResponse(queryset)
                    data["error_code"] = error_code

                # call write data to db
                itf = InterFace(data=data)
                flag, msg = itf.create_interface
                view_data = data
                view_data.pop("project")
                view_data.pop("user")
                queryset["result"] = view_data
                if flag:
                    error_msg = "Add new interface success !"
                else:
                    queryset['errorcode'] = 300026
                    error_msg = getMessage("300026") + msg
                queryset["errormsg"] = error_msg
            return JSONResponse(queryset)
        except BaseException, ex:
            except_info(ex)
            queryset['success'] = False
            queryset['errorcode'] = 300027
            queryset['errormsg'] = getMessage('300027') + "\n" + str(ex)
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
            if "project" not in info:
                queryset['errorcode'] = 100001
                queryset['errormsg'] = 'info属性值的project为必填属性 ' + getMessage('100001')
                return JSONResponse(queryset)
            if "api_id" not in info:
                queryset['errorcode'] = 100001
                queryset['errormsg'] = 'info属性值的api_id为必填属性 ' + getMessage('100001')
                return JSONResponse(queryset)
            project_id = int(info.get("project"))
            project_filter = Project.objects.filter(id=project_id, is_deleted=False, is_active=True)
            if not project_filter:
                queryset['errorcode'] = 300025
                queryset['errormsg'] = "项目ID为:{0},{1}".format(project_id, getMessage("300025"))
                return JSONResponse(queryset)
            api_id = int(info.get("api_id"))
            api_filter = Interface.objects.filter(id=api_id, is_deleted=False, project=project_filter[0])
            if not api_filter:
                queryset['errorcode'] = 300029
                queryset['errormsg'] = "API接口ID为:{0},{1}".format(api_id, getMessage("300029"))
                return JSONResponse(queryset)
            up_interface = api_filter[0]
            # check the interface was locked
            lock_filter = LockInfo.objects.filter(interface=up_interface, is_locked=True, is_deleted=False, lock_user=user)
            if not lock_filter:
                queryset['errorcode'] = 300030
                queryset['errormsg'] = getMessage('300030')
                return JSONResponse(queryset)
            item = params.get("item")
            if not isinstance(item, list):
                queryset['errorcode'] = 100007
                queryset['errormsg'] = 'item ' + getMessage('100007')
                return JSONResponse(queryset)
            rec = item[0]
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
                    if "error_code" not in err_rec and not err_rec.get("error_code"):
                        queryset['errorcode'] = 100001
                        queryset['errormsg'] = 'error_code属性值的error_code为必填属性  ' + getMessage('100001')
                        return JSONResponse(queryset)
                data["error_code"] = error_code
                data["interface"] = up_interface

            # call update interface information
            itf = InterFace(data=data)
            flag, msg = itf.modify_interface
            view_data = data
            view_data.pop("project")
            view_data.pop("user")
            view_data.pop("interface")
            queryset["result"] = view_data
            if flag:
                error_msg = "Update interface id={0} success !".format(api_id)
                lock_filter.update(is_locked=False)  # 解锁
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


# API解锁
@csrf_exempt
@interface_check_login
def cancel_lock(request):
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
                queryset['errormsg'] = getMessage('300035')
                return JSONResponse(queryset)
            lock_filter.update(is_locked=False)  # 解锁
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
