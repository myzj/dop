# -*- coding:utf-8 -*-
from rest_framework.renderers import JSONRenderer
from django.http import HttpResponse
from dop import errorcode
import requests
import json
import sys
from django.http import HttpResponseRedirect
import time
import datetime
from django.views.decorators.csrf import csrf_exempt


class JSONResponse(HttpResponse):
    """
    An HttpResponse that renders it's content into JSON.
    """

    def __init__(self, data, **kwargs):
        content = JSONRenderer().render(data)
        kwargs['content_type'] = 'application/json;charset=utf-8'
        super(JSONResponse, self).__init__(content, **kwargs)

    """
        success     bool    请求是否成功
        errorcode   string  错误码
        errormsg    string  错误信息
        timestamp   int     接口响应时间
        result      json    接口返回数据
    """


# 异常信息打印
def except_info(ex, params=None):
    exc_type, exc_value, exc_traceback = sys.exc_info()
    traceback_details = {
        'filename': exc_traceback.tb_frame.f_code.co_filename,
        'lineno': exc_traceback.tb_lineno,
        'name': exc_traceback.tb_frame.f_code.co_name,
        'type': exc_type.__name__,
        'message': exc_value.message,
    }
    print "Throw Exception:{0}\n params:{1} errmsg:{2}".format(traceback_details, params, str(ex))

