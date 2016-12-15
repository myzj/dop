window.ag_count_send = function () { };


var _agq = _agq || [];
_agq.push(['_cid', '248']);
_agq.push(['_eid', '2']);
ag_count_send(_agq);

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-55742608-3']);
_gaq.push(['_setCustomVar', 1, 'memberid', window.UserId, 1]);
_gaq.push(['_setCustomVar', 2, 'guid', window.UserGuid, 1]);
_gaq.push(['_setCustomVar', 3, 'AreaId', window.AreaId, 1]);


//if (typeof ($.cookie) != 'undefined') {
//    //客户真实标签
//    _gaq.push(['_setCustomVar', 3, 'dlid', $.cookie("origdlid"), 2]);
//    //随机分配（浏览组） A | B
//    _gaq.push(['_setCustomVar', 4, 'visitgroup', $.cookie("VisitGroup"), 2]);
//}

//如果获取最外层url 报异常，则代表当前页面在 ，当前页面的URL 记录到统计系统中
try {
    var topUrl = top.location.href;
} catch (e) {
    _gaq.push(['_setCustomVar', 5, 'iniframe', window.location.href , 2]);
}

_gaq.push(['_trackPageview']);
var bd_cpro_rtid = "";
function _gaq_push(pagename, fieldname, url, isenabled) {
    ga('send', "event", pagename, fieldname, url);
}

(function() {
    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);
})();

//新数数码网络统计代码 如果影响到网站，随时删除，订单提交页面也添加该代码
//var gb = document.createElement('script');
//gb.type = 'text/javascript';
//gb.async = true;
//gb.src = "http://aw.kejet.net/t?p=07&c=nr&er=1&kd=1&sid=0qV6tM5sGOuB&zid=0qV6tM5sGOuA";
//var ss = document.getElementsByTagName('script')[0];
//ss.parentNode.insertBefore(gb, ss);

(function () {
    var baidu = document.createElement('script');
    baidu.type = 'text/javascript';
    baidu.async = true;
    baidu.src = (("https:" == document.location.protocol) ? " https://" : " http://") + 'hm.baidu.com/h.js%3F35c4b666eea654823f31f131b726b543';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(baidu, s);
})();
