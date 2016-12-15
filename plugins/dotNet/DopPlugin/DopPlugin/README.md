
部署方式：
1.拷贝 DopPlugin.dll 文件到项目里
2.修改web.config ，在 Httphandler 或是 handlers 增加 <add name="dophandler" path="/dop/*" verb="*" type="DopPlugin.DopHandler,DopPlugin" />
3.访问 http://xx/dop/docs?act=check 检查接口是否有效（有效的定义是 接口描述不能为空，请求和相应的 body 字段描述不能为空）
4.访问 http://xx/dop/docs?apis=hello,hello1 按照接口名返回部分接口
5.访问 http://xx/dop/docs 返回全部接口

接口整改规范：
1.此插件适用 ServiceStack 3.x 服务，
2.服务请求模型添加 Description 特性
	[Description("测试接口 Hello")]
    public class Hello
    { ... ｝
3.请求和响应模型所有属性都增加 ApiMember 特性
	[ApiMember(Description = "用户id")]
    public int UserId { get; set; }