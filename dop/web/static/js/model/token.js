define('model/token', ['lib/jquery-1.9.1.min','api/token', 'config/url','lib/makeUrl'],
    function (undefined,apiToken, configUrl,makeUrl) {
    //服务器接口
    //var apiObj = apiToken.getToken;
    /**
    * 领域对象，传递给服务器的数据
    */
    var bizObj = { token: '', body: { deviceId: 'H5TOUCH', osVersionNo: '1.0', appVersionNo: '1.0'} };

    function grayUser() {
        if (configUrl.environment != 'm') {
            return true;
        }
        var grayh5name = $.cookie.getH5('grayh5name');
        var grayh5errnum = $.cookie.getH5('grayh5errnum');
        if (!grayh5name || grayh5errnum > 30) {
            location.href = $.url.getTouchBaseUrl() + "Grayh5/default";
        }

    }

    //广告模块数据
    function loadModuleDate(data, callback){
         $.xsr($.makeUrl(apiToken.loadModuleDate, data), function (res) {
             try {
                 callback && callback(res);
             } catch (e) {
                 //TODO handle the exception
                 throw e;
             }
         });
    }

    //广告模块数据
    function getMemberInfo(callback){
         $.xsr($.makeUrl(apiToken.getMemberInfo), function (res) {
             try {
                 callback && callback(res);
             } catch (e) {
                 //TODO handle the exception
                 throw e;
             }
         });
    }

    /**
    *
    * @param callback 回调方法
    * @param isForce  1强制从服务器重新获取token，否则优先取cookie值
    */
    function getToken(callback, isForce) {
        //grayUser();
        var token = '';
        if (isForce != 1) {
            token = $.cookie.getH5('token');
            if (token && token.length > 0) {
                callback && callback({ errorCode: 0, body: { token: token} });
                return;
            }
        }
        xsr(makeUrl(apiToken.getToken, bizObj), function (res) {
            try {
                if (res.errorCode == 0) {
                    token = res.body.token;
                    setToken(token);
                }
                callback && callback(res);
            } catch (e) {

                throw e;
            }
        });

    }

    function setToken(token) {
        //写入cookie
        $.cookie.addH5('token', token, '/', 86400 * 365, configUrl.cookieDomain);
        return true;
    }

    function delToken() {
        $.cookie.delH5('token', '/', configUrl.cookieDomain);
        return true;
    }
    //md5
    function getMd5(str, callback) {

        xsr(makeUrl(apiToken.getMD5String, str), function (res) {
            try {
                callback && callback(res);
            } catch (e) {
                //TODO handle the exception
                throw e;
            }
        });
    };
    //获得当前用户ID
    function getUserId(callback) {
        xsr(makeUrl(apiToken.getUserId), function (res) {
            try {
                if (res.userid <= 0) {
                    var gotourl = $.url.getHostUrl() + "Login/Index/?gotourl=" + $.url.getAllDomainUrl();
                    $.log(gotourl);
                    return $.url.redirect(gotourl);
                }
                callback && callback(res.userid);
            } catch (e) {
                //TODO handle the exception
                throw e;
            }
        });
    };

    var xsr = function () {
            var headers = {
                //withCredentials : true
            };
            var timeout = 50000;
            switch (arguments.length) {
                case 1:
                    //一个参数的时候
                    var mixedRequest = arguments[0];
                    if (typeof mixedRequest == 'string') {
                        $.get(mixedRequest);
                    } else if (typeof mixedRequest == 'object') {
                        $.ajax({
                            url: mixedRequest.url,
                            type: mixedRequest.method,
                            timeout: mixedRequest.timeout || timeout,
                            dataType: mixedRequest.dataType || 'json',
                            success: mixedRequest.success,
                            async: mixedRequest.async != undefined ? mixedRequest.async : true,
                            error: mixedRequest.error
                        });
                    } else {
                        //
                    }
                    break;
                case 2:
                    //两个参数的时候, 第2个参数一定是回到方法
                    var mixedRequest = arguments[0], callback = arguments[1];
                    if (typeof mixedRequest == 'string' && typeof callback == 'function') {
                        //get请求
                        $.ajax({
                            url: mixedRequest,
                            type: 'get',
                            timeout: timeout,
                            dataType: 'json',
                            async: mixedRequest.async != undefined ? mixedRequest.async : true,
                            success: callback,
                            error: function (xhr, type, error) {
                                callback({
                                    errorCode: type.toUpperCase()
                                });
                            }
                        });
                    } else if (typeof mixedRequest == 'object' && typeof callback == 'function') {
                        switch (mixedRequest.method) {
                            case 'jsonp':
                                $.ajax({
                                    type: 'get',
                                    dataType: mixedRequest.dataType || 'jsonp',
                                    url: mixedRequest.url,
                                    data: mixedRequest.postData,
                                    headers: mixedRequest.headers || headers,
                                    timeout: mixedRequest.timeout || timeout,
                                    success: callback,
                                    async: mixedRequest.async != undefined ? mixedRequest.async : true,
                                    error: function (xhr, type, error) {
                                        callback({
                                            errorCode: type.toUpperCase()
                                        });
                                    }
                                });
                                break;
                            case 'iframePost':
                                //$.iframePost.apply(this, arguments);
                                break;
                            case 'script':
                                var scriptDom = document.createElement('script');
                                document.body.appendChild(scriptDom);
                                var _timeout = setTimeout(function () {
                                    document.body.removeChild(scriptDom);
                                }, 10000);
                                scriptDom.onload = function () {
                                    clearTimeout(_timeout);
                                    try {
                                        callback();
                                    } catch (e) {

                                    } finally {
                                        document.body.removeChild(scriptDom);
                                    }
                                }
                                scriptDom.src = mixedRequest.url;
                                break;
                            default:
                                if (mixedRequest.urlEncodeCharset) {
                                    headers['urlEncodeCharset'] = mixedRequest.urlEncodeCharset;
                                }
                                if (mixedRequest.method == 'get') {
                                    $.ajax({
                                        type: 'get',
                                        url: mixedRequest.url,
                                        headers: mixedRequest.headers || headers,
                                        timeout: mixedRequest.timeout || timeout,
                                        dataType: mixedRequest.dataType || 'json',
                                        success: callback,
                                        async: mixedRequest.async != undefined ? mixedRequest.async : true,
                                        error: function (xhr, type, error) {
                                            callback({
                                                errorCode: type.toUpperCase()
                                            });
                                        },
                                        withCredentials: mixedRequest.cookie == false ? false : true
                                    });
                                } else {
                                    $.ajax({
                                        url: mixedRequest.url,
                                        type: 'post',
                                        data: mixedRequest.postData,
                                        headers: mixedRequest.headers || headers,
                                        timeout: mixedRequest.timeout || timeout,
                                        dataType: mixedRequest.dataType || 'json',
                                        success: callback,
                                        async: mixedRequest.async != undefined ? mixedRequest.async : true,
                                        error: function (xhr, type, error) {
                                            callback({
                                                errorCode: type.toUpperCase()
                                            });
                                        },
                                        withCredentials: mixedRequest.cookie == false ? false : true
                                    });
                                }
                        }

                    } else {
                        //
                    }
                    break;
                default:
                    //三个参数的时候

            }

        }

    //替换价格
    function queryPromPriceByProdId(dataInfo, callback) {

        xsr(makeUrl(apiToken.queryPromPriceByProdId, dataInfo), function (res) {
            try {
                callback && callback(res);
            } catch (e) {
                //TODO handle the exception
                throw e;
            }
        });
    };
    //获得当前用户信息
    function getUserContext(callback) {

        xsr(makeUrl(apiToken.getUserContext), function (res) {
            try {
                if (res.UserId <= 0) {
                    var gotourl = $.url.getHostUrl() + "Login/Index/?gotourl=" + $.url.getAllDomainUrl();
                    return $.url.redirect(gotourl);
                }

                callback && callback(res);
            } catch (e) {
                //TODO handle the exception
                throw e;
            }
        });
    };
    //获得当前用户ID
    function getUserGuid(callback) {
        xsr(makeUrl(apiToken.getUserGuid), function (res) {
            try {
                callback && callback(res);
            } catch (e) {
                //TODO handle the exception
                throw e;
            }
        });
    };
    //获得当前获取用户等级
    function getUserLevel(callback) {
        xsr(makeUrl(apiToken.getUserLevel), function (res) {
            try {
                callback && callback(res);
            } catch (e) {
                //TODO handle the exception
                throw e;
            }
        });
    };
    //获得当前获取用户Code
    function getUserCode(callback) {
        xsr(makeUrl(apiToken.getUserCode), function (res) {
            try {
                callback && callback(res);
            } catch (e) {
                //TODO handle the exception
                throw e;
            }
        });
    };
    //获得当前获取用户Ip
    function getClientIp(callback) {
        xsr(makeUrl(apiToken.getClientIp), function (res) {
            try {
                callback && callback(res);
            } catch (e) {
                //TODO handle the exception
                throw e;
            }
        });
    };
    //获得当前获取用户Ip
    function getUserInfo() {
        var UserInfo = "";
        xsr(makeUrl(apiToken.getUserInfo), function (res) {
            window.ClientIp = res.ClientIp;
            window.Token = res.Token;
            window.UserGuid = res.UserGuid;
            window.UserId = res.UserId;
            try {
                UserInfo = res;
            } catch (e) {
                //TODO handle the exception
                throw e;
            }
        });
        return UserInfo;
    };

    //获得当前获取用户Ip
    function LoginOut() {
        xsr(makeUrl(apiToken.LoginOut), function (res) {
            try {
            } catch (e) {
                //TODO handle the exception
                throw e;
            }
        });
    };
//获得第三方unionid
    function getUserUnionid(userUnionid) {
        xsr(makeUrl(apiToken.getUserUnionid), function (res) {
            try {
                userUnionid = res;
            } catch (e) {
                //TODO handle the exception
                throw e;
            }
        });
        return userUnionid;
    };

    //微信登录回跳
    function getWeChatRedirect(obj) {

        xsr(makeUrl(apiToken.getWeChatRedirect), function (res) {
            try {
                obj = {
                    wechaturl: res.wechaturl||"",
                    WeChatRedirectUrl: res.WeChatRedirectUrl || ""
                }
            } catch (e) {
                //TODO handle the exception
                throw e;
            }


        });
        return obj;
    };

    //微信注册应用编号
    function GetPartnerId(partnerId) {

        xsr(makeUrl(apiToken.GetPartnerId), function (res) {
            try {
                partnerId = res;
            } catch (e) {
                throw e;
            }
        });
        return partnerId;
    };


    //通过APP返回token 获取用户userid 
    function GetTokenUser(userId) {
        xsr(makeUrl(apiToken.getTokenUser), function (res) {
            try {
                userId = res;
            } catch (e) {
                throw e;
            }
        });
        return userId;
    };

    //获取分享人头像昵称
    function AppSelectMemberHead(dataInfo, callback) {
        var dataInfo = dataInfo || {};
        $.xsr(makeUrl(apiToken.AppSelectMemberHead, dataInfo.post), function (res) {
            try {
                callback && callback(res);
            } catch (e) {
                //TODO handle the exception
                throw e;
            }
        });
    }

    return {
        getToken: getToken,
        setToken: setToken,
        delToken: delToken,
        getBizObj: function () {
            return bizObj;
        },
        getUserLevel: getUserLevel,
        getMd5: getMd5,
        getUserId: getUserId,
        queryPromPriceByProdId: queryPromPriceByProdId,
        getUserContext: getUserContext,
        getUserGuid: getUserGuid,
        getUserCode: getUserCode,
        getClientIp: getClientIp,
        getUserInfo: getUserInfo,
        LoginOut: LoginOut,
        getUserUnionid: getUserUnionid,
        getWeChatRedirect: getWeChatRedirect,
        GetPartnerId: GetPartnerId,
        loadModuleDate:loadModuleDate,
        getMemberInfo: getMemberInfo,
        AppSelectMemberHead:AppSelectMemberHead
        //GetTokenUser: GetTokenUser
    };
});