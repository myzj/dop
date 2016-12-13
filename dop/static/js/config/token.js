define('api/token', ['config/url'], function(configUrl) {

    return {
        getToken: {
            url: configUrl.sappsDomain + 'misc/GetToken',
            isOnlyData: 1, //表示post请求只有一个data参数，参数值是json字符串
            post: {
                apiVersion: configUrl.apiVersion,
                cityCode: '?',
                token: '?',
                body: '??'
            },
            body: {
                deviceId: '?',
                osType: configUrl.osType,
                osVersionNo: '?',
                appVersionNo: '?'
            },
            method: 'post'
        },
        //获得MD5加密
        getMD5String: {
            url: configUrl.localloginDomain+'Common/GetUserInfoMd5',
            dataType: "jsonp",
            post: {
                SourceTypeSysNo: '?',
                UniflLoginEnum: '?',
                EnumValue: '?'
            },
            method: 'post'
        },
        //获得UserId
        getUserId: {
            url: configUrl.localloginDomain + 'Common/GetUserIdResult',
            post: {
               
            },
            method: 'post',
            async: false
        },
        //替换价格
        queryPromPriceByProdId: {
            url: configUrl.raplacePriceDomain + 'QueryPromPriceByProdId',
            post: {
                ProductIdList: '?',//商品列表 字符串以,隔开
                SourceTypeSysNo:'2'

            },
            method: 'post'
        },
        //获得当前用户信息
        getUserContext: {
            url: configUrl.localloginDomain + 'Common/GetUserContext',
            post: {
            },
            method: 'post'
        },
        //获得当前GUID
        getUserGuid: {
            url: configUrl.localloginDomain + 'Common/getGuid',
            post: {
            },
            method: 'post',
            async: false
        },
        //获得当前GUID
        getUserLevel: {
            url: configUrl.localloginDomain + 'Common/getUserLevel',
            post: {
            },
            method: 'post',
            async: false
        },
        //获得当前GUID
        getUserCode: {
            url: configUrl.localloginDomain + 'Common/getUserCode',
            post: {
            },
            method: 'post',
            async: false
        },
        //获取客户端IP
        getClientIp: {
            url: configUrl.localloginDomain + 'Common/getClientIp',
            post: {
            },
            method: 'post',
            async: false
        },
        getUserInfo: {
            url: configUrl.localloginDomain + 'Common/getUserInfo',
            post: {
            },
            method: 'post',
            async: false
        },
        LoginOut: {//退出登录
            url: configUrl.localloginDomain + 'Login/Loginout',
            post: {
            },
            method: 'post',
            async: false
        },
        getUserUnionid: {//获得第三方unionid
            url: configUrl.localloginDomain + "Common/GetUserUnionid",
            post: {
            },
            method: 'post',
            async:false
        },
        getWeChatRedirect: {//微信登录回跳
            url: configUrl.localloginDomain + "Common/GetWeChatRedirect",
            post: {
            },
            method: 'post',
            async: false
        },
        GetPartnerId: {//微信注册应用编号
            url: configUrl.localloginDomain + "Common/GetPartnerId",
            post: {
            },
            method: 'post',
            async: false
        },
        getTokenUser: {  //根据token获取用户信息
            url: configUrl.localloginDomain + 'Common/GetTokenUser',
            post: {
                token: '?'
            },
            method: 'post',
            async: false
        }
    };

})