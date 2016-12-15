/**
 * 埋点处理
 * 备注： 本模块 ，不会依赖任何模块，修改代码时要特别注意， 本模块会放到触屏的所有项目中使用
 *
 */
;(function(window){
    function maidian() {
        
        this.ua = navigator.userAgent;
        this.udid = '';
		this.env = null;
        //屏幕分辨率
        this.resolution = window.screen.width +'|'+ window.screen.height;
		this.cookieDomain = function() {
			var b = /m\.feiniu\.com/i.test(location.href);
			if(b){
				return '.m.feiniu.com';
			} else {
				return location.hostname.split('.').slice(-2).join('.');
			}
		};
        this.getTime = function() {
            return (new Date()).getTime();
        };
        this.randomString = function(length)  {
            var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');
            if (!length) {
                length = Math.floor(Math.random() * chars.length);
            }
            var str = '';
            for (var i = 0; i < length; i++) {
                str += chars[Math.floor(Math.random() * chars.length)];
            }
            return str;
        };

        /**
         * 生成唯一udid
         */
        this.createUdid = function() {
            if(this.udid) {
                return this.udid;
            }
            var udid= "";
            var t = this.getTime();
            udid+= 'H5_' + t + this.randomString(10);
            this.udid = udid;
            return udid;
        };
        this.getcookie = function (name) {
            var r = new RegExp("(^|;|\\s+)" + name + "=([^;]*)(;|$)");
            var m = document.cookie.match(r);
            return (!m ? "" : unescape(m[2]));
        };
        this.addcookie = function (name, v, path, expire, domain) {
            var s = name + "=" + escape(v) + "; path=" + (path || '/') // 默认根目录
                + (domain ? ("; domain=" + domain) : '');
            if (expire > 0) {
                var d = new Date();
                d.setTime(d.getTime() + expire * 1000);
                s += ";expires=" + d.toGMTString();
            }
            document.cookie = s;
        };
        this.delcookie = function(name, path, domain) {
            if (arguments.length == 2) {
                domain = path;
                path = "/"
            }
            document.cookie = name + "=;path=" + path + ";" + (domain ? ("domain=" + domain + ";") : '') + "expires=Thu, 01-Jan-70 00:00:01 GMT";
        };

        //获取设备ID
        this.getUdid = function () {
            var key = 'th5_stat_udid';
            var cookieudid = this.getcookie(key);
            if (cookieudid) return cookieudid;
            var udid = this.createUdid();
            var expire = 86400 * 365;
            var b = /feiniu\.com/i.test(location.href);
            var d='.muyingzhijia.com';
            if(!b){
                d = location.hostname.split('.').slice(-2).join('.');
            }
            this.addcookie(key, udid, '/', expire);
            return udid;
        };
        this.getEnv = function() {
			if(this.env!=null) {
				return this.env;
			}
            //环境 m表生产环境，beta表预发，test表测试环境，dev表开发，local表本地
            var allEnv = ['m','preview','beta','test','dev','local'];
            var environment = 'm';
            var domainSplitAry = location.hostname.split('.');
            if(domainSplitAry[0]) {
                for(var i in allEnv) {
                    if(allEnv[i] == domainSplitAry[0]) {
                        environment = domainSplitAry[0];
                        continue;
                    }
                }
            }
			this.setEnv(environment);
            return environment;
        };
		this.setEnv = function(env) {
			this.env = env;
		};
        //获取操作系统
        this.getSystemType = function () {
            var _ua = this.ua;
                _ua = _ua.toLowerCase();
            // android:1,IOS:2, windowsPhone:3, 其他:9
            var sys = "";
            if(_ua.indexOf('android') > -1 || _ua.indexOf('linux') > -1){
                sys = 'ANDROID';
            } else if(_ua.indexOf('iPhone') > -1 || _ua.indexOf('iPad') > -1 || _ua.indexOf('iTouch') > -1 || _ua.indexOf('iPod') > -1 || _ua.indexOf('mac')> -1) {
                sys = 'IOS';
            } else if(_ua.indexOf("Windows Phone") > -1){
                sys = 'WP';
            } else {
                sys = 'WINDOWS';
            }
            return sys;
        };

        this.mix = function() {
            var re = {};
            for (var i = 0; i < arguments.length; i++) {
                var o = arguments[i];
                for ( var p in o) {
                    if (p in re) {
                        if (o[p] != undefined) {
                            re[p] = o[p];
                        }
                    } else {
                        re[p] = o[p];
                    }
                }
            }
            return re;
        };
		////获取URL指定参数
		this.getUrlParam = function (name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
			var r = location.search.substr(1).match(reg);
			if (r != null) return decodeURIComponent(r[2]);
			return null;
		};
		this.getMessage = function() {
			var _m = this.getUrlParam('fromtype');
			if(_m==null) {
				_m = document.referrer ? document.referrer : '';
			}
			return _m;
		}

        /*
         获取remarks配置信息
         备注信息，只需当第一次进页面或session|token改变时传以下参数
        */
        this.getRemarksCfg = function(){
            var initCfg = {
                terminal_os_ver: "",//系统版本, 触屏传空 或不传
                model: "",//机型  触屏传空 或不传
                brand: "",//品牌  触屏传空 或不传
                resolution: this.resolution,//分辨率
                browser_type: "",//浏览器，触屏不传，服务器自动抓取ua信息
                mac:'' //机器mac地址触屏传空或不传
            }
            return JSON.stringify(this.mix(initCfg));
        };

        //判断是否需要上报客户端信息
        this.isClient = function(){
            var key = 'th5_stat_token';
            var expire = 86400;
            var token = this.getcookie('th5_token') || '';
            var statToken = this.getcookie('th5_stat_token') || '';

            //若两值相等或者statToken为-1则不需上报客户端信息
            if (token && statToken == token) return '';
            if (statToken == '-1') {
                if(token) {
					this.addcookie(key, token, '/', expire, this.cookieDomain());
				}
                return '';
            }

            //都有值且不相等需上报 且要重新种cookie
            if (statToken != token || !statToken){
                var token = token || '-1';
                this.addcookie(key, token, '/', expire, this.cookieDomain());
                
            }
            return this.getRemarksCfg();
        }

        //打开页面时间
        var stime = this.getTime();
        var user_name = this.getcookie('th5_username') || '';
        var city_name = this.getcookie('th5_sitename') || '';
        var user_id = this.getcookie('th5_mem_guid') || '';
        if(!user_id && user_name) {
           user_id = user_name; 
        }
            
        this.urlConfigParam = {
            'udid': this.getUdid(),//登录设备ID
            'user_id': user_id,//用户ID
            'user_name':user_name,
            'terminal_os': this.getSystemType(),//操作系统
            'ver': '1.0.0.0',//app版本
            'traffic_channel': document.referrer ? document.referrer : '-',//来源渠道url  半小时内不动则cookie过期，
            //'ip': '',//IP地址
            'network': '',//联网方式
            'gps':'',//经纬度
            'city': city_name,//当前城市
            'track_tag_name':'',//具体行为
            'result':'',//请求结果
            'page_content':'',//页面内容
            'message':'',//页面详细内容
            'cur_req_url': location.href,//请求URL
            //'datetime':'',
            'startTime': stime,//开始时间
            'endTime': stime,
            'abtest': 0,
            'token': this.getcookie('th5_token'),
            'remarks': ''
        }
        return this.urlConfigParam;
    }

    var h5stat = {
        isObj: 0,
        maidian: maidian()
    }
    window.h5stat = h5stat;
    if (typeof define === 'function' && define.amd) {
        define('widget/stat', [], function() {
            return window.h5stat;
        });
    }
})(window);
