# -*- coding: utf-8 -*-
import config


# 返回配置信息
def get_config(request):
    return {'config': config}


def get_user_info(request):
    user_info = request.session.get("user", default=None)
    return {'user_info': user_info}
