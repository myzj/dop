# -*- coding: utf-8 -*-
import config
# 返回配置信息
def get_config(request):
    return {'config':config}
