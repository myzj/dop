define('widget/MenuHelper', ['lib/common', 'model/token', 'config/url'], function ($, modelToken, url) {
    function MenuHp(data) {
        var userinfo = modelToken.getUserInfo();
        if (data == 5) {
            if (userinfo.UserId != null && userinfo.UserId > 0) {
                if (userinfo.NickName != null && userinfo.NickName.length > 0) {
                    var html = '<div class="loginfooter_menu" style="display:none"><ul><li style="width:100%"><a data-href="{3}"><dl><dt></dt><dd>' + userinfo.NickName + '</dd></dl></a></li></ul></div>';
                }
                else {
                    var html = '<div class="loginfooter_menu" style="display:none"><ul><li style="width:100%"><a data-href="{3}"><dl><dt></dt><dd>' + userinfo.Mobile + '</dd></dl></a></li></ul></div>';
                }
                html = html.format(url.localloginDomain, url.localloginDomain + "register", url.localloginDomain + "shopping/cart", url.localloginDomain + "Member");
            }
            else {
                var html = '<div class="loginfooter_menu" style="display:none"><ul><li><a data-href="'+ window.location.href +'"><dl><dt></dt><dd>登录</dd></dl></a></li><li><a href="{1}"><dl><dt></dt><dd>注册</dd></dl></a></li></ul></div>';
                html = html.format(url.localloginDomain, url.localloginDomain + "Register/step1?" + $.param({ gotourl: window.location.href }, true), url.localloginDomain + "shopping/cart", url.localloginDomain + "Member");
            }
        }
        else {
            var html = '<div class="nav_menu"><ul><li class="' + (data == 1 ? "menu1" : "") + '"><a data-staticindex="81" data-showType="list" data-loadtype="fall" data-gototype="url" data-pageCategory="menu"  href="{0}"><dl><dt></dt><dd>首页</dd></dl></a></li><li class="' + (data == 2 ? "menu2" : "") + '"><a data-staticindex="82" data-showType="list" data-loadtype="fall" data-gototype="url" data-pageCategory="menu" href="{1}"><dl><dt></dt><dd>分类</dd></dl></a></li><li class="' + (data == 3 ? "menu3" : "") + '"><a data-staticindex="83" data-showType="list" data-loadtype="fall" data-gototype="url" data-pageCategory="menu" href="{2}"><dl><dt></dt><dd>购物车</dd></dl></a></li><li class="' + (data == 4 ? "menu4" : "") + '"><a data-staticindex="84" data-showType="list" data-loadtype="fall" data-gototype="url" data-pageCategory="menu" data-href="{3}"><dl><dt></dt><dd>账户</dd></dl></a></li></ul></div>';
            html = html.format(url.localloginDomain, url.localloginDomain + "category", url.localloginDomain + "shopping/cart", url.localloginDomain + "Member");
        }
        $("body").append(html);
        $.checkUserinfo();
        //bindStaticAciton();
    }
    return {
        MenuHp: MenuHp
    }
});