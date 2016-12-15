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
    "100007": ["Parameter type error", u"参数类型错误"],
    "100008": ["param value error", u"参数取值错误"],

    "200001": ["", u"账户已禁用"],
    "200002": ["", u"密码不正确"],
    "200003": ["", u"用户名不存在"],
    "200004": ["", u"退出失败"],
    "200005": ["Username has existed,please rename the username.", u"您输入用户名已经存在,请重新输入新的用户名注册。"],
    "200006": ["User register throw exception.", u"用户注册出现异常"],
    "200007": ["Check code does not match.", u"验证码不匹配"],

    "300015": ["", u"查询列表异常"],
    "300016": ["", u"新增团队异常"],
    "300017": ["", u"当前团队名称已存在"],
    "300018": ["", u"新增团队成功"],
    "300019": ["", u"找不到关联的工程"],
    "300020": ["", u"新增团队成功"],
    "300021": ["", u"查询页码错误"],
    "300022": ["", u"当前项目名称已存在"],
    "300023": ["", u"新增项目异常"],
    "300024": ["", u"找不到关联的团队"],
    "300025": ["", u"找不到关联的项目"],
    "300026": ["Add interface fail", u"新增API接口失败"],
    "300027": ["Add interface throw exception", u"新增API接口出现异常"],
    "300028": ["Query interface detail information throw exception", u"查询API接口明细信息出现异常"],
    "300029": ["No qualified interface information", u"没有符合条件的API接口信息"],
    "300030": ["API interface was locked", u"API接口已经被锁不能编辑"],
    "300031": ["You have no right to operate the interface", u"您不是项目组成员无权在该项目中操作API接口"],
    "300032": ["Update interface fail", u"更新API接口失败"],
    "300033": ["Update interface throw exception", u"更新API接口出现异常"],
    "300034": ["No qualified lock information", u"没有符合条件的API被锁信息"],
    "300035": ["You have no right to unlock the interface", u"您无权解锁"],
    "300036": ["Unlock interface lock throw exception", u"解锁API接口出现异常"],
    "300037": ["Delete interface throw exception", u"删除API接口出现异常"],
    "300038": ["Precheck interface data fail", u"数据预检查失败"],
    "300039": ["Query interface edit history throw exception", u"查询API接口修改记录出现异常"],
    "300040": ["Query project member throw exception", u"查询项目成员出现异常"],
    "300041": ["", u"找不到该用户关联的项目"],
    "300042": ["You have no right to add a member", u"您不是项目组管理员无权添加成员"],
    "300043": ["Add project member does't exist", u"新增项目成员输入用户名不存在"],
    "300044": ["Add project member throw exception", u"新增项目成员出现异常"],
    "300045": ["The user has existed in the project", u"新增用户已经是项目组成员,无需重复添加"],
    "300046": ["The project member doesn't existed ", u"查找不到匹配的项目成员信息"],
    "300047": ["You have no right to modify a member", u"您不是项目组管理员无权修改成员角色"],
    "300048": ["Member can't modify himself", u"管理员不能修改自己"],
    "300049": ["Update project member throw exception", u"修改项目成员出现异常"],
    "300050": ["No need to repeat modification the memeber role", u"无需重复修改成员角色"],
    "300051": ["", u"该项目不存在"],
    "300052": ["You have no right to delete a member", u"您不是项目组管理员无权删除成员角色"],
    "300053": ["Super admin can't be deleted", u"项目的超级管理员不能被删除"],
    "300054": ["Delete project member throw exception", u"删除项目成员出现异常"],
    "300055": ["Mock request throw exception", u"mock请求出现异常"],
    "300056": ["Query interface data throw exception", u"查询API接口数据出现异常"],
    "300057": ["Query code model throw exception", u"查询代码模板出现异常"],
    "300058": ["Query code model does not exist", u"查询代码模板不存在"],


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