# -*- coding: utf-8 -*-
import config


# 返回配置信息
def get_config(request):
    full_path = request.get_full_path()
    last_path = full_path.split("?")
    config.path = last_path[0]
    return {'config': config}


def get_user_info(request):
    user_info = request.session.get("user", default=None)
    return {'user_info': user_info}
