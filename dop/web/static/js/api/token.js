define('api/token', ['config/url'], function(configUrl) {

    return {
        loadModuleDate:{
            url:configUrl.loadModuleDate,
            post:{
                moduleCode:"?"
            },
            method: 'jsonp',
            async: true
        },
        getMemberInfo:{
            url:configUrl.getMemberInfo,
            post:{
                "Token":window.Token,
                "isApp":window.isMyzjApp,
            },
            method: 'get',
            async: true
        },
        //获取分享人头像昵称
        AppSelectMemberHead:{
            url: configUrl.AppSelectMemberHead,
            method:"get",
            post: {
                "UserId": '?',
                "SourceTypeSysNo": window.SourceTypeSysNo,
            }
        },
    };

})