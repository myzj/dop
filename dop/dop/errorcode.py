# coding:utf-8
###################
# version  0.1
# author  王节红,
###################

# 错误号   英文代码    中文描述    备注
CONSTANT = {
    "100001": ["Required field can not be empty", u"必填字段不能空"],
    "100002": ["Request type error", u"请求类型错误"],
    "100003": ["Check forbidden words throw exception.", u"禁词检查出现异常"],
    "100004": ["", u"网络异常"],
    "100005": ["", u"用户信息获取失败"],
    "100006": ["", u"信息获取失败"],

    "200001":   ["", u"账户已禁用"],
    "200002":   ["", u"密码不正确"],
    "200003":   ["", u"用户名不存在"],
    "200004":   ["", u"退出失败"],

    "300014": ["", u"请求类型错误"],
    "300015": ["", u"查询team列表异常"],

}

#
def getMessage(k='100100000', en='ch'):
    k = str(k)
    if not k:
        return None

    if en == 'ch':
        return CONSTANT.get(k)[1]
    elif en == 'en':
        return CONSTANT.get(k)[0]
    return CONSTANT.get(k)[1]