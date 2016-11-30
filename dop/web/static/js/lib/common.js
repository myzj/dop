define('lib/common', ['lib/makeUrl', 'lib/url'], //
    function (makeUrl, url) {

        $.makeUrl = makeUrl;
        $.log = function (o, title) {
            if (window._debug_) {
                log.log.apply(this, arguments);
            }
        };
        //重置angular 模板
        $.getApp = function () {
            if(!window.app) {
                var app = angular.module('app', []);
                app.config(function ($interpolateProvider) {
                    $interpolateProvider.startSymbol('@{');
                    $interpolateProvider.endSymbol('}@');
                });
                window.app = app;
                return app;
            }else{
                return window.app;
            }
        };

        $.initHeadController = function () {
            var app = $.getApp();
            app.controller('navbar', function ($scope, $http) {
               $scope.logOut = function(){
                   dataInfo = {

                   };
                   $http.get('/api/req_project_list?pageIndex=' + datainfo.pageIndex + '&pageSize=' + datainfo.pageSize)
                        .success(function (data) {
                            if (data.errorcode == 0) {
                                var getdata = data.result.projectList;
                                if (getdata.length < pageSize) {
                                    isLoadOut = false;
                                    $scope.isLast = false;
                                }
                                for (i = 0; i < getdata.length; i++) {
                                    dataArr.push(getdata[i])
                                }
                                $scope.projectArr = dataArr;
                                if(isAutoLoad){
                                    loadDate(true);
                                }
                            } else if (data.errorcode == 300021) {      //300021 列表页码已超出实际页数
                                isLoadOut = false;
                                $scope.isLast = false;
                            }
                        });
               }
           });
        };
        $.initHeadController();

        $.url = url;
        $.loading = function (bool) {
            var html = '<div class="touchweb_mask"><div class="loading" ><div class="gif_img"></div></div></div>';
            if (!bool) {
                $(".touchweb_mask").remove();
            } else {
                $("body").append(html);
                $(".touchweb_mask").css('display', 'block');
            }
        }
        $.xsr = function () {
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

        };
        return $;
    });

