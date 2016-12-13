define('lib/getValidation', ['config/url', 'http://g.alicdn.com/sd/nch5/index.js?t=$timestamp'], function (configUrl) {
    var nc_option = {
        renderTo: '#dom_id',
        appkey: window.AppKey, // 应用标识
        token: window.Token,
        callback: function (data) {// 校验成功回调
            console.log("data==",data);
            console.log("data.csessionid", data.csessionid);
            console.log("data.sig", data.sig);
            console.log("Token", window.Token);
        },
        error: function (s) {
        },
        verifycallback: function (data) {
            if (data.code == "200") {
            }
        }
    };
    //NoCaptcha.init(nc_option);
    //NoCaptcha.setEnabled(true);

    function getValidationType() {
        $.ajax({
            url: configUrl.localloginDomain + 'GraphicVerification/Get',
            type: "GET",
            data:"",
            cache: false,
            async: true,
            success: function (result) {
               

            }, error: function (XMLHttpResponse) {
                alert("系统繁忙，请稍后！");
            }
        });
    }

});